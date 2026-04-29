import React, { useState } from "react";
import { Modal } from "antd";
import CareerPathTable from "./CareerPathTable";
import CareerPathForm from "./CareerPathForm";

const initialData = [
  {
    key: "1",
    module: "Career Library",
    category: "Medical",
    path: "Path 1",
    stream: "12th [PCB, PCMB, PCB(M), PCM(B)]",
    graduation: "MBBS",
    afterGrad: "M.D / M.S",
    postGrad: "DM-MCH : SS",
    other: "POST DOC",
  },
  {
    key: "2",
    module: "Career Library",
    category: "Lecturer/Professor",
    path: "Path 1",
    stream: "12th",
    graduation: "Graduation in any stream",
    afterGrad: "Post graduation in any discipline",
    postGrad: "Ph.D",
    other: "N/A",
  },
  {
    key: "3",
    module: "Career Library",
    category: "Journalism & Mass communication",
    path: "Path 1",
    stream: "12th pass in any stream",
    graduation: "UG(J/JMC) / PG Diploma",
    afterGrad: "Ph.D",
    postGrad: "N/A",
    other: "N/A",
  },
];

export default function CareerPathPage() {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [viewMode, setViewMode] = useState(false);

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
