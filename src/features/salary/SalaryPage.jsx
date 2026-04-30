import React, { useMemo, useState } from "react";
import { Modal } from "antd";
import SalaryTable from "./SalaryTable";
import SalaryForm from "./SalaryForm";

const initialData = [
  {
    id: 1,
    stream: "Science",
    category: "Medical",
    secondCategory: "GENERAL COURSES/DEGREES",
    subcategory: "MBBS",
    salary: "MBBS Degree : INR 30,000 to INR 70,000 per month",
  },
  {
    id: 2,
    stream: "Science",
    category: "Medical",
    secondCategory: "GENERAL COURSES/DEGREES",
    subcategory: "MBBS",
    salary: "MD/MS Degree : INR 7 to 15 lakhs per annum",
  },
  {
    id: 3,
    stream: "Science",
    category: "Medical",
    secondCategory: "GENERAL COURSES/DEGREES",
    subcategory: "MBBS",
    salary: "DM-MCH Degree : INR 20 to 30 lakhs per annum",
  },
];

function SalaryPage() {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const filteredData = useMemo(
    () =>
      data.filter((item) =>
       (item.subcategory || "").toLowerCase().includes((search || "").toLowerCase())      ),
    [data, search]
  );

  // Add / Update
  const handleSubmit = (values) => {
    if (current) {
      setData((prev) =>
        prev.map((item) =>
          item.id === current.id ? { ...item, ...values } : item
        )
      );
    } else {
      setData((prev) => [...prev, { id: Date.now(), ...values }]);
    }

    setOpen(false);
    setCurrent(null);
  };

  // Delete
  const handleDelete = (record) => {
    setData((prev) => prev.filter((item) => item.id !== record.id));
  };

  return (
    <div className="w-full">
      
      {/* Title */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-4">
        Salary Range Management
      </h1>

      {/* Table */}
      <SalaryTable
        data={filteredData}
        onAdd={() => {
          setOpen(true);
          setCurrent(null);
          setViewMode(false);
        }}
        onView={(rec) => {
          setCurrent(rec);
          setOpen(true);
          setViewMode(true);
        }}
        onEdit={(rec) => {
          setCurrent(rec);
          setOpen(true);
          setViewMode(false);
        }}
        onDelete={handleDelete}
        search={search}
        onSearch={setSearch}
      />

      {/* Modal */}
      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        width={800}
      >
        <SalaryForm
          onSubmit={handleSubmit}
          initialValues={current}
          viewMode={viewMode}
        />
      </Modal>
    </div>
  );
}

export default SalaryPage;
