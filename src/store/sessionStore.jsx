import { create } from "zustand";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

const getStoredJson = (key) => {
  const value = sessionStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getStoredSession = () => ({
  accessToken: sessionStorage.getItem(ACCESS_TOKEN_KEY) || "",
  refreshToken: sessionStorage.getItem(REFRESH_TOKEN_KEY) || "",
  user: getStoredJson(USER_KEY),
});

const setStoredSession = ({ accessToken = "", refreshToken = "", user = null }) => {
  if (accessToken) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } else {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  if (refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(USER_KEY);
  }
};

const clearStoredSession = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

const initialSession = getStoredSession();

export const useSessionStore = create((set) => ({
  accessToken: initialSession.accessToken,
  refreshToken: initialSession.refreshToken,
  user: initialSession.user,
  isAuthenticated: Boolean(initialSession.accessToken),

  setSession: ({ accessToken = "", refreshToken = "", user = null }) => {
    const nextSession = { accessToken, refreshToken, user };

    setStoredSession(nextSession);
    set({
      accessToken: nextSession.accessToken,
      refreshToken: nextSession.refreshToken,
      user: nextSession.user,
      isAuthenticated: Boolean(nextSession.accessToken),
    });
  },

  clearSession: () => {
    clearStoredSession();
    set({
      accessToken: "",
      refreshToken: "",
      user: null,
      isAuthenticated: false,
    });
  },

  setAccessToken: (accessToken) => {
    set((state) => {
      const nextState = { ...state, accessToken, isAuthenticated: Boolean(accessToken) };
      setStoredSession(nextState);
      return {
        accessToken,
        isAuthenticated: Boolean(accessToken),
      };
    });
  },

  setRefreshToken: (refreshToken) => {
    set((state) => {
      const nextState = { ...state, refreshToken };
      setStoredSession(nextState);
      return { refreshToken };
    });
  },

  setUser: (user) => {
    set((state) => {
      const nextState = { ...state, user };
      setStoredSession(nextState);
      return { user };
    });
  },
}));

export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY };
