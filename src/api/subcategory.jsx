import api from "./axios";

export const getSubCategories = async () => {
  const res = await api.get("/api/subcategories/");
  return res.data;
};

export const getSubCategoriesBySecondCategory = async (secondCategoryId) => {
  const res = await api.get(`/api/subcategories/second/${secondCategoryId}`);
  return res.data;
};

export const createSubCategory = async (payload, config = {}) => {
  const res = await api.post("/api/subcategories/", payload, config);
  return res.data;
};

export const updateSubCategory = async (id, payload, config = {}) => {
  const res = await api.put(`/api/subcategories/${id}`, payload, config);
  return res.data;
};

export const deleteSubCategory = async (id) => {
  const res = await api.delete(`/api/subcategories/${id}`);
  return res.data;
};
