import api from "./axios";

export const getStudyAbroadItems = async () => {
  const res = await api.get("/api/studyabroad/");
  return res.data;
};

export const createStudyAbroadItem = async (payload) => {
  const res = await api.post("/api/studyabroad/", payload);
  return res.data;
};

export const updateStudyAbroadItem = async (id, payload) => {
  const res = await api.put(`/api/studyabroad/${id}`, payload);
  return res.data;
};

export const deleteStudyAbroadItem = async (id) => {
  const res = await api.delete(`/api/studyabroad/${id}`);
  return res.data;
};
