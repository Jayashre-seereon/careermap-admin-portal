import api from "./axios";

export const getUserMessages = async () => {
  const response = await api.get("/api/send-message");
  return response.data;
};
