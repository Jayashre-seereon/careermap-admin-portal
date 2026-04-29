import React, { useState } from "react";
import { Modal } from "antd";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./CategoryForm";

const initialData = [
  {
    title: "Medical",
    description: "Medical is the most respected profession...",
    isUpgrade: "Free",
  },
  {
    title: "Engineering",
    description: "Engineers work in many industries...",
    isUpgrade: "Free",
  },
  {
    title: "Commercial Pilot",
    description: "A Commercial Pilot is a licensed aviation...",
    isUpgrade: "Free",
  },
];

export default function CategoryPage() {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const handleAdd = (values) => {
    setData([...data, values]);
    setOpen(false);
  };

  const handleDelete = (index) => {
    setData(data.filter((_, i) => i !== index));
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

  const handleUpdate = (values) => {
    const updated = [...data];
    updated[editIndex] = values;
    setData(updated);
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">
        Category Management
      </h2>

      <CategoryTable
        data={data}
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
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1100}
        title={mode === "add" ? "Add Category" : mode === "edit" ? "Edit Category" : "View Category"}
      >
        <CategoryForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}