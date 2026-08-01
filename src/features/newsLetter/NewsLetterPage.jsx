import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import NewsletterTable from "./NewsLetterTable";
import NewsletterForm from "./NewsLetterForm";
import {
  createNewsletter,
  deleteNewsletter,
  getNewsletters,
  updateNewsletter,
} from "../../api/newsletter";

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

const mapNewsletter = (item = {}) => ({
  id: item.id,
  title: item.title || "",
  image: item.image || null,
  description: item.description || "",
  url: item.url || "",
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const buildNewsletterPayload = ({ title, description, url, image }) => {
  const payload = { title, description, url };
  const imageValue = extractFile(image);

  if (!imageValue) {
    return { payload, config: {} };
  }

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  formData.append("image", imageValue);

  return {
    payload: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
};

export default function NewsletterPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadNewsletters = async () => {
    try {
      setLoading(true);
      const response = await getNewsletters();
      setData(normalizeList(response).map(mapNewsletter));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load newsletters."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewsletters();
  }, []);

  const handleAdd = async (values) => {
    try {
      const { payload, config } = buildNewsletterPayload(values);
      await createNewsletter(payload, config);
      messageApi.success("Newsletter created successfully.");
      setOpen(false);
      setSelected(null);
      await loadNewsletters();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to create newsletter."));
    }
  };

  const handleUpdate = async (values) => {
    try {
      const { payload, config } = buildNewsletterPayload(values);
      await updateNewsletter(selected.id, payload, config);
      messageApi.success("Newsletter updated successfully.");
      setOpen(false);
      setSelected(null);
      await loadNewsletters();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to update newsletter."));
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteNewsletter(record.id);
      messageApi.success("Newsletter deleted successfully.");
      await loadNewsletters();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete newsletter."));
    }
  };

  return (
    <div className="space-y-5">
      {contextHolder}

      <h2 className="text-xl font-bold text-[#9a2119]">Newsletter Management</h2>

      <NewsletterTable
        data={data}
        loading={loading}
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
      />

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
        }}
        footer={null}
        width={800}
        destroyOnClose
        title={mode === "add" ? "Add Newsletter" : mode === "edit" ? "Edit Newsletter" : "View Newsletter"}
      >
        <NewsletterForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}