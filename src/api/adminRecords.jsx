import api from "./axios";

export const getAdminMentorBookings = async () => {
  const response = await api.get("/api/admin/mentor-bookings");
  return response.data;
};

export const saveAndEmailMentorMeetingLink = async (bookingId, meetingUrl) => {
  const response = await api.put(`/api/mentor-booking/admin/bookings/${bookingId}/meeting-link`, { meetingUrl });
  return response.data;
};

export const getAdminTransactions = async () => {
  const response = await api.get("/api/admin/transactions");
  return response.data;
};
