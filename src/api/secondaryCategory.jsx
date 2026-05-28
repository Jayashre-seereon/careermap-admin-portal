import api from "./axios";

export const getSecondaryCategories = async () => {
  const res = await api.get("/api/secondarycategories/");
  return res.data;
};

export const getSecondaryCategoriesByCategory = async (categoryId) => {
  const res = await api.get(`/api/secondarycategories/category/${categoryId}`);
  return res.data;
};

export const createSecondaryCategory = async (payload, config = {}) => {
  const res = await api.post("/api/secondarycategories/", payload, config);
  return res.data;
};

export const updateSecondaryCategory = async (id, payload, config = {}) => {
  const res = await api.put(`/api/secondarycategories/${id}`, payload, config);
  return res.data;
};

export const deleteSecondaryCategory = async (id) => {
  const res = await api.delete(`/api/secondarycategories/${id}`);
  return res.data;
};
