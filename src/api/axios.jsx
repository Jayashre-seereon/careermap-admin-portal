import axios from "axios";
import { useSessionStore } from "../store/sessionStore";
import { refreshAccessToken } from "./authApi";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useSessionStore.getState();
    const requestToken = accessToken;

    if (requestToken) {
      config.headers.Authorization = `Bearer ${requestToken}`;
    }

    // The refresh token is only sent in the body of /refresh-token and /logout,
    // never as a header on ordinary API requests.

    return config;
  },
  (error) => Promise.reject(error)
);

let refreshPromise = null;
let sessionExpiredHandled = false;

const endSession = (path) => {
  useSessionStore.getState().clearSession();
  if (typeof window !== "undefined" && !sessionExpiredHandled) {
    sessionExpiredHandled = true;
    if (window.location.pathname !== path) {
      window.location.assign(path);
    } else {
      sessionExpiredHandled = false;
    }
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isAuthEndpoint =
      requestUrl.includes("/api/admin/auth/login") ||
      requestUrl.includes("/api/admin/auth/refresh-token") ||
      requestUrl.includes("/api/staff/login") ||
      requestUrl.includes("/api/institutcreate/login") ||
      requestUrl.includes("/api/institute/login");

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      const { refreshToken, loginType } = useSessionStore.getState();

      if (loginType === "institute") {
        endSession("/institute/login");
        return Promise.reject(error);
      }

      // Staff tokens do not use the admin refresh endpoint and expire after
      // a day: clear the session and send the user back to the login page.
      if (loginType !== "admin") {
        endSession("/login");
        return Promise.reject(error);
      }

      try {
        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        // Share a single in-flight refresh between all concurrent 401s.
        if (!refreshPromise) {
          refreshPromise = (async () => {
            const refreshResponse = await refreshAccessToken(refreshToken);
            const token =
              refreshResponse?.accessToken ||
              refreshResponse?.data?.accessToken ||
              refreshResponse?.data?.data?.accessToken ||
              "";
            if (!token) {
              throw new Error("New access token not found");
            }
            useSessionStore.getState().setAccessToken(token);
            return token;
          })().finally(() => {
            refreshPromise = null;
          });
        }

        const newAccessToken = await refreshPromise;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        endSession("/login");
        return Promise.reject(error?.response ? error : refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
