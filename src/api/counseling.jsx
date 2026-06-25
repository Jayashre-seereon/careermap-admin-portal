import api from "./axios";

// GET
export const getCounselings = async () => {
  const res = await api.get("/api/counseling/");
  return res.data;
};

// POST
export const createCounseling = async (payload, config = {}) => {
  const res = await api.post("/api/counseling/", payload, config);
  return res.data;
};

// PUT — trailing slash made consistent with GET/POST
export const updateCounseling = async (id, payload, config = {}) => {
  const res = await api.put(`/api/counseling/${id}/`, payload, config);
  return res.data;
};

// DELETE — trailing slash made consistent with GET/POST
export const deleteCounseling = async (id) => {
  const res = await api.delete(`/api/counseling/${id}/`);
  return res.data;
};

// DOWNLOAD PDF
export const downloadCounselingReport = async (id) => {
  const res = await api.get(`/api/counseling/${id}/report`, {
    responseType: "blob", // IMPORTANT for file download
  });
  return res.data;
};