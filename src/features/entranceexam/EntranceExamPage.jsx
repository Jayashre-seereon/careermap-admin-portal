import { useState } from "react";
import { Modal } from "antd";
import EntranceExamTable from "./EntranceExamTable";
import EntranceExamForm from "./EntranceExamForm";

const initialData = [
  {
    key: "1",
    module: "Career Library",
    category: "Railways",
    exam: "RRC Level 1 Exam (Group D posts)",
    issueDate: "February 2025",
    lastDate: "March 2025",
    url: "https://www.rrbcdg.gov.in/",
  },
  {
    key: "2",
    module: "Career Library",
    category: "Railways",
    exam: "RRB Assistant Station Master Exam",
    issueDate: "July 2025",
    lastDate: "August 2025",
    url: "https://www.rrbcdg.gov.in/",
  },
  {
    key: "3",
    module: "Career Library",
    category: "Railways",
    exam: "RRB Ministerial & Isolated Categories Exam",
    issueDate: "April 2025",
    lastDate: "May 2025",
    url: "https://www.rrbcdg.gov.in/",
  },
];

export default function EntranceExamPage() {
  const [data, setData] = useState(initialData);
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

  const handleDelete = (record) => {
    setData((prev) => prev.filter((item) => item.key !== record.key));
  };

  return (
    <>
      <EntranceExamTable
        data={data}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
