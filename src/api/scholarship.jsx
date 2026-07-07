import api from "./axios";

export const getScholarships = async () => {
  const res = await api.get("/api/scholarship/");
  return res.data;
};

export const createScholarship = async (payload, config = {}) => {
  const res = await api.post("/api/scholarship/", payload, config);
  return res.data;
};

export const updateScholarship = async (id, payload, config = {}) => {
  const res = await api.put(`/api/scholarship/${id}`, payload, config);
  return res.data;
};

export const deleteScholarship = async (id) => {
  const res = await api.delete(`/api/scholarship/${id}`);
  return res.data;
};

export const updateScholarshipFreeStatus = async (
  id,
  is_free
) => {
  const res = await api.patch(
    `/api/scholarship/${id}/free-status`,
    {
      is_free,
    }
  );

  return res.data;
};