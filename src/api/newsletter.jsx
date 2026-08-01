import api from "./axios";

export const getNewsletters = async () => {
  const res = await api.get("/api/newsletter/");
  return res.data;
};

export const getNewsletterById = async (id) => {
  const res = await api.get(`/api/newsletter/${id}`);
  return res.data;
};

export const createNewsletter = async (payload, config = {}) => {
  const res = await api.post("/api/newsletter/", payload, config);
  return res.data;
};

export const updateNewsletter = async (id, payload, config = {}) => {
  const res = await api.put(`/api/newsletter/${id}`, payload, config);
  return res.data;
};

export const deleteNewsletter = async (id) => {
  const res = await api.delete(`/api/newsletter/${id}`);
  return res.data;
};