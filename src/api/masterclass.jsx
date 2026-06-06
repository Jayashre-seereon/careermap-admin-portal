import api from "./axios";

export const getMasterClasses = async () => {
  const res = await api.get("/api/masterclass/");
  return res.data;
};

export const createMasterClass = async (payload, config = {}) => {
  const res = await api.post("/api/masterclass/", payload, config);
  return res.data;
};

export const updateMasterClass = async (id, payload, config = {}) => {
  const res = await api.put(`/api/masterclass/${id}`, payload, config);
  return res.data;
};

export const deleteMasterClass = async (id) => {
  const res = await api.delete(`/api/masterclass/${id}`);
  return res.data;
};
