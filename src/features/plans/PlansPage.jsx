import { useState } from "react";
import { Modal } from "antd";
import PlansTable from "./PlansTable";
import PlansForm from "./PlansForm";

const initialData = [
  {
    key: "1",
    name: "Free",
    features: "Career Library, Entrance Exam, Institute, Quiz",
    module: ["Career Library", "Entrance Exam", "Institute", "Quiz"],
    price: "0",
  },
  {
    key: "2",
    name: "Gold",
    features: "Mock Test, Live Test, Practice Questions",
    module: ["Career Library", "Career Assessment"],
    price: "1",
  },
];

export default function PlansPage() {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setViewMode(false);
  };

  const handleSubmit = (values) => {
    if (selected) {
      setData((prev) =>
        prev.map((item) => (item.key === selected.key ? { ...item, ...values } : item))
      );
    } else {
      setData((prev) => [...prev, { key: Date.now().toString(), ...values }]);
    }

    handleClose();
  };

  const handleDelete = (record) => {
    setData((prev) => prev.filter((item) => item.key !== record.key));
  };

  return (
    <>
      <PlansTable
        data={data}
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
        onDelete={handleDelete}
      />

      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        width={900}
      >
        <PlansForm
          onSubmit={handleSubmit}
          initialValues={selected}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}
