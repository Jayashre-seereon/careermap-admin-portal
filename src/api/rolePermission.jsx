import api from "./axios";

export const getRoles = async () => {
  const res = await api.get("/api/role/");
  return res.data;
};

export const createRole = async (payload, config = {}) => {
  const res = await api.post("/api/role/", payload, config);
  return res.data;
};

export const updateRole = async (id, payload, config = {}) => {
  const res = await api.put(`/api/role/${id}/`, payload, config);
  return res.data;
};

export const deleteRole = async (id) => {
  const res = await api.delete(`/api/role/${id}/`);
  return res.data;
};

export const getPermissions = async () => {
  const res = await api.get("/api/permissions/");
  return res.data;
};

export const createPermission = async (payload, config = {}) => {
  const res = await api.post("/api/permissions/", payload, config);
  return res.data;
};

export const updatePermission = async (id, payload, config = {}) => {
  const res = await api.put(`/api/permissions/${id}/`, payload, config);
  return res.data;
};

export const deletePermission = async (id) => {
  const res = await api.delete(`/api/permissions/${id}/`);
  return res.data;
};

export const getStaffs = async () => {
  const res = await api.get("/api/staff/");
  return res.data;
};

export const createStaff = async (payload, config = {}) => {
  const res = await api.post("/api/staff/", payload, config);
  return res.data;
};

export const updateStaff = async (id, payload, config = {}) => {
  const res = await api.put(`/api/staff/${id}/`, payload, config);
  return res.data;
};

export const deleteStaff = async (id) => {
  const res = await api.delete(`/api/staff/${id}/`);
  return res.data;
};
