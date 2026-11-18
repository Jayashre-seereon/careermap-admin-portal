const GLOBAL_TEMPLATE_KEY = "careermap-admin-global-template";
const EMAIL_CONFIG_KEY = "careermap-admin-email-config";
const SMS_CONFIG_KEY = "careermap-admin-sms-config";

export const defaultGlobalTemplate = {
  emailFrom: "info@example.com",
  emailBody: `Hi {{fullname}} ({{username}}),

{{message}}`,
  smsFrom: "FinBiz",
  smsBody: "Hi {{fullname}} ({{username}}), {{message}}",
};

export const defaultEmailConfig = {
  method: "SMTP",
  host: "",
  port: "",
  encryption: "TLS",
  username: "",
  password: "",
};

export const defaultSmsConfig = {
  method: "Nexmo",
  nexmoApiKey: "",
  nexmoApiSecret: "",
  nexmoFrom: "",
  twilioAccountSid: "",
  twilioAuthToken: "",
  twilioFromNumber: "",
  customApiUrl: "",
  customApiKey: "",
  customPayload: "",
};

// Secrets are never written to localStorage. They are kept in memory only for the
// current page session (lost on reload) until a secure backend endpoint stores them.
const SECRET_FIELDS = {
  [EMAIL_CONFIG_KEY]: ["password"],
  [SMS_CONFIG_KEY]: ["nexmoApiSecret", "twilioAuthToken", "customApiKey"],
};
const memorySecrets = {};

function stripSecrets(key, value) {
  const copy = { ...value };
  (SECRET_FIELDS[key] || []).forEach((field) => {
    delete copy[field];
  });
  return copy;
}

function withSecrets(key, value) {
  return { ...value, ...(memorySecrets[key] || {}) };
}

function readConfig(key, fallback) {
  if (typeof window === "undefined") {
    return { ...fallback };
  }

  const stored = window.localStorage.getItem(key);

  if (!stored) {
    window.localStorage.setItem(key, JSON.stringify(stripSecrets(key, fallback)));
    return withSecrets(key, fallback);
  }

  try {
    const parsed = JSON.parse(stored);
    // Purge secrets saved by older versions of this store.
    if ((SECRET_FIELDS[key] || []).some((field) => parsed?.[field])) {
      window.localStorage.setItem(key, JSON.stringify(stripSecrets(key, parsed)));
    }
    return withSecrets(key, { ...fallback, ...stripSecrets(key, parsed) });
  } catch {
    window.localStorage.setItem(key, JSON.stringify(stripSecrets(key, fallback)));
    return withSecrets(key, fallback);
  }
}

function writeConfig(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  const secretFields = SECRET_FIELDS[key] || [];
  if (secretFields.length) {
    memorySecrets[key] = Object.fromEntries(secretFields.map((field) => [field, value?.[field] ?? ""]));
  }
  window.localStorage.setItem(key, JSON.stringify(stripSecrets(key, value)));
}

export function getGlobalTemplateConfig() {
  return readConfig(GLOBAL_TEMPLATE_KEY, defaultGlobalTemplate);
}

export function saveGlobalTemplateConfig(config) {
  writeConfig(GLOBAL_TEMPLATE_KEY, config);
}

export function getEmailConfig() {
  return readConfig(EMAIL_CONFIG_KEY, defaultEmailConfig);
}

export function saveEmailConfig(config) {
  writeConfig(EMAIL_CONFIG_KEY, config);
}

export function getSmsConfig() {
  return readConfig(SMS_CONFIG_KEY, defaultSmsConfig);
}

export function saveSmsConfig(config) {
  writeConfig(SMS_CONFIG_KEY, config);
}
