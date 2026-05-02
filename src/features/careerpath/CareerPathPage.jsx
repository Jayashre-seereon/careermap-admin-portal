import React, { useState } from "react";
import { Modal } from "antd";
import CareerPathTable from "./CareerPathTable";
import CareerPathForm from "./CareerPathForm";

const initialData = [
  {
    key: "1",
    module: "Career Library",
    category: "Medical",
    secondCategory: "GENERAL COURSES/DEGREES",
    subcategory: "MBBS",
    pathType: "Path 1",
    stream: "12th [PCB, PCMB, PCB(M), PCM(B)]",
    graduation: "MBBS",
    afterGraduation: "M.D / M.S",
    afterPostGraduation: "DM-MCH : SS",
    anyOther: "POST DOC",
  },
  {
    key: "2",
    module: "Career Library",
    category: "Lecturer/Professor",
    secondCategory: "GENERAL COURSES/DEGREES",
    subcategory: "Lecturer/Professor",
    pathType: "Path 1",
    stream: "12th",
    graduation: "Graduation in any stream",
    afterGraduation: "Post graduation in any discipline",
    afterPostGraduation: "Ph.D",
    anyOther: "N/A",
  },
  {
    key: "3",
    module: "Career Library",
    category: "Journalism & Mass communication",
    secondCategory: "GENERAL COURSES/DEGREES",
    subcategory: "Journalism & Mass communication",
    pathType: "Path 1",
    stream: "12th pass in any stream",
    graduation: "UG(J/JMC) / PG Diploma",
    afterGraduation: "Ph.D",
    afterPostGraduation: "N/A",
    anyOther: "N/A",
  },
];

export default function CareerPathPage() {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setCurrent(null);
    setViewMode(false);
  };

  const handleSubmit = (values) => {
    if (current) {
      setData((prev) =>
        prev.map((item) => (item.key === current.key ? { ...item, ...values } : item))
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
        onDelete={handleDelete}
        data={data}
      />

      <Modal open={open} footer={null} onCancel={handleClose} width={900}>
        <CareerPathForm
          initialValues={current}
          viewMode={viewMode}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
