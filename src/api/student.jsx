import api from "./axios";

export const getStudents = async () => {
  const res = await api.get("/api/student/");
  return res.data;
};

export const createStudent = async (payload, config = {}) => {
  const res = await api.post("/api/student/", payload, config);
  return res.data;
};

export const updateStudent = async (id, payload, config = {}) => {
  const res = await api.put(`/api/student/${id}`, payload, config);
  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await api.delete(`/api/student/${id}`);
  return res.data;
};