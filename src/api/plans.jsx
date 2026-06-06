import api from "./axios";

export const getPlans = async () => {
  const res = await api.get("/api/plans/");
  return res.data;
};

export const createPlan = async (payload, config = {}) => {
  const res = await api.post("/api/plans/", payload, config);
  return res.data;
};

export const updatePlan = async (id, payload, config = {}) => {
  const res = await api.put(`/api/plans/${id}`, payload, config);
  return res.data;
};

export const deletePlan = async (id) => {
  const res = await api.delete(`/api/plans/${id}`);
  return res.data;
};
