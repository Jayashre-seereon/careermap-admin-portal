import api from "./axios";

export const login = async (email, password) => {
  const res = await api.post("/api/admin/auth/login", { email, password });
  return res.data;
};
  