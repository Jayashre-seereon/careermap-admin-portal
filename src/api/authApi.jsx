import axios from "axios";

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
