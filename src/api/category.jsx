import api from "./axios";

export const getCategories = async () => {
  const res = await api.get("/api/categories/");
  return res.data;
};

export const createCategory = async (payload, config = {}) => {
  const res = await api.post("/api/categories/", payload, config);
  return res.data;
};

export const updateCategory = async (id, payload, config = {}) => {
  const res = await api.put(`/api/categories/${id}`, payload, config);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/api/categories/${id}`);
  return res.data;
};
