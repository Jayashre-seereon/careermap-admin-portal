import { parseDateValue, DATE_DISPLAY_FORMAT, DATE_TIME_DISPLAY_FORMAT } from "./date";
// Shared display helpers (currency / date) so every module formats values the same way.
export const EMPTY_PLACEHOLDER = "—";

export const formatCurrency = (value, fallback = EMPTY_PLACEHOLDER) => {
  if (value === undefined || value === null || value === "") return fallback;
  const amount = Number(String(value).replace(/[₹,\s]/g, ""));
  if (!Number.isFinite(amount)) return fallback;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (value, fallback = EMPTY_PLACEHOLDER, withTime = false) => {
  if (!value) return fallback;
  const parsed = parseDateValue(value);
  if (!parsed || !parsed.isValid()) return fallback;
  return parsed.format(withTime ? DATE_TIME_DISPLAY_FORMAT : DATE_DISPLAY_FORMAT);
};
