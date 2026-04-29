import { useState } from "react";
import { Modal } from "antd";
import StatesTable from "./StatesTable";
import StatesForm from "./StatesForm";

export default function StatesPage() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <StatesTable
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
        <StatesForm
          initialValues={selected}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}