import api from "./axios";

export const getAllUsers = async () => {
  const res = await api.get("/api/user/admin/users");
  return res.data;
};

export const banUser = (id) => {
  return api.put(`/api/user/admin/users/${id}/ban`);
};

export const unbanUser = (id) => {
  return api.put(`/api/user/admin/users/${id}/unban`);
};

// Server-side paginated list: { page, limit, search, status: "active" | "banned" | "" }
export const getUsersPage = async (params = {}) => {
  const res = await api.get("/api/user/admin/users", { params });
  return res.data;
};
