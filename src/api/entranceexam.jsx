import api from "./axios";

export const getEntranceExams = async () => {
  const res = await api.get("/api/entranceexam/");
  return res.data;
};

export const createEntranceExam = async (payload, config = {}) => {
  const res = await api.post("/api/entranceexam/", payload, config);
  return res.data;
};

export const updateEntranceExam = async (id, payload, config = {}) => {
  const res = await api.put(`/api/entranceexam/${id}`, payload, config);
  return res.data;
};

export const deleteEntranceExam = async (id) => {
  const res = await api.delete(`/api/entranceexam/${id}`);
  return res.data;
};
