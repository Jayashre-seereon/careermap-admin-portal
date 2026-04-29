import { useState } from "react";
import { Modal } from "antd";
import CareerPlanTable from "./CareerPlanTable";
import CareerPlanForm from "./CareerPlanForm";

export default function CareerPlanPage() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <CareerPlanTable
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
        <CareerPlanForm
          initialValues={selected}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}