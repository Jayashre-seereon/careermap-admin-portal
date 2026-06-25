import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import CounselingForm from "./CounselingForm";
import CounselingTable from "./CounselingTable";
import {
  getCounselings,
  createCounseling,
  updateCounseling,
  deleteCounseling,
  downloadCounselingReport
} from "../../api/counseling";

function Counseling() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);

  const filteredSections = sections.filter((section) => {
    const keyword = search.toLowerCase();
    return (
      section.firstName?.toLowerCase().includes(keyword) ||
      section.lastName?.toLowerCase().includes(keyword) ||
      section.email?.toLowerCase().includes(keyword) ||
      section.inquiryFor?.toLowerCase().includes(keyword)
    );
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getCounselings();
      setSections(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // NOTE: errors are re-thrown so CounselingForm knows the submit failed
  // and won't clear the user's input.
  const handleAdd = async (values) => {
    try {
      await createCounseling(values);
      await fetchData();
      setOpen(false);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateCounseling(editId, values);
      await fetchData();
      setOpen(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDelete = async (record) => {
    try {
      if (!record?.id) return;
      await deleteCounseling(record.id);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (record) => {
    setSelected(record);
    setMode("view");
    setOpen(true);
  };

  const handleEdit = (record) => {
    setSelected(record);
    setEditId(record.id);
    setMode("edit");
    setOpen(true);
  };

  const handleDownload = async (record) => {
  try {
    const blob = await downloadCounselingReport(record.id);

    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      `counseling_${record.firstName}_${record.id}.pdf`
    );

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Download failed", err);
  }
};
  const modalTitle =
    mode === "add"
      ? "Add Counseling"
      : mode === "edit"
      ? "Edit Counseling"
      : "View Counseling";

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">
        Students Counseling Management
      </h2>

      <CounselingTable
        data={filteredSections}
        loading={loading}
        search={search}
        onSearch={setSearch}
        onAddClick={() => {
          setMode("add");
          setSelected(null);
          setEditId(null);
          setOpen(true);
        }}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        onDownload={handleDownload}   
      />

      <Modal
        title={modalTitle}
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
          setEditId(null);
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        <CounselingForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </div>
  );
}

export default Counseling;