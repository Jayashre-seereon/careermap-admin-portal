import React, { useState } from "react";
import { Modal } from "antd";
import InstitutionTable from "./InstitutionTable";
import InstitutionForm from "./InstitutionForm";

export default function InstitutionPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const handleAdd = () => {
    setEditData(null);
    setViewMode(false);
    setOpen(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setViewMode(false);
    setOpen(true);
  };

  const handleView = (data) => {
    setEditData(data);
    setViewMode(true);
    setOpen(true);
  };

  const handleDelete = (data) => {
    console.log("Deleted:", data);
  };

  const handleSubmit = (values) => {
    console.log("Submitted:", values);
    setOpen(false);
  };

  return (
    <>
      <InstitutionTable
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1000}
        title={viewMode ? "View Institution" : "Add / Edit Institution"}
      >
        <InstitutionForm
          onSubmit={handleSubmit}
          initialValues={editData}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}