import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import ScholarshipTable from "./ScholarshipTable";
import ScholarshipForm from "./ScholarshipForm";
import {
  createScholarship,
  deleteScholarship,
  getScholarships,
  updateScholarship,
} from "../../api/scholarship";
import { formatDateDisplay, formatDateForPayload } from "../../utils/date";

const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

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

const buildScholarshipPayload = ({
  name,
  type,
  url,
  is_free,
  price,
  deadline,
  image,
  eligibility,
  requirement,
  description,
}) => {
  const payload = {
    name,
    type,
    url: url || "",
    is_free: !!is_free,
    price: price || "",
    deadline: formatDateForPayload(deadline),
    eligibility: eligibility || "",
    requirement: requirement || "",
    description: description || "",
  };

  const file = extractFile(image);

  if (!file) {
    return { payload, config: {} };
  }

  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  formData.append("image", file);

  return {
    payload: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
};

const mapScholarship = (item = {}) => ({
  id: item.id,
  name: item.name || "",
  type: item.type || "",
  url: item.url || "",
  is_free: item.is_free ?? false,
  price: item.price || "",
  deadline: formatDateDisplay(item.deadline),
  image: item.image || null,
  eligibility: item.eligibility || "",
  requirement: item.requirement || "",
  description: item.description || "",
});

export default function ScholarshipPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadScholarships = async () => {
    try {
      setLoading(true);
      const response = await getScholarships();
      setData(normalizeList(response).map(mapScholarship));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load scholarships."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScholarships();
  }, []);

  const filteredData = data.filter((item) =>
    `${item.name} ${item.type} ${item.description} ${item.eligibility} ${item.requirement}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSubmit = async (values) => {
    try {
      const { payload, config } = buildScholarshipPayload(values);

      if (mode === "edit" && current) {
        await updateScholarship(current.id, payload, config);
        messageApi.success("Scholarship updated successfully.");
      } else {
        await createScholarship(payload, config);
        messageApi.success("Scholarship created successfully.");
      }

      setOpen(false);
      setCurrent(null);
      await loadScholarships();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit"
            ? "Failed to update scholarship."
            : "Failed to create scholarship."
        )
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteScholarship(record.id);
      messageApi.success("Scholarship deleted successfully.");
      await loadScholarships();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete scholarship."));
    }
  };

  return (
    <>
      {contextHolder}
      <ScholarshipTable
        data={filteredData}
        loading={loading}
        search={search}
        onSearch={setSearch}
        onAdd={() => {
          setCurrent(null);
          setOpen(true);
          setMode("add");
        }}
        onView={(record) => {
          setCurrent(record);
          setOpen(true);
          setMode("view");
        }}
        onEdit={(record) => {
          setCurrent(record);
          setOpen(true);
          setMode("edit");
        }}
        onDelete={handleDelete}
      />

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setCurrent(null);
        }}
        footer={null}
        width={1000}
        destroyOnClose
        title={
          mode === "view"
            ? "View Scholarship"
            : mode === "edit"
              ? "Edit Scholarship"
              : "Add Scholarship"
        }
      >
        <ScholarshipForm
          onSubmit={handleSubmit}
          initialValues={current}
          mode={mode}
        />
      </Modal>
    </>
  );
}
