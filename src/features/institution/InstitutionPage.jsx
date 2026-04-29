import React, { useState } from "react";
import { Modal } from "antd";
import InstitutionTable from "./InstitutionTable";
import InstitutionForm from "./InstitutionForm";

const initialData = [
  {
    key: "1",
    name: "Jawaharlal Institute of Postgraduate Medical Education & Research (JIPMER), Puducherry",
    logo: "https://via.placeholder.com/40",
    address: "Jipmer Campus Rd, Jipmer Campus, Puducherry",
    admission: "NEET-UG, NEET-PG",
    date: "July 2025",
    type: "Govt.",
    url: "https://jipmer.edu.in/",
    country: "India",
    state: "PONDICHERY",
    district: "Pondicherry",
  },
  {
    key: "2",
    name: "PGIMER Chandigarh",
    logo: "https://via.placeholder.com/40",
    address: "Sector 12, Chandigarh",
    admission: "NEET-PG, INI-CET",
    date: "July 2025",
    type: "Govt.",
    url: "https://pgimer.edu.in/",
    country: "India",
    state: "PUNJAB",
    district: "Amritsar",
  },
];

export default function InstitutionPage() {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  const handleAdd = () => {
    setEditData(null);
    setViewMode(false);
    setOpen(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setViewMode(false);
    setOpen(true);
  };

  const handleView = (data) => {
    setEditData(data);
    setViewMode(true);
    setOpen(true);
  };

  const handleDelete = (data) => {
    setData((prev) => prev.filter((item) => item.key !== data.key));
  };

  const handleSubmit = (values) => {
    console.log("Submitted:", values);
    setOpen(false);
  };

  return (
    <>
      <InstitutionTable
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1000}
        title={viewMode ? "View Institution" : "Add / Edit Institution"}
      >
        <InstitutionForm
          onSubmit={handleSubmit}
          initialValues={editData}
          viewMode={viewMode}
        />
      </Modal>
    </>
  );
}
