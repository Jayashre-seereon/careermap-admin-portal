import { create } from "zustand";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";
const LOGIN_TYPE_KEY = "auth_login_type";
const ROLE_KEY = "auth_role";
const PERMISSIONS_KEY = "auth_permissions";

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
  loginType: sessionStorage.getItem(LOGIN_TYPE_KEY) || "admin",
  role: getStoredJson(ROLE_KEY),
  permissions: getStoredJson(PERMISSIONS_KEY),
});

const setStoredSession = ({
  accessToken = "",
  refreshToken = "",
  user = null,
  loginType = "admin",
  role = null,
  permissions = null,
}) => {
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

  if (loginType) {
    sessionStorage.setItem(LOGIN_TYPE_KEY, loginType);
  } else {
    sessionStorage.removeItem(LOGIN_TYPE_KEY);
  }

  if (role) {
    sessionStorage.setItem(ROLE_KEY, JSON.stringify(role));
  } else {
    sessionStorage.removeItem(ROLE_KEY);
  }

  if (permissions) {
    sessionStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
  } else {
    sessionStorage.removeItem(PERMISSIONS_KEY);
  }
};

const clearStoredSession = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(LOGIN_TYPE_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(PERMISSIONS_KEY);
};

const initialSession = getStoredSession();

export const useSessionStore = create((set, get) => ({
  accessToken: initialSession.accessToken,
  refreshToken: initialSession.refreshToken,
  user: initialSession.user,
  loginType: initialSession.loginType,
  role: initialSession.role,
  permissions: initialSession.permissions,
  isAuthenticated: Boolean(initialSession.accessToken),
  
  setSession: ({
    accessToken = "",
    refreshToken = "",
    user = null,
    loginType = "admin",
    role = null,
    permissions = null,
  }) => {
    const nextSession = { accessToken, refreshToken, user, loginType, role, permissions };
    setStoredSession(nextSession);
    set({
      accessToken: nextSession.accessToken,
      refreshToken: nextSession.refreshToken,
      user: nextSession.user,
      loginType: nextSession.loginType,
      role: nextSession.role,
      permissions: nextSession.permissions,
      isAuthenticated: Boolean(nextSession.accessToken),
    });
  },

  clearSession: () => {
    clearStoredSession();
    set({
      accessToken: "",
      refreshToken: "",
      user: null,
      loginType: "admin",
      role: null,
      permissions: null,
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

  // loginType === "admin" always passes (admins bypass module-level checks).
  // loginType === "staff" checks the staff's permissions array for that module + action.
 hasPermission: (moduleName, action = "canView") => {
  const { loginType, permissions } = get();

  if (loginType !== "staff") return true;

  const permission = permissions?.find(
    (p) => p.module === moduleName
  );

  return Boolean(permission?.[action]);
},
}));

export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, LOGIN_TYPE_KEY, ROLE_KEY, PERMISSIONS_KEY };