import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import InstitutionTable from "./InstitutionTable";
import InstitutionForm from "./InstitutionForm";
import {
  createInstitute,
  deleteInstitute,
  getInstitutes,
  updateInstitute,
} from "../../api/institute";

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

const formatDateValue = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value?.format === "function") {
    return value.format("YYYY-MM-DD");
  }

  return "";
};

const normalizeStringArray = (value) => {
  const collectValues = (input) => {
    if (Array.isArray(input)) {
      return input.flatMap((item) => collectValues(item));
    }

    if (typeof input === "string") {
      return input
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (input == null) {
      return [];
    }

    const normalizedValue = String(input).trim();
    return normalizedValue ? [normalizedValue] : [];
  };

  if (Array.isArray(value)) {
    return collectValues(value);
  }

  if (typeof value === "string") {
    return collectValues(value);
  }

  return [];
};

const buildInstitutePayload = ({
  name,
  logo,
  address,
  admission_process,
  about,
  courses_offered,
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
  const formattedDate = formatDateValue(tentative_date);
  const formData = new FormData();
  formData.append("name", name);
  formData.append("address", address || "");
  formData.append("admission_process", admission_process || "");
  formData.append("about", about || "");
  formData.append("course_offered", JSON.stringify(normalizeStringArray(courses_offered)));
  formData.append("tentative_date", formattedDate);
  formData.append("institute_type", institute_type || "");
  formData.append("url", url || "");
  formData.append("countruy", country || "");
  formData.append("state", state || "");
  formData.append("city", city || "");
  formData.append("district", district || "");
  formData.append("is_top", String(!!is_top));

  if (file) {
    formData.append("image", file);
  }

  return {
    payload: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
};

const mapInstitute = (item = {}) => ({
  id: item.id,
  name: item.name || "",
  logo: item.logo || item.image || null,
  address: item.address || "",
  admission_process: item.admission_process || "",
  about: item.about || "",
  courses_offered: Array.isArray(item.courses_offered || item.course_offered)
    ? item.courses_offered || item.course_offered
    : normalizeStringArray(item.courses_offered || item.course_offered),
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

const normalizeList = (response) => {
  const list = response?.data;

  if (Array.isArray(list)) {
    return list;
  }

  if (list && typeof list === "object") {
    return [list];
  }

  return [];
};

const getApiErrorMessage = (error, fallbackMessage, action = "default") => {
  const statusCode = error.response?.status;
  const backendMessage = error.response?.data?.message;

  if (statusCode === 400) {
    if (action === "delete") {
      return "Institute is linked to another module and cannot be deleted.";
    }

    if (action === "save") {
      return "This Institute already exists";
    }
  }

  return backendMessage || error.message || fallbackMessage;
};

export default function InstitutionPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [institutes, setInstitutes] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadInstitutes = async () => {
    try {
      setLoading(true);
      const response = await getInstitutes();
      setInstitutes(normalizeList(response).map(mapInstitute));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load institutes."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutes();
  }, []);

  const handleAdd = async (values) => {
    try {
      const { payload, config } = buildInstitutePayload(values);
      await createInstitute(payload, config);
      messageApi.success("Institute created successfully.");
      setOpen(false);
      setSelected(null);
      await loadInstitutes();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, "Failed to create institute.", "save")
      );
    }
  };

  const handleUpdate = async (values) => {
    try {
      const { payload, config } = buildInstitutePayload(values);
      await updateInstitute(selected.id, payload, config);
      messageApi.success("Institute updated successfully.");
      setOpen(false);
      setSelected(null);
      await loadInstitutes();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, "Failed to update institute.", "save")
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteInstitute(record.id);
      messageApi.success("Institute deleted successfully.");
      await loadInstitutes();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, "Failed to delete institute.", "delete")
      );
    }
  };

  const filteredInstitutes = institutes.filter((item) =>
    `${item.name} ${item.address} ${item.city} ${item.state} ${item.country} ${item.about} ${item.courses_offered}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {contextHolder}

      <InstitutionTable
        data={filteredInstitutes}
        search={search}
        onSearch={setSearch}
        onAddClick={() => {
          setMode("add");
          setSelected(null);
          setOpen(true);
        }}
        onDelete={handleDelete}
        onView={(record) => {
          setSelected(record);
          setMode("view");
          setOpen(true);
        }}
        onEdit={(record) => {
          setSelected(record);
          setMode("edit");
          setOpen(true);
        }}
        loading={loading}
      />

      <Modal
        title={
          mode === "add"
            ? "Add Institution"
            : mode === "edit"
              ? "Edit Institution"
              : "View Institution"
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
        }}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <InstitutionForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}
