import { useState } from "react";
import { Modal } from "antd";
import ScholarshipTable from "./ScholarshipTable";
import ScholarshipForm from "./ScholarshipForm";

export default function ScholarshipPage() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  return (
    <>
      <ScholarshipTable
        onAdd={() => {
          setOpen(true);
          setViewMode(false);
        }}
        onView={() => {
          setOpen(true);
          setViewMode(true);
        }}
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