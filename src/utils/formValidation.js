const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10,15}$/,
  charactersOnly: /^[A-Za-z\s]+$/,
  numbersOnly: /^\d+$/,
  decimal: /^\d+(\.\d+)?$/,
  url:
    /^(https?:\/\/)?(www\.)?([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(\/[\w\-./?%&=+#]*)?$/,
  noWhitespace: /^\S+$/,
};

const createPatternValidator =
  (pattern, message, { allowEmpty = true } = {}) =>
  (_, value) => {
    const normalizedValue = typeof value === "string" ? value.trim() : value;

    if (!normalizedValue) {
      return allowEmpty
        ? Promise.resolve()
        : Promise.reject(new Error(message));
    }

    return pattern.test(normalizedValue)
      ? Promise.resolve()
      : Promise.reject(new Error(message));
  };

const createCustomValidator =
  (getMessage, { allowEmpty = true } = {}) =>
  (_, value) => {
    const normalizedValue = typeof value === "string" ? value.trim() : value;

    if (!normalizedValue) {
      return allowEmpty ? Promise.resolve() : Promise.reject(new Error(getMessage("")));
    }

    const message = getMessage(normalizedValue);
    return message ? Promise.reject(new Error(message)) : Promise.resolve();
  };

export const validationMessages = {
  email: (label = "Email") => (value) => {
    if (/\s/.test(value)) {
      return `Spaces are not allowed in ${label.toLowerCase()}.`;
    }

    if (/\.{3,}/.test(value)) {
      return `Three dots are not allowed in ${label.toLowerCase()}.`;
    }

    if (/\.com.+$/i.test(value)) {
      return `After .com no input is allowed in ${label.toLowerCase()}.`;
    }

    return regex.email.test(value)
      ? ""
      : `Please enter a valid ${label.toLowerCase()}.`;
  },
  phone: (label = "Phone number") => (value) => {
    if (/[A-Za-z]/.test(value)) {
      return `Only numbers are allowed in ${label.toLowerCase()}.`;
    }

    if (/[^0-9\s]/.test(value)) {
      return `Special characters are not allowed in ${label.toLowerCase()}.`;
    }

    const digitCount = value.replace(/\s/g, "").length;
    if (digitCount < 10 || digitCount > 15) {
      return `Please enter a valid ${label.toLowerCase()}.`;
    }

    return "";
  },
  charactersOnly: (label = "This field") => (value) => {
    if (/\d/.test(value)) {
      return `Numbers are not allowed in ${label.toLowerCase()}.`;
    }

    if (/[^A-Za-z\s]/.test(value)) {
      return `Special characters are not allowed in ${label.toLowerCase()}.`;
    }

    return regex.charactersOnly.test(value)
      ? ""
      : `Only characters are allowed in ${label.toLowerCase()}.`;
  },
  numbersOnly: (label = "This field") => (value) => {
    if (/[A-Za-z]/.test(value)) {
      return `Characters are not allowed in ${label.toLowerCase()}.`;
    }

    if (/[^0-9]/.test(value)) {
      return `Special characters are not allowed in ${label.toLowerCase()}.`;
    }

    return regex.numbersOnly.test(value)
      ? ""
      : `Only numbers are allowed in ${label.toLowerCase()}.`;
  },
  decimal: (label = "This field") => (value) => {
    if (/[A-Za-z]/.test(value)) {
      return `Characters are not allowed in ${label.toLowerCase()}.`;
    }

    if (/[^0-9.]/.test(value)) {
      return `Special characters are not allowed in ${label.toLowerCase()}.`;
    }

    if ((value.match(/\./g) || []).length > 1) {
      return `Please enter a valid ${label.toLowerCase()}.`;
    }

    return regex.decimal.test(value)
      ? ""
      : `Only numbers are allowed in ${label.toLowerCase()}.`;
  },
  url: (label = "URL") => (value) =>
    regex.url.test(value)
      ? ""
      : `Please enter a valid ${label.toLowerCase()}. Only links are allowed.`,
};

export const validationRules = {
  required: (label = "This field") => ({
    required: true,
    message: `${label} is required.`,
  }),
  email: (label = "Email") => ({
    validator: createCustomValidator(validationMessages.email(label)),
  }),
  phone: (label = "Phone number") => ({
    validator: createCustomValidator(validationMessages.phone(label)),
  }),
  charactersOnly: (label = "This field") => ({
    validator: createCustomValidator(validationMessages.charactersOnly(label)),
  }),
  numbersOnly: (label = "This field") => ({
    validator: createCustomValidator(validationMessages.numbersOnly(label)),
  }),
  decimal: (label = "This field") => ({
    validator: createCustomValidator(validationMessages.decimal(label)),
  }),
  url: (label = "URL") => ({
    validator: createPatternValidator(
      regex.url,
      `Please enter a valid ${label.toLowerCase()}. Only links are allowed.`
    ),
  }),
  noWhitespace: (label = "This field") => ({
    validator: createPatternValidator(
      regex.noWhitespace,
      `${label} cannot contain spaces.`,
      { allowEmpty: false }
    ),
  }),
  minLength: (length, label = "This field") => ({
    min: length,
    message: `${label} must be at least ${length} characters.`,
  }),
  maxLength: (length, label = "This field") => ({
    max: length,
    message: `${label} cannot be more than ${length} characters.`,
  }),
};

export const inputSanitizers = {
  trim: (value = "") => value.trimStart(),
  charactersOnly: (value = "") => value.replace(/[^A-Za-z\s]/g, ""),
  numbersOnly: (value = "") => value.replace(/\D/g, ""),
  phone: (value = "") => value.replace(/\D/g, "").slice(0, 15),
  decimal: (value = "") => {
    const cleanedValue = value.replace(/[^\d.]/g, "");
    const parts = cleanedValue.split(".");

    if (parts.length <= 1) {
      return cleanedValue;
    }

    return `${parts[0]}.${parts.slice(1).join("")}`;
  },
  url: (value = "") => value.trim(),
};

export const getValueFromInput =
  (sanitizer) =>
  (eventOrValue = "") => {
    const nextValue =
      typeof eventOrValue === "string"
        ? eventOrValue
        : eventOrValue?.target?.value ?? "";

    return sanitizer ? sanitizer(nextValue) : nextValue;
  };
