import api from "./axios";

export const getInstituteStudents = async () => {
  const response = await api.get("/api/institutcreate/students");
  return response.data;
};

export const createInstituteStudent = async (payload) => {
  const response = await api.post("/api/institutcreate/students", payload);
  return response.data;
};

export const updateInstituteStudent = async (id, payload) => {
  const response = await api.put(`/api/institutcreate/students/${id}`, payload);
  return response.data;
};

export const deleteInstituteStudent = async (id) => {
  const response = await api.delete(`/api/institutcreate/students/${id}`);
  return response.data;
};

export const bulkUploadInstituteStudents = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/api/institutcreate/students/bulk-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
