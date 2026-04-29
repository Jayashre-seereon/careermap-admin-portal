import { useState } from "react";
import { Modal } from "antd";
import EntranceExamTable from "./EntranceExamTable";
import EntranceExamForm from "./EntranceExamForm";

export default function EntranceExamPage() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const handleAdd = () => {
    setEditingData(null);
    setViewMode(false);
    setOpen(true);
  };

  const handleView = (record) => {
    setEditingData(record);
    setViewMode(true);
    setOpen(true);
  };

  const handleEdit = (record) => {
    setEditingData(record);
    setViewMode(false);
    setOpen(true);
  };

  const handleSubmit = (values) => {
    console.log("Form Data:", values);
    setOpen(false);
  };

  return (
    <>
      <EntranceExamTable
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <EntranceExamForm
          onSubmit={handleSubmit}
          initialValues={editingData}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}