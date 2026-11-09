import React, { useState, useEffect } from "react";
import { Button, Card, Modal } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
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
import { getInstitutes } from "../../api/institutions";

function Counseling() {
  const isStaff = useSessionStore((state) => state.loginType === "staff");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedInstituteId, setSelectedInstituteId] = useState(null);
  const [allInstitutes, setAllInstitutes] = useState([]);
  const [institutePage, setInstitutePage] = useState(1);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [editId, setEditId] = useState(null);
  const [addInitialValues, setAddInitialValues] = useState(null);

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
  const institutes = allInstitutes.map((institute) => ({
    id: String(institute.id),
    name: institute.name || institute.instituteName || `Institute ${institute.id}`,
    count: instituteCounts.get(String(institute.id))?.count || 0,
  })).sort((a, b) => a.name.localeCompare(b.name));
  const institutePageSize = 20;
  const pageCount = Math.max(1, Math.ceil(institutes.length / institutePageSize));
  const pagedInstitutes = institutes.slice((institutePage - 1) * institutePageSize, institutePage * institutePageSize);

  const filteredSections = sections.filter((section) => {
    const keyword = search.toLowerCase();
    const instituteId = section.instituteId ?? section.schoolInstitutionId ?? section.schoolInstitution?.id;
    if (!selectedInstituteId || String(instituteId ?? "") !== selectedInstituteId) return false;
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
    getInstitutes().then((response) => {
      const rows = Array.isArray(response) ? response : response?.data || response?.institutes || [];
      setAllInstitutes(rows);
    }).catch((err) => console.error("Could not load institutes", err));
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
      setSelectedInstituteId(String(values.instituteId));
      setSearch("");
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
      {!selectedInstituteId && (
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-[#9a2119]">
            Students Counseling Management
          </h2>
          {!isStaff && <Button type="primary" style={{ background: "#9a2119", borderColor: "#9a2119" }} onClick={() => {
            setMode("add"); setSelected(null); setEditId(null); setAddInitialValues(null); setOpen(true);
          }}>+ Add</Button>}
        </div>
      )}

      {!selectedInstituteId && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {pagedInstitutes.map((institute) => (
              <Card
                key={institute.id}
                hoverable
                onClick={() => { setSearch(""); setSelectedInstituteId(institute.id); }}
                className="w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md"
                bodyStyle={{ padding: 14 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 h-1 w-8 rounded-full bg-[#9a2119]" />
                    <div className="truncate text-sm font-semibold text-slate-800" title={institute.name}>{institute.name}</div>
                    <div className="mt-1 text-xs text-slate-500">Counseling students</div>
                  </div>
                  <div className="flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 px-2 text-lg font-bold text-[#9a2119]">
                    {institute.count}
                  </div>
                </div>
              </Card>
          ))}
          </div>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{institutes.length} institutes</span>
            <div className="flex items-center gap-2">
              <Button aria-label="Previous institutes" icon={<LeftOutlined />} disabled={institutePage <= 1} onClick={() => setInstitutePage((page) => page - 1)} />
              <span>Page {institutePage} of {pageCount}</span>
              <Button aria-label="Next institutes" icon={<RightOutlined />} disabled={institutePage >= pageCount} onClick={() => setInstitutePage((page) => page + 1)} />
            </div>
          </div>
        </>
      )}

      {selectedInstituteId && <>
      <div className="flex items-center gap-3">
        <Button icon={<LeftOutlined />} onClick={() => { setSelectedInstituteId(null); setSearch(""); }}>Institutes</Button>
        <h2 className="text-xl font-bold text-[#9a2119]">{institutes.find((item) => item.id === selectedInstituteId)?.name}</h2>
      </div>
      <CounselingTable
        data={filteredSections}
        loading={loading}
        search={search}
        onSearch={setSearch}
        onReset={() => setSearch("")}
        staffView={isStaff}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={isStaff ? null : handleEdit}
        onDownload={handleDownload}   
      />
      </>}

      <Modal
        title={modalTitle}
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
          setEditId(null);
          setAddInitialValues(null);
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        <CounselingForm
          onSubmit={mode === "edit" ? handleUpdate : handleAdd}
          initialValues={selected || addInitialValues}
          disabled={mode === "view"}
          instituteDisabled={mode === "edit"}
          instituteOptions={institutes.map((institute) => ({ id: Number(institute.id), name: institute.name }))}
        />
      </Modal>
    </div>
  );
}

export default Counseling;
