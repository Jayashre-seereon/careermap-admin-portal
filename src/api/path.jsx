import api from "./axios";

export const getPaths = async () => {
  const res = await api.get("/api/path/");
  return res.data;
};

export const createPath = async (payload, config = {}) => {
  const res = await api.post("/api/path/", payload, config);
  return res.data;
};

export const updatePath = async (id, payload, config = {}) => {
  const res = await api.put(`/api/path/${id}`, payload, config);
  return res.data;
};

export const deletePath = async (id) => {
  const res = await api.delete(`/api/path/${id}`);
  return res.data;
};
