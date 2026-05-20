import api from "./axios";

const extractFile = (value) => {
  if (Array.isArray(value) && value[0]?.originFileObj) {
    return value[0].originFileObj;
  }

  if (value?.fileList?.[0]?.originFileObj) {
    return value.fileList[0].originFileObj;
  }

  if (value?.originFileObj) {
    return value.originFileObj;
  }

  return null;
};

const stripHtml = (value = "") =>
  value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

const htmlListFromArray = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }

  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
};

const factsToArray = (value = "") =>
  stripHtml(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeFacts = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return factsToArray(value);
    }
  }

  return [];
};

const buildPayload = ({
  stream,
  institutions,
  title,
  howToBecome,
  file,
  coverImage,
  description,
  specialisation,
  importantFacts,
  isUpgrade,
}) => {
  const payload = {
    streamId: stream,
    institutionId: Array.isArray(institutions) ? institutions[0] : institutions,
    title,
    path: howToBecome || null,
    description: description || "",
    specialization: stripHtml(specialisation),
    importandt_facts: JSON.stringify(factsToArray(importantFacts)),
    category_access: isUpgrade === "Free",
  };

  const fileValue = extractFile(file);
  const coverImageValue = extractFile(coverImage);

  if (!fileValue && !coverImageValue) {
    return payload;
  }

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
      return;
    }

    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (fileValue) {
    formData.append("file", fileValue);
  }

  if (coverImageValue) {
    formData.append("coverImage", coverImageValue);
  }

  return formData;
};

export const mapCategory = (item = {}) => ({
  id: item.id,
  stream: item.streamId || item.stream?.id || item.stream || undefined,
  institutions:
    item.institutionId || item.institution?.id || item.institution
      ? [item.institutionId || item.institution?.id || item.institution]
      : [],
  title: item.title || "",
  howToBecome: item.path || "",
  file: item.file || null,
  coverImage: item.coverImage || null,
  description: item.description || "",
  specialisation: item.specialization || item.specialisation || "",
  importantFacts: htmlListFromArray(
    normalizeFacts(
      item.important_facts || item.importandt_facts || item.importantFacts
    )
  ),
  isUpgrade:
    item.category_access === false || item.isUpgrade === "Premium"
      ? "Premium"
      : "Free",
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const getCategories = async () => {
  const res = await api.get("/api/categories/");
  return res.data;
};

export const createCategory = async (values) => {
  const payload = buildPayload(values);
  const isFormData = payload instanceof FormData;

  const res = await api.post("/api/categories/", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return res.data;
};

export const updateCategory = async (id, values) => {
  const payload = buildPayload(values);
  const isFormData = payload instanceof FormData;

  const res = await api.put(`/api/categories/${id}`, payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/api/categories/${id}`);
  return res.data;
};
