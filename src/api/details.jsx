import api from "./axios";

export const getDetails = async () => {
  const res = await api.get("/api/details/");
  return res.data;
};

export const createDetails = async (payload, config = {}) => {
  const res = await api.post("/api/details/", payload, config);
  return res.data;
};

export const updateDetails = async (id, payload, config = {}) => {
  const res = await api.put(`/api/details/${id}`, payload, config);
  return res.data;
};

export const deleteDetails = async (id) => {
  const res = await api.delete(`/api/details/${id}`);
  return res.data;
};

export const getDetailsById = async (id) => {
  const res = await api.get(`/api/details/${id}`);
  return res.data;
};