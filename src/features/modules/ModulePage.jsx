import React, { useState } from "react";
import { Modal } from "antd";
import ModuleForm from "./ModuleForm";
import ModuleTable from "./ModuleTable";

const initialData = [
  {
    title: "Career Library",
    btnText: "Explore Now",
    url: "career_library/stream",
    image: "https://via.placeholder.com/100",
    position: "Top",
    isFree: true,
  },
];

export default function ModulePage() {
  const [modules, setModules] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const handleAdd = (data) => {
    setModules((prev) => [...prev, data]);
    setOpen(false);
  };

  const handleDelete = (index) => {
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleView = (record) => {
    setSelected(record);
    setMode("view");
    setOpen(true);
  };

  const handleEdit = (record, index) => {
    setSelected(record);
    setEditIndex(index);
    setMode("edit");
    setOpen(true);
  };

  const handleUpdate = (data) => {
    const updated = [...modules];
    updated[editIndex] = data;
    setModules(updated);
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">
        Module Management
      </h2>

      <ModuleTable
        data={modules}
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
            ? "Add Module"
            : mode === "edit"
            ? "Edit Module"
            : "View Module"
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1000}
      >
        <ModuleForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}