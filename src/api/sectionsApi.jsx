import api from "./axios";

// GET all sections
export const getAssessmentSections = async () => {
  const response = await api.get(
    "/api/psychometric-assessment/admin/sections"
  );

  return response.data;
};

// CREATE section
export const createAssessmentSection = async (
  assessmentId,
  payload
) => {
  const response = await api.post(
    `/api/psychometric-assessment/admin/assessments/${assessmentId}/sections`,
    payload
  );

  return response.data;
};

// UPDATE section
export const updateAssessmentSection = async (
  sectionId,
  payload
) => {
  const response = await api.put(
    `/api/psychometric-assessment/admin/sections/${sectionId}`,
    payload
  );

  return response.data;
};

// DELETE section
export const deleteAssessmentSection = async (
  sectionId
) => {
  const response = await api.delete(
    `/api/psychometric-assessment/admin/sections/${sectionId}`
  );

  return response.data;
};
