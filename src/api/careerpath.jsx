import api from "./axios";

export const getCareerPaths = async () => {
  const res = await api.get("/api/careerpath/");
  return res.data;
};

export const createCareerPath = async (payload, config = {}) => {
  const res = await api.post("/api/careerpath/", payload, config);
  return res.data;
};

export const updateCareerPath = async (id, payload, config = {}) => {
  const res = await api.put(`/api/careerpath/${id}`, payload, config);
  return res.data;
};

export const deleteCareerPath = async (id) => {
  const res = await api.delete(`/api/careerpath/${id}`);
  return res.data;
};
