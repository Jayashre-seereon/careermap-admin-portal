import api from "./axios";

const questionsUrl = (sectionId) =>
  `/api/psychometric-assessment/admin/assessment-sections/${sectionId}/questions`;

const sectionQuestionsUrl = (sectionId) =>
  `/api/psychometric-assessment/admin/sections/${sectionId}/questions`;

export const getQuestions = async (sectionId) => (await api.get(sectionQuestionsUrl(sectionId))).data;
export const createQuestion = async (sectionId, payload) => (await api.post(questionsUrl(sectionId), payload)).data;
export const updateQuestion = async (sectionId, questionId, payload) =>
  (await api.put(`/api/psychometric-assessment/admin/questions/${questionId}`, payload)).data;
export const deleteQuestion = async (sectionId, questionId) =>
  (await api.delete(`/api/psychometric-assessment/admin/questions/${questionId}`)).data;
