import api from "./axios";

export const getDetails = async () => {
  const res = await api.get("/api/details/");
  return res.data;
};

export const createDetails = async (payload) => {
  const res = await api.post("/api/details/", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateDetails = async (id, payload) => {
  const res = await api.put(`/api/details/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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