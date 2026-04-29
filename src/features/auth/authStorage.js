const AUTH_USER_KEY = "careermap_admin_user";
const AUTH_SESSION_KEY = "careermap_admin_session";
const AUTH_RESET_CODES_KEY = "careermap_admin_reset_codes";

const defaultAdmin = {
  name: "Admin User",
  email: "admin@careermap.io",
  password: "Admin@123",
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

  const sessionUser = { name: user.name, email: user.email };
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
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
    JSON.stringify({ name: nextUser.name, email: nextUser.email })
  );
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
  localStorage.removeItem(AUTH_SESSION_KEY);
};
