import React, { useState, useEffect } from "react";
import { Card, Modal } from "antd";
import { useSessionStore } from "../../store/sessionStore";
import CounselingForm from "./CounselingForm";
import CounselingTable from "./CounselingTable";
import {
  getCounselings,
  getCounseling,
  createCounseling,
  updateCounseling,
  deleteCounseling,
  downloadCounselingReport
} from "../../api/counseling";

function Counseling() {
  const isStaff = useSessionStore((state) => state.loginType === "staff");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedInstituteId, setSelectedInstituteId] = useState(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);

  const instituteCounts = sections.reduce((counts, section) => {
    const instituteId = section.instituteId ?? section.schoolInstitutionId ?? section.schoolInstitution?.id;
    if (instituteId === null || instituteId === undefined || instituteId === "") return counts;
    const key = String(instituteId);
    const current = counts.get(key) || {
      id: key,
      name: section.schoolInstitution?.name || section.school || `Institute ${key}`,
      count: 0,
    };
    current.count += 1;
    counts.set(key, current);
    return counts;
  }, new Map());
  const institutes = [...instituteCounts.values()].sort((a, b) => a.name.localeCompare(b.name));

  const filteredSections = sections.filter((section) => {
    const keyword = search.toLowerCase();
    const instituteId = section.instituteId ?? section.schoolInstitutionId ?? section.schoolInstitution?.id;
    if (selectedInstituteId && String(instituteId ?? "") !== selectedInstituteId) return false;
    return (
      section.studentName?.toLowerCase().includes(keyword) ||
      section.firstName?.toLowerCase().includes(keyword) ||
      section.lastName?.toLowerCase().includes(keyword) ||
      section.email?.toLowerCase().includes(keyword) ||
      section.inquiryFor?.toLowerCase().includes(keyword) ||
      section.school?.toLowerCase().includes(keyword)
    );
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getCounselings();
      const list = Array.isArray(res) ? res : res.data || res.reports || res.counselings || [];
      setSections(list);
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
      if (isStaff) {
        throw new Error("Staff can create and view their counseling reports, but cannot edit them.");
      }
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
      if (!record?.id || isStaff) return;
      await deleteCounseling(record.id);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = async (record) => {
    if (isStaff) {
      try {
        const result = await getCounseling(record.id);
        setSelected(result?.data || result?.counseling || result);
      } catch (err) {
        console.error("Could not load counseling detail", err);
        setSelected(record);
      }
    } else {
      setSelected(record);
    }
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

    const safeName = (record.studentName || "counselee").replace(/\s+/g, "_");

    link.href = url;
    link.setAttribute(
      "download",
      `counseling_${safeName}_${record.id}.pdf`
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

      {institutes.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {institutes.map((institute) => {
            const active = selectedInstituteId === institute.id;
            return (
              <Card
                key={institute.id}
                hoverable
                onClick={() => setSelectedInstituteId(active ? null : institute.id)}
                className={`min-w-[190px] max-w-[220px] shrink-0 overflow-hidden rounded-xl border transition-all duration-200 ${active ? "border-[#9a2119] bg-rose-50 shadow-md ring-1 ring-[#9a2119]/20" : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md"}`}
                bodyStyle={{ padding: 14 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 h-1 w-8 rounded-full bg-[#9a2119]" />
                    <div className="truncate text-sm font-semibold text-slate-800" title={institute.name}>{institute.name}</div>
                    <div className="mt-1 text-xs text-slate-500">Counseling students</div>
                  </div>
                  <div className={`flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl px-2 text-lg font-bold ${active ? "bg-[#9a2119] text-white" : "bg-rose-100 text-[#9a2119]"}`}>
                    {institute.count}
                  </div>
                </div>
                {active && <div className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-[#9a2119]">Filtered</div>}
              </Card>
            );
          })}
        </div>
      )}

      <CounselingTable
        data={filteredSections}
        loading={loading}
        search={search}
        onSearch={setSearch}
        onReset={() => {
          setSearch("");
          setSelectedInstituteId(null);
        }}
        staffView={isStaff}
        onAddClick={() => {
          setMode("add");
          setSelected(null);
          setEditId(null);
          setOpen(true);
        }}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={isStaff ? null : handleEdit}
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
