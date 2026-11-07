import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Table } from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { getInstituteCounselingReports, downloadCounselingReport } from "../../api/counseling";

const rowsFrom = (response) => Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];

export default function InstituteCounselingPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setReports(rowsFrom(await getInstituteCounselingReports())); }
    catch (err) { setError(err?.response?.data?.message || err?.message || "Could not load counseling reports."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter((r) => !q || [r.studentName, r.school, r.class, r.stream, r.email].filter(Boolean).join(" ").toLowerCase().includes(q));
  }, [reports, search]);
  const download = async (record) => {
    try {
      const blob = await downloadCounselingReport(record.id);
      const url = URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a"); link.href = url;
      link.download = `counseling_${(record.studentName || "student").replace(/\s+/g, "_")}_${record.id}.pdf`;
      link.click(); URL.revokeObjectURL(url);
    } catch (err) { setError(err?.response?.data?.message || "Could not download report."); }
  };
  const columns = [
    { title: "Student", dataIndex: "studentName", key: "student" },
    { title: "School / Institute", dataIndex: "school", key: "school" },
    { title: "Class", dataIndex: "class", key: "class" },
    { title: "Stream", dataIndex: "stream", key: "stream" },
    { title: "Date", dataIndex: "counselingDate", key: "date", render: (value) => value ? new Date(value).toLocaleDateString("en-IN") : "-" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Report", key: "report", render: (_, row) => <Button size="small" aria-label="Download report" title="Download" icon={<DownloadOutlined />} onClick={() => download(row)} style={{ color: "#8f2218", borderColor: "#8f2218" }} /> },
  ];
  return <section className="space-y-5"><div><h2 className="text-2xl font-bold text-[#8f2218]">Counseling Reports</h2><p className="mt-1 text-sm text-slate-500">Counseling records linked to your institute.</p></div>{error && <Alert type="error" showIcon message={error} />}<div className="rounded-2xl border border-[#eaded8] bg-white p-4 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><strong>{reports.length} reports</strong><Input allowClear prefix={<SearchOutlined />} placeholder="Search counseling reports" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-sm" /></div><Table rowKey="id" columns={columns} dataSource={filtered} loading={loading} pagination={{ pageSize: 10 }} scroll={{ x: 800 }} /></div></section>;
}
