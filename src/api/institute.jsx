import api from "./axios";

export const getInstitutes = async () => {
  const res = await api.get("/api/institutes/");
  return res.data;
};

export const createInstitute = async (payload, config = {}) => {
  const res = await api.post("/api/institutes/", payload, config);
  return res.data;
};

export const updateInstitute = async (id, payload, config = {}) => {
  const res = await api.put(`/api/institutes/${id}`, payload, config);
  return res.data;
};

export const deleteInstitute = async (id) => {
  const res = await api.delete(`/api/institutes/${id}`);
  return res.data;
};
