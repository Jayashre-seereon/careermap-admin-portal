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

function readConfig(key, fallback) {
  if (typeof window === "undefined") {
    return { ...fallback };
  }

  const stored = window.localStorage.getItem(key);

  if (!stored) {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return { ...fallback };
  }

  try {
    const parsed = JSON.parse(stored);
    return { ...fallback, ...parsed };
  } catch {
    window.localStorage.setItem(key, JSON.stringify(fallback));
    return { ...fallback };
  }
}

function writeConfig(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
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
