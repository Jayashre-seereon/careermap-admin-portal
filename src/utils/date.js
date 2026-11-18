import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const DATE_DISPLAY_FORMAT = "DD-MM-YYYY";
export const DATE_API_FORMAT = "YYYY-MM-DD";

const INPUT_FORMATS = [
  DATE_API_FORMAT,
  DATE_DISPLAY_FORMAT,
  "YYYY-MM-DDTHH:mm:ss.SSS",
  "YYYY-MM-DDTHH:mm:ss",
];

// ISO strings that carry a timezone (trailing Z or +hh:mm / -hh:mm offset)
const HAS_TIMEZONE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/i;

export const parseDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value?.toDate === "function") {
    const dateValue = value.toDate();
    return dayjs(dateValue);
  }

  if (dayjs.isDayjs(value)) {
    return value;
  }

  if (value instanceof Date) {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }

  if (typeof value === "string") {
    // Strings with Z/offset are real instants: let the Date parser convert
    // them to local time instead of reading the clock digits as local time.
    if (HAS_TIMEZONE.test(value.trim())) {
      const instant = dayjs(new Date(value.trim()));
      return instant.isValid() ? instant : null;
    }

    const parsed = dayjs(value, INPUT_FORMATS, true);
    if (parsed.isValid()) {
      return parsed;
    }

    const direct = dayjs(value);
    return direct.isValid() ? direct : null;
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

export const formatDateDisplay = (value) => {
  const parsed = parseDateValue(value);
  return parsed ? parsed.format(DATE_DISPLAY_FORMAT) : "-";
};

export const formatDateForPayload = (value) => {
  const parsed = parseDateValue(value);
  return parsed ? parsed.format(DATE_API_FORMAT) : "";
};

export const DATE_TIME_DISPLAY_FORMAT = "DD-MM-YYYY HH:mm";

export const formatDateTimeDisplay = (value, fallback = "-") => {
  const parsed = parseDateValue(value);
  return parsed ? parsed.format(DATE_TIME_DISPLAY_FORMAT) : fallback;
};
