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

  if (!file) {
    return {
      payload: {
        name,
        address,
        admission_process,
        about: about || "",
        courses_offered: courses_offered || "",
        tentative_date: formattedDate,
        institute_type,
        url,
        countruy: country,
        state,
        city,
        district,
        is_top,
      },
      config: {},
    };
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("address", address || "");
  formData.append("admission_process", admission_process || "");
  formData.append("about", about || "");
  formData.append("courses_offered", courses_offered || "");
  formData.append("tentative_date", formattedDate);
  formData.append("institute_type", institute_type || "");
  formData.append("url", url || "");
  formData.append("countruy", country || "");
  formData.append("state", state || "");
  formData.append("city", city || "");
  formData.append("district", district || "");
  formData.append("is_top", is_top);
  formData.append("image", file);

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
  courses_offered: item.courses_offered || item.course_offered || "",
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

const getApiErrorMessage = (error, fallbackMessage) => {
  const backendMessage =
    error.response?.data?.message || error.message || fallbackMessage;

  return backendMessage;
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
      messageApi.error(getApiErrorMessage(error, "Failed to create institute."));
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
      messageApi.error(getApiErrorMessage(error, "Failed to update institute."));
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteInstitute(record.id);
      messageApi.success("Institute deleted successfully.");
      await loadInstitutes();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete institute."));
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
