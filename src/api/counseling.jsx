import api from "./axios";
import { useSessionStore } from "../store/sessionStore";

const isStaffSession = () => useSessionStore.getState().loginType === "staff";

const getCounselingAuthConfig = (config = {}) => {
  const token =
    useSessionStore.getState().accessToken ||
    localStorage.getItem("token") ||
    localStorage.getItem("staffToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("access_token");

  return {
    ...config,
    headers: {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// GET
export const getCounselings = async () => {
  const res = await api.get(
    isStaffSession() ? "/api/counseling/my-reports" : "/api/counseling/",
    getCounselingAuthConfig()
  );
  return res.data;
};

// POST
export const createCounseling = async (payload, config = {}) => {
  const url = isStaffSession() ? "/api/counseling" : "/api/counseling/";
  const res = await api.post(url, payload, getCounselingAuthConfig(config));
  return res.data;
};

export const getCounseling = async (id) => {
  const res = await api.get(`/api/counseling/${id}`, getCounselingAuthConfig());
  return res.data;
};

// PUT — trailing slash made consistent with GET/POST
export const updateCounseling = async (id, payload, config = {}) => {
  const res = await api.put(`/api/counseling/${id}/`, payload, getCounselingAuthConfig(config));
  return res.data;
};

// DELETE — trailing slash made consistent with GET/POST
export const deleteCounseling = async (id) => {
  const res = await api.delete(`/api/counseling/${id}/`, getCounselingAuthConfig());
  return res.data;
};

// DOWNLOAD PDF
export const downloadCounselingReport = async (id) => {
  const res = await api.get(`/api/counseling/${id}/report`, getCounselingAuthConfig({
    responseType: "blob", // IMPORTANT for file download
  }));
  return res.data;
};
