import api from "./axios";
import { useSessionStore } from "../store/sessionStore";

const getLoginType = () => useSessionStore.getState().loginType;
const isStaffSession = () => getLoginType() === "staff";

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

const assertInstituteSession = () => {
  const { loginType, accessToken } = useSessionStore.getState();
  const token = accessToken || localStorage.getItem("institute_access_token");
  if (loginType !== "institute" || !token) {
    throw new Error("Please sign in with your institute account to view counseling reports.");
  }
};

export const getInstituteCounselingReports = async () => {
  assertInstituteSession();
  // Use the same Axios client and institute-session interceptor as /api/institutcreate/dashboard.
  const res = await api.get("/api/counseling/institute-reports");
  return res.data;
};

// GET
export const getCounselings = async () => {
  if (getLoginType() === "institute") {
    return getInstituteCounselingReports();
  }
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
  const isInstitute = getLoginType() === "institute";
  if (isInstitute) assertInstituteSession();
  const config = isInstitute ? {} : getCounselingAuthConfig();
  const path = isInstitute
    ? `/api/counseling/${id}/report`
    : `/api/counseling/${id}/report`;
  const res = await api.get(path, { ...config,
    responseType: "blob", // IMPORTANT for file download
  });
  return res.data;
};
