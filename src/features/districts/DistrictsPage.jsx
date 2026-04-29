import { useState } from "react";
import { Modal } from "antd";
import DistrictsTable from "./DistrictsTable";
import DistrictsForm from "./DistrictsForm";

export default function DistrictsPage() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <DistrictsTable
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
        width={500}
      >
        <DistrictsForm
          initialValues={selected}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}