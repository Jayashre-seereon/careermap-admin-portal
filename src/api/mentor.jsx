import api from "./axios";

export const getMentors = async () => {
  const res = await api.get("/api/mentor/");
  return res.data;
};

export const createMentor = async (payload, config = {}) => {
  const res = await api.post("/api/mentor/", payload, config);
  return res.data;
};

export const updateMentor = async (id, payload, config = {}) => {
  const res = await api.put(`/api/mentor/${id}`, payload, config);
  return res.data;
};

export const deleteMentor = async (id) => {
  const res = await api.delete(`/api/mentor/${id}`);
  return res.data;
};
