import api from "./axios";

export const getHelpAndSupports = async () => {
  const res = await api.get("/api/helpandsupport/");
  return res.data;
};

export const updateHelpAndSupportStatus = async (id, status) => {
  const res = await api.put(`/api/helpandsupport/${id}/status`, { status });
  return res.data;
};
