import { useState } from "react";
import { Modal } from "antd";
import ServicesTable from "./ServicesTable";
import ServicesForm from "./ServicesForm";

export default function ServicesPage() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <ServicesTable
        onAdd={() => {
          setSelected(null);
          setViewMode(false);
          setOpen(true);
        }}
        onView={(data) => {
          setSelected(data);
          setViewMode(true);
          setOpen(true);
        }}
        onEdit={(data) => {
          setSelected(data);
          setViewMode(false);
          setOpen(true);
        }}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        <ServicesForm
          initialValues={selected}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}