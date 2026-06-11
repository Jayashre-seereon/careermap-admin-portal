import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const DATE_DISPLAY_FORMAT = "DD-MM-YYYY";
export const DATE_API_FORMAT = "YYYY-MM-DD";

const INPUT_FORMATS = [
  DATE_API_FORMAT,
  DATE_DISPLAY_FORMAT,
  "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
  "YYYY-MM-DDTHH:mm:ss[Z]",
  "YYYY-MM-DDTHH:mm:ss",
];

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
    const direct = dayjs(value);
    if (direct.isValid()) {
      return direct;
    }

    const parsed = dayjs(value, INPUT_FORMATS, true);
    return parsed.isValid() ? parsed : null;
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
