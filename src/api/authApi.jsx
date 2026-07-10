import axios from "axios";
import api from "./axios";
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  const res = await authClient.post("/api/admin/auth/login", { email, password });
  return res.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const res = await authClient.post("/api/admin/auth/refresh-token", {
    refreshToken,
  });

  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await authClient.post("/api/admin/auth/forgot-password", {
    email,
  });

  return res.data;
};

export const resetPassword = async (token, password) => {
  const res = await authClient.post("/api/admin/auth/reset-password", {
    token,
    password,
  });

  return res.data;
};

export const staffLogin = async (email, password) => {
  const res = await authClient.post("/api/staff/login", { email, password });
  return res.data;
};

export const logout = async (refreshToken) => {
  const res = await api.post("/api/admin/auth/logout", {
    refreshToken,
  });

  return res.data;
};

export const changeAdminPassword = async ({ oldPassword, newPassword }) => {
  const res = await api.post("/api/admin/auth/change-password", {
    oldPassword,
    newPassword,
  });

  return res.data;
};

export const instituteLogin = async (email, password) => {
  const res = await authClient.post("/api/institutcreate/login", { email, password });
  return res.data;
};

export const getApiErrorMessage = (error, fallbackMessage = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallbackMessage;
