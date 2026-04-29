import React, { useState } from "react";
import { Modal } from "antd";
import CareerPathTable from "./CareerPathTable";
import CareerPathForm from "./CareerPathForm";

export default function CareerPathPage() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-[#9a2119] mb-4">
        Career Path Management
      </h1>

      <CareerPathTable
        onAdd={() => {
          setOpen(true);
          setCurrent(null);
          setViewMode(false);
        }}
        onView={(rec) => {
          setCurrent(rec);
          setViewMode(true);
          setOpen(true);
        }}
        onEdit={(rec) => {
          setCurrent(rec);
          setViewMode(false);
          setOpen(true);
        }}
      />

      <Modal open={open} footer={null} onCancel={() => setOpen(false)} width={900}>
        <CareerPathForm
          initialValues={current}
          viewMode={viewMode}
          onSubmit={() => setOpen(false)}
        />
      </Modal>
    </div>
  );
}