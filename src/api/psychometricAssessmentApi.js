import api from "./axios";

const BASE_PREFIX = "/api/psychometric-assessment";

// Helper to extract error message
export const getApiErrorMessage = (error, fallbackMessage = "An error occurred") => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
};

// ==========================================
// 1. ASSESSMENTS
// ==========================================

export const getAssessments = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await api.get(`${BASE_PREFIX}/admin/assessments${queryString}`);
  return res.data;
};

export const getAssessmentById = async (assessmentId) => {
  const res = await api.get(`${BASE_PREFIX}/admin/assessments/${assessmentId}`);
  return res.data;
};

export const createAssessment = async (payload) => {
  const res = await api.post(`${BASE_PREFIX}/admin/assessments`, payload);
  return res.data;
};

export const updateAssessment = async (assessmentId, payload) => {
  const res = await api.put(`${BASE_PREFIX}/admin/assessments/${assessmentId}`, payload);
  return res.data;
};

export const updateAssessmentStatus = async (assessmentId, status) => {
  const res = await api.patch(`${BASE_PREFIX}/admin/assessments/${assessmentId}/status`, {
    status,
  });
  return res.data;
};

export const deleteAssessment = async (assessmentId) => {
  const res = await api.delete(`${BASE_PREFIX}/admin/assessments/${assessmentId}`);
  return res.data;
};

// ==========================================
// 2. SECTIONS
// ==========================================

export const getSections = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.assessmentId) query.append("assessmentId", params.assessmentId);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await api.get(`${BASE_PREFIX}/admin/sections${queryString}`);
  return res.data;
};

export const getSectionsByAssessment = async (assessmentId) => {
  const res = await api.get(`${BASE_PREFIX}/admin/assessments/${assessmentId}/sections`);
  return res.data;
};

export const createSection = async (assessmentId, payload) => {
  const res = await api.post(
    `${BASE_PREFIX}/admin/assessments/${assessmentId}/sections`,
    payload
  );
  return res.data;
};

export const updateSection = async (sectionId, payload) => {
  const res = await api.put(`${BASE_PREFIX}/admin/sections/${sectionId}`, payload);
  return res.data;
};

export const deleteSection = async (sectionId) => {
  const res = await api.delete(`${BASE_PREFIX}/admin/sections/${sectionId}`);
  return res.data;
};

// ==========================================
// 3. QUESTIONS
// ==========================================

export const getAllQuestions = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.sectionId && params.sectionId !== "all") query.append("sectionId", params.sectionId);
  if (params.assessmentId && params.assessmentId !== "all") query.append("assessmentId", params.assessmentId);
  if (params.type && params.type !== "all") query.append("type", params.type);
  if (params.facet && params.facet !== "all") query.append("facet", params.facet);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await api.get(`${BASE_PREFIX}/admin/questions${queryString}`);
  return res.data;
};

export const getQuestionsBySection = async (sectionId) => {
  try {
    const res = await api.get(`${BASE_PREFIX}/admin/sections/${sectionId}/questions`);
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      return getAllQuestions({ sectionId });
    }
    throw err;
  }
};

export const getQuestionsByAssessment = async (assessmentId) => {
  try {
    const res = await api.get(`${BASE_PREFIX}/admin/assessments/${assessmentId}/questions`);
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      return getAllQuestions({ assessmentId });
    }
    throw err;
  }
};

export const seedDefaultQuestions = async (payload = {}) => {
  const body =
    typeof payload === "number" || typeof payload === "string"
      ? { assessmentId: payload }
      : payload;
  const res = await api.post(`${BASE_PREFIX}/admin/questions/seed-defaults`, body);
  return res.data;
};

export const createQuestion = async (sectionId, payload) => {
  try {
    const res = await api.post(
      `${BASE_PREFIX}/admin/sections/${sectionId}/questions`,
      payload
    );
    return res.data;
  } catch (err) {
    if (err?.response?.status === 404) {
      const res = await api.post(`${BASE_PREFIX}/admin/questions`, {
        ...payload,
        sectionId,
      });
      return res.data;
    }
    throw err;
  }
};

export const updateQuestion = async (questionId, payload) => {
  const res = await api.put(`${BASE_PREFIX}/admin/questions/${questionId}`, payload);
  return res.data;
};

export const deleteQuestion = async (questionId) => {
  const res = await api.delete(`${BASE_PREFIX}/admin/questions/${questionId}`);
  return res.data;
};

// ==========================================
// 4. CAREER CLUSTERS & DOMAIN WEIGHTS
// ==========================================

export const getCareerClusters = async () => {
  const res = await api.get(`${BASE_PREFIX}/admin/career-clusters`);
  return res.data;
};

export const getCareerClusterById = async (clusterId) => {
  const res = await api.get(`${BASE_PREFIX}/admin/career-clusters/${clusterId}`);
  return res.data;
};

export const seedDefaultCareerClusters = async () => {
  const res = await api.post(`${BASE_PREFIX}/admin/career-clusters/seed-defaults`);
  return res.data;
};

export const createCareerCluster = async (payload) => {
  const res = await api.post(`${BASE_PREFIX}/admin/career-clusters`, payload);
  return res.data;
};

export const updateCareerCluster = async (clusterId, payload) => {
  const res = await api.put(`${BASE_PREFIX}/admin/career-clusters/${clusterId}`, payload);
  return res.data;
};

export const deleteCareerCluster = async (clusterId) => {
  const res = await api.delete(`${BASE_PREFIX}/admin/career-clusters/${clusterId}`);
  return res.data;
};

export const updateClusterWeights = async (clusterId, weightsPayload) => {
  // weightsPayload can be { weights: [{ facet: "R", weight: 3 }, ...] } or [{ facet: "R", weight: 3 }]
  const body = Array.isArray(weightsPayload) ? { weights: weightsPayload } : weightsPayload;
  const res = await api.put(
    `${BASE_PREFIX}/admin/career-clusters/${clusterId}/weights`,
    body
  );
  return res.data;
};

// ==========================================
// 5. CANDIDATE ATTEMPTS & AUDIT
// ==========================================

export const getStudentAttempts = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.assessmentId) query.append("assessmentId", params.assessmentId);
  if (params.status && params.status !== "all") query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await api.get(`${BASE_PREFIX}/admin/attempts${queryString}`);
  return res.data;
};

export const getAttemptDetails = async (attemptId) => {
  const res = await api.get(`${BASE_PREFIX}/admin/attempts/${attemptId}`);
  return res.data;
};

export const recalculateAttempt = async (attemptId) => {
  const res = await api.post(`${BASE_PREFIX}/admin/attempts/${attemptId}/recalculate`);
  return res.data;
};
