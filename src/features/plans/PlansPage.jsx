import { useState } from "react";
import { Modal } from "antd";
import PlansTable from "./PlansTable";
import PlansForm from "./PlansForm";

export default function PlansPage() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <PlansTable
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
        width={900}
      >
        <PlansForm
          initialValues={selected}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}