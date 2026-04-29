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
  },
  {
    key: "2",
    type: "Private",
    class: "N/A",
    name: "Tata Capital Pankh Scholarship",
    desc: "About The Program The Tata Capital Pankh Scholarship aims to support...",
    url: "https://www.buddy4study.com/page/",
  },
  {
    key: "3",
    type: "Private",
    class: "N/A",
    name: "SOF International Hindi Olympiad",
    desc: "About The Program SOF International Hindi Olympiad encourages students...",
    url: "https://www.hindiolympiad.com/",
  },
];

export default function ScholarshipPage() {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  const handleDelete = (record) => {
    setData((prev) => prev.filter((item) => item.key !== record.key));
  };

  return (
    <>
      <ScholarshipTable
        data={data}
        onAdd={() => {
          setOpen(true);
          setViewMode(false);
        }}
        onView={() => {
          setOpen(true);
          setViewMode(true);
        }}
        onDelete={handleDelete}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1000}
      >
        <ScholarshipForm viewMode={viewMode} />
      </Modal>
    </>
  );
}
