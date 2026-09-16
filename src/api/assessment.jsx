
import api from "./axios";

export const getAssessments = async () => {
  const res = await api.get(
    "/api/psychometric-assessment/admin/assessments"
  );

  return res.data;
};

export const createAssessment = async (payload) => {
  const res = await api.post(
    "/api/psychometric-assessment/admin/assessments",
    payload
  );

  return res.data;
};

export const updateAssessment = async (id, payload) => {
  const res = await api.put(
    `/api/psychometric-assessment/admin/assessments/${id}`,
    payload
  );

  return res.data;
};

export const deleteAssessment = async (id) => {
  const res = await api.delete(
    `/api/psychometric-assessment/admin/assessments/${id}`
  );

  return res.data;
};

