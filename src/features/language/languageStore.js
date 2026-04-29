const STORAGE_KEY = "careermap-admin-language-data";

const defaultLanguages = [
  {
    key: "lang-1",
    id: "english-en",
    name: "English",
    code: "en",
    type: "Default",
    keywords: [
      { key: "welcome_title", value: "Welcome to Career Map" },
      { key: "login_button", value: "Login" },
      { key: "support_ticket", value: "Support Ticket" },
      { key: "plan_upgrade", value: "Upgrade Plan" },
    ],
  },
  {
    key: "lang-2",
    id: "malayalam-ml",
    name: "Malayalam",
    code: "ml",
    type: "Not Default",
    keywords: [
      { key: "welcome_title", value: "Career Map-lekku swagatham" },
      { key: "login_button", value: "Login" },
      { key: "support_ticket", value: "Support Ticket" },
      { key: "plan_upgrade", value: "Upgrade Plan" },
    ],
  },
];

function cloneDefaults() {
  return defaultLanguages.map((language) => ({
    ...language,
    keywords: language.keywords.map((keyword) => ({ ...keyword })),
  }));
}

export function getLanguages() {
  if (typeof window === "undefined") {
    return cloneDefaults();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    const initial = cloneDefaults();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid language store");
    }

    return parsed;
  } catch {
    const fallback = cloneDefaults();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export function saveLanguages(languages) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(languages));
}

export function createLanguageId(name, code) {
  return `${name}-${code}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
