import api from "./axios";

export const getAdminMentorBookings = async (params) => {
  const response = await api.get("/api/admin/mentor-bookings", params ? { params } : undefined);
  return response.data;
};

export const saveAndEmailMentorMeetingLink = async (bookingId, meetingUrl) => {
  const response = await api.put(`/api/mentor-booking/admin/bookings/${bookingId}/meeting-link`, { meetingUrl });
  return response.data;
};

export const cancelAdminMentorBooking = async (bookingId, reason) => {
  const response = await api.post(`/api/mentor-booking/admin/bookings/${bookingId}/cancel`, { reason });
  return response.data;
};

export const rescheduleAdminMentorBooking = async (bookingId, data) => {
  const response = await api.post(`/api/mentor-booking/admin/bookings/${bookingId}/reschedule`, data);
  return response.data;
};

export const getAdminMentorAvailability = async (mentorId) => {
  const response = await api.get(`/api/mentor/${mentorId}`);
  return response.data;
};

export const getAdminBookedMentorSlots = async (mentorId, date) => {
  const response = await api.get("/api/mentor-booking/booked-slots", { params: { mentorId, date } });
  return response.data;
};

export const getAdminTransactions = async (params) => {
  const response = await api.get("/api/admin/transactions", params ? { params } : undefined);
  return response.data;
};
