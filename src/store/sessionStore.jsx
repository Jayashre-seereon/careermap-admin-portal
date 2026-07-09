import { create } from "zustand";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";
const LOGIN_TYPE_KEY = "auth_login_type";
const ROLE_KEY = "auth_role";
const PERMISSIONS_KEY = "auth_permissions";

const getStoredJson = (key) => {
 const value = localStorage.getItem(key);

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
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) || "",
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || "",
  user: getStoredJson(USER_KEY),
  loginType: localStorage.getItem(LOGIN_TYPE_KEY) || "admin",
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
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }

  if (loginType) {
    localStorage.setItem(LOGIN_TYPE_KEY, loginType);
  } else {
    localStorage.removeItem(LOGIN_TYPE_KEY);
  }

  if (role) {
    localStorage.setItem(ROLE_KEY, JSON.stringify(role));
  } else {
    localStorage.removeItem(ROLE_KEY);
  }

  if (permissions) {
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
  } else {
    localStorage.removeItem(PERMISSIONS_KEY);
  }
};

const clearStoredSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LOGIN_TYPE_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(PERMISSIONS_KEY);
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