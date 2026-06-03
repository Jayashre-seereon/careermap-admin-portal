import { formatDateDisplay } from "../../utils/date";

export const normalizeList = (response) => {
  const payload = response?.data?.data ?? response?.data;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    return [payload];
  }

  return [];
};

export const normalizeStatus = (status) => {
  const text = String(status || "").trim().toLowerCase();

  if (text === "closed" || text === "answered" || text === "pending") {
    return text;
  }

  return "pending";
};

export const formatStatusLabel = (status) => {
  const value = normalizeStatus(status);
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatStatusClasses = (status) => {
  const value = normalizeStatus(status);

  if (value === "pending") return "bg-yellow-100 text-yellow-800";
  if (value === "answered") return "bg-blue-100 text-blue-800";
  return "bg-green-100 text-green-800";
};

export const mapSupportTicket = (item = {}) => {
  const user = item.user || {};
  const firstName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  return {
    id: item.id,
    userId: item.userId ?? user.id ?? null,
    email: item.email || user.email || "",
    subject: item.subject || "",
    message: item.message || "",
    status: normalizeStatus(item.status),
    createdAt: item.createdAt || "",
    updatedAt: item.updatedAt || "",
    user,
    openedBy: firstName || user.email || item.email || "Unknown",
    openedOn: formatDateDisplay(item.createdAt),
  };
};

export const filterTicketsByStatus = (tickets = [], status = "all") => {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "all") {
    return tickets;
  }

  return tickets.filter((ticket) => normalizeStatus(ticket.status) === normalizedStatus);
};
