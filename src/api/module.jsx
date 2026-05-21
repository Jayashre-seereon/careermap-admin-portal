import api from "./axios";

export const getModules = async () => {
  const res = await api.get("/api/modules");
  return res.data;
};

export const createModule = async (payload, config = {}) => {
  const res = await api.post("/api/modules", payload, config);
  return res.data;
};

export const updateModule = async (id, payload, config = {}) => {
  const res = await api.put(`/api/modules/${id}`, payload, config);
  return res.data;
};

export const deleteModule = async (id) => {
  const res = await api.delete(`/api/modules/${id}`);
  return res.data;
};
