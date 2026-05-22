import api from "./axios";

export const getQuizzes = async () => {
  const res = await api.get("/api/quiz/");
  return res.data;
};

export const getQuizById = async (id) => {
  const res = await api.get(`/api/quiz/${id}`);
  return res.data;
};

export const createQuiz = async (payload, config = {}) => {
  const res = await api.post("/api/quiz/", payload, config);
  return res.data;
};

export const updateQuiz = async (id, payload, config = {}) => {
  const res = await api.put(`/api/quiz/${id}`, payload, config);
  return res.data;
};

export const deleteQuiz = async (id) => {
  const res = await api.delete(`/api/quiz/${id}`);
  return res.data;
};

export const getQuizQuestions = async (quizId) => {
  const res = await api.get(`/api/quiz/${quizId}`);
  return res.data;
};

export const createQuizQuestion = async (payload, config = {}) => {
  const res = await api.post("/api/quiz/question", payload, config);
  return res.data;
};

export const updateQuizQuestion = async (id, payload, config = {}) => {
  const res = await api.put(`/api/quiz/question/${id}`, payload, config);
  return res.data;
};

export const deleteQuizQuestion = async (id) => {
  const res = await api.delete(`/api/quiz/question/${id}`);
  return res.data;
};
