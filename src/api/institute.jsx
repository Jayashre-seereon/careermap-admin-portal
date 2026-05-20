import api from "./axios";

const extractFile = (logo) => {
  if (Array.isArray(logo) && logo[0]?.originFileObj) {
    return logo[0].originFileObj;
  }

  if (logo?.fileList?.[0]?.originFileObj) {
    return logo.fileList[0].originFileObj;
  }

  if (logo?.originFileObj) {
    return logo.originFileObj;
  }

  return null;
};

const buildPayload = ({
  name,
  logo,
  address,
  admission_process,
  tentative_date,
  institute_type,
  url,
  country,
  state,
  city,
  district,
  is_top,
}) => {
  const file = extractFile(logo);

  if (!file) {
    return {
      name,
      address,
      admission_process,
      tentative_date,
      institute_type,
      url,
      countruy: country,
      state,
      city,
      district,
      is_top,
    };
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("address", address || "");
  formData.append("admission_process", admission_process || "");
  formData.append("tentative_date", tentative_date || "");
  formData.append("institute_type", institute_type || "");
  formData.append("url", url || "");
  formData.append("countruy", country || "");
  formData.append("state", state || "");
  formData.append("city", city || "");
  formData.append("district", district || "");
  formData.append("is_top", is_top);
  formData.append("image", file);
  return formData;
};

export const mapInstitute = (item = {}) => ({
  id: item.id,
  name: item.name || "",
  logo: item.logo || item.image || null,
  address: item.address || "",
  admission_process: item.admission_process || "",
  tentative_date: item.tentative_date || "",
  institute_type: item.institute_type || "",
  url: item.url || "",
  country: item.country || item.countruy || "",
  state: item.state || "",
  city: item.city || "",
  district: item.district || "",
  is_top: item.is_top ?? false,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const getInstitutes = async () => {
  const res = await api.get("/api/institutes/");
  return res.data;
};

export const createInstitute = async (values) => {
  const payload = buildPayload(values);
  const isFormData = payload instanceof FormData;

  const res = await api.post("/api/institutes/", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return res.data;
};

export const updateInstitute = async (id, values) => {
  const payload = buildPayload(values);
  const isFormData = payload instanceof FormData;

  const res = await api.put(`/api/institutes/${id}`, payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return res.data;
};

export const deleteInstitute = async (id) => {
  const res = await api.delete(`/api/institutes/${id}`);
  return res.data;
};
