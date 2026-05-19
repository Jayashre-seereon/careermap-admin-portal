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

const buildPayload = ({ name, image }) => {
  const file = extractFile(image);

  if (!file) {
    return { name };
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("image", file);
  return formData;
};

export const getStreams = async () => {
  const res = await api.get("/api/streams");
  return res.data;
};

export const createStream = async (values) => {
  const payload = buildPayload(values);
  const isFormData = payload instanceof FormData;

  const res = await api.post("/api/streams", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return res.data;
};

export const updateStream = async (id, values) => {
  const payload = buildPayload(values);
  const isFormData = payload instanceof FormData;

  const res = await api.put(`/api/streams/${id}`, payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });

  return res.data;
};

export const deleteStream = async (id) => {
  const res = await api.delete(`/api/streams/${id}`);
  return res.data;
};
