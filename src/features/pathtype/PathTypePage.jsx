import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import PathTypeTable from "./PathTypeTable";
import PathTypeForm from "./PathTypeForm";
import { createPath, deletePath, getPaths, updatePath } from "../../api/path";

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

const mapPath = (item = {}) => ({
  id: item.id,
  pathtype: item.pathtype || "",
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export default function PathTypePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [mode, setMode] = useState("add");
  const [loading, setLoading] = useState(false);

  const loadPaths = async () => {
    try {
      setLoading(true);
      const response = await getPaths();
      setData(normalizeList(response).map(mapPath));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load path types."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaths();
  }, []);

  const filteredData = data.filter((item) =>
    item.pathtype.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (values) => {
    try {
      if (mode === "edit" && current) {
        await updatePath(current.id, values);
        messageApi.success("Path type updated successfully.");
      } else {
        await createPath(values);
        messageApi.success("Path type created successfully.");
      }

      setOpen(false);
      setCurrent(null);
      await loadPaths();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit"
            ? "Failed to update path type."
            : "Failed to create path type."
        )
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deletePath(record.id);
      messageApi.success("Path type deleted successfully.");
      await loadPaths();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete path type."));
    }
  };

  return (
    <div className="w-full">
      {contextHolder}

      <h1 className="text-xl font-semibold text-[#9a2119] mb-4">
        Path Type Management
      </h1>

      <PathTypeTable
        data={filteredData}
        loading={loading}
        onAdd={() => {
          setOpen(true);
          setCurrent(null);
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
        search={search}
        onSearch={setSearch}
      />

      <Modal
        open={open}
        footer={null}
        onCancel={() => {
          setOpen(false);
          setCurrent(null);
        }}
        width={500}
        destroyOnClose
        title={
          mode === "add"
            ? "Add Path Type"
            : mode === "edit"
              ? "Edit Path Type"
              : "View Path Type"
        }
      >
        <PathTypeForm
          onSubmit={handleSubmit}
          initialValues={current}
          mode={mode}
        />
      </Modal>
    </div>
  );
}
