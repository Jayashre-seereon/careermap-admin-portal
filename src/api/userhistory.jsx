import api from "./axios";

export const getUserHistory = async () => {
  const res = await api.get("/api/userhistory/");
  return res.data;
};
