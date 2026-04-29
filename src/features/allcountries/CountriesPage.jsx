import { useState } from "react";
import { Modal } from "antd";
import CountriesTable from "./CountriesTable";
import CountriesForm from "./CountriesForm";

export default function CountriesPage() {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <CountriesTable
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
        <CountriesForm
          initialValues={selected}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}