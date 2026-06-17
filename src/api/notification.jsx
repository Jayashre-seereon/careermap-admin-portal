import api from "./axios";

export const getNotifications = async () => {
  const res = await api.get("/api/notification/");
  return res.data;
};

export const createNotification = async (payload) => {
  const res = await api.post("/api/notification/", payload);
  return res.data;
};

export const updateNotification = async (id, payload) => {
  const res = await api.put(`/api/notification/${id}`, payload);
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await api.delete(`/api/notification/${id}`);
  return res.data;
};
