import api from "./axios";

export const getStreams = async () => {
  const res = await api.get("/api/streams");
  return res.data;
};

export const createStream = async (payload, config = {}) => {
  const res = await api.post("/api/streams", payload, config);
  return res.data;
};

export const updateStream = async (id, payload, config = {}) => {
  const res = await api.put(`/api/streams/${id}`, payload, config);
  return res.data;
};

export const deleteStream = async (id) => {
  const res = await api.delete(`/api/streams/${id}`);
  return res.data;
};
