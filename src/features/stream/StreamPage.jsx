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
      const list = response?.data || [];
      setStreams(Array.isArray(list) ? list : []);
    } catch (error) {
      messageApi.error(error.response?.data?.message || error.message || "Failed to load streams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStreams();
  }, []);

  const handleAdd = async (values) => {
    try {
      await createStream(values);
      messageApi.success("Stream created successfully.");
      setOpen(false);
      await loadStreams();
    } catch (error) {
      messageApi.error(error.response?.data?.message || error.message || "Failed to create stream.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStream(id);
      messageApi.success("Stream deleted successfully.");
      await loadStreams();
    } catch (error) {
      messageApi.error(error.response?.data?.message || error.message || "Failed to delete stream.");
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
      await updateStream(selected.id, values);
      messageApi.success("Stream updated successfully.");
      setOpen(false);
      await loadStreams();
    } catch (error) {
      messageApi.error(error.response?.data?.message || error.message || "Failed to update stream.");
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
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
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
