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
  category,
  institution,
  name,
  path,
  image,
  coverImage,
  description,
  specialisation,
  importantFacts,
}) => {
  const payload = {
  categoryId: category,
  institutionId: institution || null,
  name,
  path: path || "",
  description: description || "",
  specialization: stripHtml(specialisation),
 importandt_facts: JSON.stringify(factsToArray(importantFacts)),};
  const imageFile = extractFile(image);
  const coverImageFile = extractFile(coverImage);

  if (!imageFile && !coverImageFile) {
    return payload;
  }

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (imageFile) {
    formData.append("image", imageFile);
  }

  if (coverImageFile) {
    formData.append("coverImage", coverImageFile);
  }

  return formData;
};

export const mapSecondaryCategory = (item = {}) => ({
  id: item.id,
  category: item.categoryId || item.category?.id || item.category || undefined,
  categoryName: item.category?.name || item.categoryName || "",
  institution:
    item.institutionId || item.institution?.id || item.institution || undefined,
  institutionName: item.institution?.name || item.institutionName || "",
  name: item.name || "",
  path: item.path || "",
  image: item.image || null,
  coverImage: item.coverImage || null,
  description: item.description || "",
  specialisation: item.specialization || item.specialisation || "",
  importantFacts: htmlListFromArray(
    normalizeFacts(
      item.important_facts || item.importandt_facts || item.importantFacts
    )
  ),
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const getSecondaryCategories = async () => {
  const res = await api.get("/api/secondarycategories/");
  return res.data;
};

export const createSecondaryCategory = async (values) => {
  const payload = buildPayload(values);
  const isFormData = payload instanceof FormData;

  const res = await api.post("/api/secondarycategories/", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return res.data;
};

export const updateSecondaryCategory = async (id, values) => {
  const payload = buildPayload(values);
  const isFormData = payload instanceof FormData;

  const res = await api.put(`/api/secondarycategories/${id}`, payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return res.data;
};

export const deleteSecondaryCategory = async (id) => {
  const res = await api.delete(`/api/secondarycategories/${id}`);
  return res.data;
};
