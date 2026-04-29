import React, { useState } from "react";
import Category2Table from "./Category2Table";
import Category2Form from "./Category2Form";
import { Modal } from "antd";

const initialData = [
  {
    id: 1,
    category: "Medical",
    name: "GENERAL COURSES/DEGREES",
    description: "",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    category: "Medical",
    name: "ALLIED & PARA MEDICAL COURSES/DEGREES",
    description: "",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    category: "Architecture & Planning",
    name: "Architecture",
    description: "Architecture is a multidisciplinary field combining art, design, technology, and sustainability to create functional, safe, and visually appealing buildings and spaces. A bachelor’s degree typically spans 5 years, covering design studios, architectural history, building technology, CAD, model-making, and real-world projects. Admission in India is competitive, usually via NATA or JEE Paper 2. Graduates can work in architectural firms, urban planning, interior and landscape design, construction management, sustainable design, and heritage conservation. The profession requires creativity, spatial awareness, problem-solving, and technical expertise, making architects vital contributors to modern infrastructure, cultural identity, and sustainable urban development.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

export default function Category2Page() {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);

  // 🔍 FILTER LOGIC
  const filteredData = data.filter((item) =>
    `${item.category} ${item.name} ${item.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setMode("add");
    setSelected(null);
    setOpen(true);
  };

  const handleEdit = (record) => {
    setMode("edit");
    setSelected(record);
    setOpen(true);
  };

  const handleView = (record) => {
    setMode("view");
    setSelected(record);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleSubmit = (values) => {
    if (mode === "edit") {
      setData(data.map((d) => (d.id === selected.id ? { ...d, ...values } : d)));
    } else {
      setData([...data, { ...values, id: Date.now() }]);
    }
    setOpen(false);
  };

  return (
    <div className="p-5">
      <Category2Table
        data={filteredData}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        search={search}
        setSearch={setSearch}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1000}
        title={
          mode === "add"
            ? "Add Category"
            : mode === "edit"
            ? "Edit Category"
            : "View Category"
        }
      >
        <Category2Form
          onSubmit={handleSubmit}
          initialValues={selected}
          mode={mode}
        />
      </Modal>
    </div>
  );
}