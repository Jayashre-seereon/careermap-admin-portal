import React, { useState } from "react";
import { Modal } from "antd";
import JobScopeTable from "./JobScopeTable";
import JobScopeForm from "./JobScopeForm";

const initialData = [
  {
    id: 1,
    stream: "Science",
    category: "Medical",
    secondCategory: "ALLIED & PARA MEDICAL COURSES/DEGREES",
    subcategory: "N/A",
    name: "Physiotheraphist",
  },
  {
    id: 2,
    stream: "Science",
    category: "Medical",
    secondCategory: "ALLIED & PARA MEDICAL COURSES/DEGREES",
    subcategory: "RADIOLOGY",
    name: "Radiologist",
  },
  {
    id: 3,
    stream: "Science",
    category: "Medical",
    secondCategory: "ALLIED & PARA MEDICAL COURSES/DEGREES",
    subcategory: "N/A",
    name: "Pharamacist",
  },
];

function JobScopePage() {
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  // Submit
  const handleSubmit = (values) => {
    if (current) {
      setData((prev) =>
        prev.map((item) =>
          item.id === current.id ? { ...item, ...values } : item
        )
      );
    } else {
      setData([...data, { id: Date.now(), ...values }]);
    }

    setOpen(false);
    setCurrent(null);
  };

  // Delete
  const handleDelete = (record) => {
    setData(data.filter((item) => item.id !== record.id));
  };

  // Search
  const handleSearch = (value) => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="w-full">
      
      {/* Title */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-4">
        Job Scope Management
      </h1>

      {/* Table */}
      <JobScopeTable
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
        onSearch={handleSearch}
      />

      {/* Modal */}
      <Modal
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        width={700}
      >
        <JobScopeForm
          onSubmit={handleSubmit}
          initialValues={current}
          viewMode={viewMode}
        />
      </Modal>
    </div>
  );
}

export default JobScopePage;