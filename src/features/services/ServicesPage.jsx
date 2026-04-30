import { useState } from "react";
import { Modal } from "antd";
import ServicesTable from "./ServicesTable";
import ServicesForm from "./ServicesForm";

const initialData = [
  {
    key: "1",
    title: "Psychometric Career Counselling",
    price: "1.00",
    icon: "",
    status: "Active",
    description: "",
  },
  {
    key: "2",
    title: "Behavioural & Psychological Counselling",
    price: "1.00",
    icon: "",
    status: "Active",
    description: "",
  },
];

export default function ServicesPage() {
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
      <ServicesTable
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
        width={800}
      >
        <ServicesForm
          onSubmit={handleSubmit}
          initialValues={selected}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}
