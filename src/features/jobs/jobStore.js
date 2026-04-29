const JOBS_STORAGE_KEY = "careermap-admin-jobs";
const JOB_APPLICATIONS_STORAGE_KEY = "careermap-admin-job-applications";

const defaultJobs = [
  {
    key: "job-1",
    id: "job-1",
    name: "Senior Career Counselor",
    totalVacancy: 4,
    salary: "45000 - 60000",
    jobType: "Full Time",
    status: "Enabled",
    created: "28 Apr 2026",
    description: "Guide students with counseling sessions, aptitude reviews, and career planning support.",
  },
  {
    key: "job-2",
    id: "job-2",
    name: "Admission Support Executive",
    totalVacancy: 2,
    salary: "25000 - 35000",
    jobType: "Part Time",
    status: "Disabled",
    created: "26 Apr 2026",
    description: "Assist learners through application, onboarding, and follow-up communication.",
  },
];

const defaultApplications = [
  {
    key: "application-1",
    id: "application-1",
    job: "Senior Career Counselor",
    name: "Amit Patel",
    email: "amit.patel@example.com",
    phone: "9876543210",
    appliedOn: "27 Apr 2026",
    note: "5 years experience in education counseling.",
    cvUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    key: "application-2",
    id: "application-2",
    job: "Admission Support Executive",
    name: "Sneha Roy",
    email: "sneha.roy@example.com",
    phone: "9123456789",
    appliedOn: "28 Apr 2026",
    note: "Strong communication and CRM handling background.",
    cvUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

function cloneItems(items) {
  return items.map((item) => ({ ...item }));
}

function readStorage(key, fallback) {
  if (typeof window === "undefined") {
    return cloneItems(fallback);
  }

  const stored = window.localStorage.getItem(key);

  if (!stored) {
    const initial = cloneItems(fallback);
    window.localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid data");
    }

    return parsed;
  } catch {
    const initial = cloneItems(fallback);
    window.localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
}

function writeStorage(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getJobs() {
  return readStorage(JOBS_STORAGE_KEY, defaultJobs);
}

export function saveJobs(jobs) {
  writeStorage(JOBS_STORAGE_KEY, jobs);
}

export function getJobApplications() {
  return readStorage(JOB_APPLICATIONS_STORAGE_KEY, defaultApplications);
}

export function saveJobApplications(applications) {
  writeStorage(JOB_APPLICATIONS_STORAGE_KEY, applications);
}

export function createJobId() {
  return `job-${Date.now()}`;
}

export function getTodayLabel() {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formatter.format(new Date()).replace(/ /g, " ");
}
