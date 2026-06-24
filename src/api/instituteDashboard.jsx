import api from "./axios";

export const getInstituteDashboard = async () => {
  const res = await api.get("/api/institutcreate/dashboard");
  return res.data;
};
