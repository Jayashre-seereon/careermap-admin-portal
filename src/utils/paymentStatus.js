// Single payment-status vocabulary shared by Transactions and Bookings.
// Backend values (pending/completed/failed, captured, success, paid ...) -> paid | pending | failed | unknown
const PAID = ["paid", "completed", "complete", "captured", "success", "successful", "succeeded"];
const PENDING = ["pending", "created", "authorized", "processing", "initiated"];
const FAILED = ["failed", "failure", "cancelled", "canceled", "refunded", "declined", "error"];

export const normalizePaymentStatus = (value) => {
  const raw = String(value ?? "").trim().toLowerCase();
  if (PAID.includes(raw)) return "paid";
  if (PENDING.includes(raw)) return "pending";
  if (FAILED.includes(raw)) return "failed";
  return "unknown";
};

export const isPaidStatus = (value) => normalizePaymentStatus(value) === "paid";

export const PAYMENT_STATUS_LABELS = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
  unknown: "Unknown",
};
