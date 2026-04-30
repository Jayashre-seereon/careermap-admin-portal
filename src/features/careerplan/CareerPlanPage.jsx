import { useState } from "react";
import { Modal } from "antd";
import CareerPlanTable from "./CareerPlanTable";
import CareerPlanForm from "./CareerPlanForm";

const initialData = [
  {
    key: "1",
    title: "Psychometric Career Counselling",
    image: "https://via.placeholder.com/40",
    description: "Career Map's Psychometric Career Counselling provides detailed insights...",
    url: "#",
  },
  {
    key: "2",
    title: "Behavioural & Psychological Counselling",
    image: "https://via.placeholder.com/40",
    description: "Career Map's Behavioural & Psychological Counselling helps students...",
    url: "#",
  },
];

export default function CareerPlanPage() {
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
      <CareerPlanTable
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
        <CareerPlanForm
          onSubmit={handleSubmit}
          initialValues={selected}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}
