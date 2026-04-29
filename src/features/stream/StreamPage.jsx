import React, { useState } from "react";
import { Modal } from "antd";
import StreamForm from "./StreamForm";
import StreamTable from "./StreamTable";

const initialData = [
  {
    name: "Engineering",
    image: "https://via.placeholder.com/80",
  },
  {
    name: "Medical",
    image: "https://via.placeholder.com/80",
  },
];

export default function StreamPage() {
  const [streams, setStreams] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // ADD
  const handleAdd = (data) => {
    setStreams((prev) => [...prev, data]);
    setOpen(false);
  };

  // DELETE
  const handleDelete = (index) => {
    setStreams((prev) => prev.filter((_, i) => i !== index));
  };

  // VIEW
  const handleView = (record) => {
    setSelected(record);
    setMode("view");
    setOpen(true);
  };

  // EDIT
  const handleEdit = (record, index) => {
    setSelected(record);
    setEditIndex(index);
    setMode("edit");
    setOpen(true);
  };

  // UPDATE
  const handleUpdate = (data) => {
    const updated = [...streams];
    updated[editIndex] = data;
    setStreams(updated);
    setOpen(false);
  };

  return (
    <div className="space-y-5">

      <h2 className="text-xl font-bold text-[#9a2119]">
        Stream Management
      </h2>

      <StreamTable
        data={streams}
        onAddClick={() => {
          setMode("add");
          setSelected(null);
          setOpen(true);
        }}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
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