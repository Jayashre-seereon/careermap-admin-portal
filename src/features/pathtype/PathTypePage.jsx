import React, { useState } from "react";
import { Modal } from "antd";
import PathTypeTable from "./PathTypeTable";
import PathTypeForm from "./PathTypeForm";

const initialData = [
  { id: 1, title: "Path 1" },
  { id: 2, title: "Path 2" },
  { id: 3, title: "Path 3" },
  { id: 4, title: "Path 4" },
  { id: 5, title: "Path 5" },
  { id: 6, title: "Path 6" },
  { id: 7, title: "Path 7" },
];

function PathTypePage() {
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
      item.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="w-full">
      
      {/* Title */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-4">
        Path Type Management
      </h1>

      {/* Table */}
      <PathTypeTable
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
        width={500}
      >
        <PathTypeForm
          onSubmit={handleSubmit}
          initialValues={current}
          viewMode={viewMode}
        />
      </Modal>
    </div>
  );
}

export default PathTypePage;