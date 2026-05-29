import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import StreamForm from "./StreamForm";
import StreamTable from "./StreamTable";
import {
  createStream,
  deleteStream,
  getStreams,
  updateStream,
} from "../../api/stream";

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

const buildStreamPayload = ({ name, image }) => {
  const file = extractFile(image);

  if (!file) {
    return { payload: { name }, config: {} };
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("image", file);

  return {
    payload: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
};

const mapStream = (item = {}) => ({
  id: item.id,
  key: item.id?.toString?.() || item.key || "",
  name: item.name || "",
  image: item.image || item.logo || null,
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

  if (
    typeof backendMessage === "string" &&
    backendMessage.includes("Unique constraint failed")
  ) {
    return "This stream already exists.";
  }

  return backendMessage;
};

export default function StreamPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [streams, setStreams] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadStreams = async () => {
    try {
      setLoading(true);
      const response = await getStreams();
      setStreams(normalizeList(response).map(mapStream));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load streams."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStreams();
  }, []);

  const handleAdd = async (values) => {
    try {
      const { payload, config } = buildStreamPayload(values);
      await createStream(payload, config);
      messageApi.success("Stream created successfully.");
      setOpen(false);
      setSelected(null);
      await loadStreams();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to create stream."));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStream(id);
      messageApi.success("Stream deleted successfully.");
      await loadStreams();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete stream."));
    }
  };

  const handleView = (record) => {
    setSelected(record);
    setMode("view");
    setOpen(true);
  };

  const handleEdit = (record) => {
    setSelected(record);
    setMode("edit");
    setOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      const { payload, config } = buildStreamPayload(values);
      await updateStream(selected.id, payload, config);
      messageApi.success("Stream updated successfully.");
      setOpen(false);
      setSelected(null);
      await loadStreams();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to update stream."));
    }
  };

  const filteredStreams = streams.filter((stream) =>
    `${stream.name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {contextHolder}

      <h2 className="text-xl font-bold text-[#9a2119]">
        Stream Management
      </h2>

      <StreamTable
        data={filteredStreams}
        search={search}
        onSearch={setSearch}
        onAddClick={() => {
          setMode("add");
          setSelected(null);
          setOpen(true);
        }}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        loading={loading}
      />

      <Modal
        title={
          mode === "add"
            ? "Add Stream"
            : mode === "edit"
              ? "Edit Stream"
              : "View Stream"
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <StreamForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}
