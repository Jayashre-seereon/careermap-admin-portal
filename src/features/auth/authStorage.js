import { useSessionStore } from "../../store/sessionStore";

const AUTH_USER_KEY = "careermap_admin_user";
const AUTH_SESSION_KEY = "careermap_admin_session";
const AUTH_RESET_CODES_KEY = "careermap_admin_reset_codes";

const emitAuthChange = () => {
  window.dispatchEvent(new Event("careermap-auth-changed"));
};

const defaultAdmin = {
  name: "Admin User",
  email: "admin@careermap.io",
  password: "Admin@123",
  avatar: "",
};

const readUsers = () => {
  const raw = localStorage.getItem(AUTH_USER_KEY);

  if (!raw) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify([defaultAdmin]));
    return [defaultAdmin];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Ignore invalid local storage and reseed.
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify([defaultAdmin]));
  return [defaultAdmin];
};

const writeUsers = (users) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(users));
};

const readResetCodes = () => {
  const raw = localStorage.getItem(AUTH_RESET_CODES_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
};

const writeResetCodes = (codes) => {
  localStorage.setItem(AUTH_RESET_CODES_KEY, JSON.stringify(codes));
};

export const getUsers = () => readUsers();

export const getCurrentUser = () => {
  const sessionUser = useSessionStore.getState().user;

  if (sessionUser) {
    return sessionUser;
  }

  const raw = localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const loginUser = ({ email, password }) => {
  const users = readUsers();
  const user = users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase().trim() && item.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const sessionUser = { name: user.name, email: user.email, avatar: user.avatar || "" };
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
  emitAuthChange();
  return sessionUser;
};

export const signupUser = ({ name, email, password }) => {
  const users = readUsers();
  const exists = users.some((item) => item.email.toLowerCase() === email.toLowerCase().trim());

  if (exists) {
    throw new Error("Account already exists with this email.");
  }

  const nextUser = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  };

  writeUsers([...users, nextUser]);
  localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({ name: nextUser.name, email: nextUser.email, avatar: nextUser.avatar || "" })
  );
  emitAuthChange();
  return nextUser;
};

export const resetPassword = ({ email, password }) => {
  const users = readUsers();
  const userIndex = users.findIndex(
    (item) => item.email.toLowerCase() === email.toLowerCase().trim()
  );

  if (userIndex === -1) {
    throw new Error("No account found for this email.");
  }

  const updatedUsers = [...users];
  updatedUsers[userIndex] = {
    ...updatedUsers[userIndex],
    password,
  };

  writeUsers(updatedUsers);
  return updatedUsers[userIndex];
};

export const requestPasswordResetCode = (email) => {
  const users = readUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (!user) {
    throw new Error("No account found for this email.");
  }

  const code = `${Math.floor(100000 + Math.random() * 900000)}`;
  const codes = readResetCodes();

  writeResetCodes({
    ...codes,
    [normalizedEmail]: {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    },
  });

  return {
    email: normalizedEmail,
    code,
  };
};

export const verifyPasswordResetCode = ({ email, code }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const codes = readResetCodes();
  const entry = codes[normalizedEmail];

  if (!entry) {
    throw new Error("Please request a verification code first.");
  }

  if (Date.now() > entry.expiresAt) {
    delete codes[normalizedEmail];
    writeResetCodes(codes);
    throw new Error("Verification code expired. Please request a new code.");
  }

  if (entry.code !== code.trim()) {
    throw new Error("Invalid verification code.");
  }

  return true;
};

export const resetPasswordWithCode = ({ email, code, password }) => {
  verifyPasswordResetCode({ email, code });
  const updatedUser = resetPassword({ email, password });
  const codes = readResetCodes();
  delete codes[email.toLowerCase().trim()];
  writeResetCodes(codes);
  return updatedUser;
};

export const logoutUser = () => {
  useSessionStore.getState().clearSession();
  localStorage.removeItem(AUTH_SESSION_KEY);
  emitAuthChange();
};

export const updateCurrentUserProfile = ({ name, email, avatar = "" }) => {
  const sessionUser = getCurrentUser();

  if (!sessionUser) {
    throw new Error("No active session found.");
  }

  const users = readUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const currentEmail = sessionUser.email.toLowerCase().trim();

  const duplicate = users.find(
    (item) =>
      item.email.toLowerCase().trim() === normalizedEmail &&
      item.email.toLowerCase().trim() !== currentEmail
  );

  if (duplicate) {
    throw new Error("Another account already uses this email.");
  }

  const updatedUsers = users.map((item) =>
    item.email.toLowerCase().trim() === currentEmail
      ? {
          ...item,
          name: name.trim(),
          email: normalizedEmail,
          avatar,
        }
      : item
  );

  writeUsers(updatedUsers);

  const nextSessionUser = {
    name: name.trim(),
    email: normalizedEmail,
    avatar,
  };

  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSessionUser));
  emitAuthChange();
  return nextSessionUser;
};

export const changeCurrentUserPassword = ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  const sessionUser = getCurrentUser();

  if (!sessionUser) {
    throw new Error("No active session found.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New password and confirm password do not match.");
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long.");
  }

  const users = readUsers();
  const currentEmail = sessionUser.email.toLowerCase().trim();
  const userIndex = users.findIndex(
    (item) => item.email.toLowerCase().trim() === currentEmail
  );

  if (userIndex === -1) {
    throw new Error("User account not found.");
  }

  if (users[userIndex].password !== currentPassword) {
    throw new Error("Current password is incorrect.");
  }

  const updatedUsers = [...users];
  updatedUsers[userIndex] = {
    ...updatedUsers[userIndex],
    password: newPassword,
  };

  writeUsers(updatedUsers);
  return true;
};
