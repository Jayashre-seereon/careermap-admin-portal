import api from "./axios";

export const getUserHistory = async (params = {}) => {
  const res = await api.get("/api/userhistory/", { params });
  return res.data;
};
