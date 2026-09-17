import api from "./axios";

const questionsUrl = (sectionId) =>
  `/api/psychometric-assessment/admin/assessment-sections/${sectionId}/questions`;

export const getQuestions = async (sectionId) => (await api.get(questionsUrl(sectionId))).data;
export const createQuestion = async (sectionId, payload) => (await api.post(questionsUrl(sectionId), payload)).data;
export const updateQuestion = async (sectionId, questionId, payload) =>
  (await api.put(`${questionsUrl(sectionId)}/${questionId}`, payload)).data;
export const deleteQuestion = async (sectionId, questionId) =>
  (await api.delete(`${questionsUrl(sectionId)}/${questionId}`)).data;
