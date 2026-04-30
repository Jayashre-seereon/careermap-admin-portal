import { useState } from "react";
import { Modal } from "antd";
import EntranceExamTable from "./EntranceExamTable";
import EntranceExamForm from "./EntranceExamForm";
import dayjs from "dayjs";

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
    setEditingData({
      ...record,
      issue: record.issueDate ? dayjs(record.issueDate) : null,
      last: record.lastDate ? dayjs(record.lastDate) : null,
    });
    setViewMode(true);
    setOpen(true);
  };

  const handleEdit = (record) => {
    setEditingData({
      ...record,
      issue: record.issueDate ? dayjs(record.issueDate) : null,
      last: record.lastDate ? dayjs(record.lastDate) : null,
    });
    setViewMode(false);
    setOpen(true);
  };

  const handleSubmit = (values) => {
    const normalizedValues = {
      ...values,
      issueDate: values.issue?.format ? values.issue.format("YYYY-MM-DD") : values.issue,
      lastDate: values.last?.format ? values.last.format("YYYY-MM-DD") : values.last,
    };

    if (editingData) {
      setData((prev) =>
        prev.map((item) =>
          item.key === editingData.key ? { ...item, ...normalizedValues } : item
        )
      );
    } else {
      setData((prev) => [
        ...prev,
        { key: Date.now().toString(), ...normalizedValues },
      ]);
    }

    setOpen(false);
    setEditingData(null);
    setViewMode(false);
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
