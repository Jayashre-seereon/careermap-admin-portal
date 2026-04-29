import React, { useState } from "react";
import { Modal } from "antd";
import MentorForm from "./MentorForm";
import MentorTable from "./MentorTable";

const initialData = [
  {
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "9876543210",
    category: "IT",
    designation: "Frontend Dev",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Das",
    email: "priya@gmail.com",
    phone: "9123456780",
    category: "Management",
    designation: "HR Manager",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

export default function MentorPage() {
  const [mentors, setMentors] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit | view
  const [selected, setSelected] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // ADD
  const handleAdd = (data) => {
    setMentors((prev) => [...prev, data]);
    setOpen(false);
  };

  // DELETE
  const handleDelete = (index) => {
    setMentors((prev) => prev.filter((_, i) => i !== index));
  };

  // VIEW
  const handleView = (record) => {
    setSelected(record);
    setMode("view");
    setOpen(true);
  };

  // EDIT
  const handleEdit = (record, index) => {
    setSelected(record);
    setEditIndex(index);
    setMode("edit");
    setOpen(true);
  };

  // UPDATE
  const handleUpdate = (data) => {
    const updated = [...mentors];
    updated[editIndex] = data;
    setMentors(updated);
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">
        Mentor Management
      </h2>

      <MentorTable
        data={mentors}
        onAddClick={() => {
          setMode("add");
          setSelected(null);
          setOpen(true);
        }}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
      />

      <Modal
        title={
          mode === "add"
            ? "Add Mentor"
            : mode === "edit"
            ? "Edit Mentor"
            : "View Mentor"
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1000}
      >
        <MentorForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}