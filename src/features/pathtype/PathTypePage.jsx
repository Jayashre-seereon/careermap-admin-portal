import React, { useMemo, useState } from "react";
import { Modal } from "antd";
import PathTypeTable from "./PathTypeTable";
import PathTypeForm from "./PathTypeForm";

const initialData = [
  { key: "1", title: "Path 1" },
  { key: "2", title: "Path 2" },
  { key: "3", title: "Path 3" },
  { key: "4", title: "Path 4" },
  { key: "5", title: "Path 5" },
  { key: "6", title: "Path 6" },
  { key: "7", title: "Path 7" },
];

function PathTypePage() {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  );

  // Submit
  const handleSubmit = (values) => {
    if (current) {
      setData((prev) =>
        prev.map((item) =>
          item.key === current.key ? { ...item, ...values } : item
        )
      );
    } else {
      setData((prev) => [...prev, { key: `${Date.now()}`, ...values }]);
    }

    setOpen(false);
    setCurrent(null);
  };

  // Delete
  const handleDelete = (record) => {
    setData((prev) => prev.filter((item) => item.key !== record.key));
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
        data={filteredData}
        search={search}
        onSearch={setSearch}
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
