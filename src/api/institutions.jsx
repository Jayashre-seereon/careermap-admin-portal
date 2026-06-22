import api from "./axios";

export const getInstitutes = async () => {
  const res = await api.get("/api/institutcreate/");
  return res.data;
};

export const createInstitute = async (payload, config = {}) => {
  const res = await api.post("/api/institutcreate/", payload, config);
  return res.data;
};

export const updateInstitute = async (id, payload, config = {}) => {
  const res = await api.put(`/api/institutcreate/${id}`, payload, config);
  return res.data;
};

export const deleteInstitute = async (id) => {
  const res = await api.delete(`/api/institutcreate/${id}`);
  return res.data;
};