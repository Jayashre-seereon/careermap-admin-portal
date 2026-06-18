import axios from "axios";
import { useSessionStore } from "../store/sessionStore";
import { refreshAccessToken } from "./authApi";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const { accessToken, refreshToken } = useSessionStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (refreshToken) {
      config.headers["x-refresh-token"] = refreshToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isAuthEndpoint =
      requestUrl.includes("/api/admin/auth/login") ||
      requestUrl.includes("/api/admin/auth/refresh-token");

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
        const { refreshToken, loginType } = useSessionStore.getState();
        if (loginType === "staff") {
    return Promise.reject(error);
  }
      try {
        // const { refreshToken } = useSessionStore.getState();
        if (!refreshToken) {
      throw new Error("Refresh token not found");
    }
        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        const refreshResponse = await refreshAccessToken(refreshToken);
        const newAccessToken =
          refreshResponse?.accessToken ||
          refreshResponse?.data?.accessToken ||
          refreshResponse?.data?.data?.accessToken ||
          "";

        if (!newAccessToken) {
          throw new Error("New access token not found");
        }

        useSessionStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        useSessionStore.getState().clearSession();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
