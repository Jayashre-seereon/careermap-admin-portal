import api from "./axios";

export const getAdminMentorBookings = async () => {
  const response = await api.get("/api/admin/mentor-bookings");
  return response.data;
};

export const getAdminTransactions = async () => {
  const response = await api.get("/api/admin/transactions");
  return response.data;
};
