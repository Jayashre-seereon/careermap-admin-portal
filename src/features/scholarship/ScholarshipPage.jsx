import { useState } from "react";
import { Modal } from "antd";
import ScholarshipTable from "./ScholarshipTable";
import ScholarshipForm from "./ScholarshipForm";

const initialData = [
  {
    key: "1",
    type: "State",
    class: "11th-12th",
    name: "Test Scholarship",
    desc: "Description",
    url: "#",
    isFree: false,
    markFree: false,
  },
  {
    key: "2",
    type: "Private",
    class: "N/A",
    name: "Tata Capital Pankh Scholarship",
    desc: "About The Program The Tata Capital Pankh Scholarship aims to support...",
    url: "https://www.buddy4study.com/page/",
    isFree: false,
    markFree: false,
  },
  {
    key: "3",
    type: "Private",
    class: "N/A",
    name: "SOF International Hindi Olympiad",
    desc: "About The Program SOF International Hindi Olympiad encourages students...",
    url: "https://www.hindiolympiad.com/",
    isFree: false,
    markFree: false,
  },
];

export default function ScholarshipPage() {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [current, setCurrent] = useState(null);

  const handleSubmit = (values) => {
    if (current) {
      setData((prev) =>
        prev.map((item) =>
          item.key === current.key ? { ...item, ...values } : item
        )
      );
    } else {
      setData((prev) => [
        ...prev,
        {
          key: Date.now().toString(),
          ...values,
        },
      ]);
    }

    setOpen(false);
    setCurrent(null);
    setViewMode(false);
  };

  const handleDelete = (record) => {
    setData((prev) => prev.filter((item) => item.key !== record.key));
  };

  const handleDelete = (record) => {
    setData((prev) => prev.filter((item) => item.key !== record.key));
  };

  return (
    <>
      <ScholarshipTable
        data={data}
        onAdd={() => {
          setCurrent(null);
          setOpen(true);
          setViewMode(false);
        }}
        onView={(record) => {
          setCurrent(record);
          setOpen(true);
          setViewMode(true);
        }}
        onEdit={(record) => {
          setCurrent(record);
          setOpen(true);
          setViewMode(false);
        }}
        onDelete={handleDelete}
      />

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setCurrent(null);
          setViewMode(false);
        }}
        footer={null}
        width={1000}
        title={
          viewMode
            ? "View Scholarship"
            : current
              ? "Edit Scholarship"
              : "Add Scholarship"
        }
      >
        <ScholarshipForm
          onSubmit={handleSubmit}
          initialValues={current}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}
