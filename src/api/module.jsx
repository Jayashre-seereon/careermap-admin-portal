import api from "./axios";

const extractFile = (image) => {
  if (Array.isArray(image) && image[0]?.originFileObj) {
    return image[0].originFileObj;
  }

  if (image?.fileList?.[0]?.originFileObj) {
    return image.fileList[0].originFileObj;
  }

  if (image?.originFileObj) {
    return image.originFileObj;
  }

  return null;
};

const buildPayload = ({ title, url, image, btnText, position, isFree }) => {
  const file = extractFile(image);

  if (!file) {
    return {
      title,
      url,
      btn_text: btnText,
      position,
      markas_free: isFree,
    };
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("url", url);
  formData.append("btn_text", btnText);
  formData.append("position", position);
  formData.append("markas_free", isFree);
  formData.append("image", file);
  return formData;
};

export const mapModule = (item = {}) => ({
  id: item.id,
  title: item.title || "",
  url: item.url || "",
  image: item.image || null,
  btnText: item.btnText || item.btn_text || "",
  position: item.position || "",
  isFree: item.isFree ?? item.markas_free ?? false,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const getModules = async () => {
  const res = await api.get("/api/modules");
  return res.data;
};

export const createModule = async (values) => {
  const payload = buildPayload(values);
  const isFormData = payload instanceof FormData;

  const res = await api.post("/api/modules", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return res.data;
};

export const updateModule = async (id, values) => {
  const payload = buildPayload(values);
  const isFormData = payload instanceof FormData;

  const res = await api.put(`/api/modules/${id}`, payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return res.data;
};

export const deleteModule = async (id) => {
  const res = await api.delete(`/api/modules/${id}`);
  return res.data;
};
