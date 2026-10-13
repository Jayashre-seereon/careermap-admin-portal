import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Input, Table, Tag } from "antd";
import { FilePdfOutlined, SearchOutlined } from "@ant-design/icons";
import { getInstitutePsychometricAttempts } from "../../api/psychometricAssessmentApi";

const rowsFrom = (response) => Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];

export default function InstituteAttemptsPage() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadAttempts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setAttempts(rowsFrom(await getInstitutePsychometricAttempts()));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Could not load psychometric attempts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAttempts(); }, [loadAttempts]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return attempts.filter((attempt) => !query || [attempt.student?.name, attempt.student?.email, attempt.assessmentTitle, attempt.result?.hollandCode, attempt.result?.topCareerCluster, attempt.status].filter(Boolean).join(" ").toLowerCase().includes(query));
  }, [attempts, search]);

  const columns = [
    { title: "Student", key: "student", render: (_, row) => <div><div className="font-semibold text-slate-800">{row.student?.name || "—"}</div><div className="text-xs text-slate-500">{row.student?.email || ""}</div></div> },
    { title: "Assessment", dataIndex: "assessmentTitle", key: "assessment" },
    { title: "Status", dataIndex: "status", key: "status", render: (value) => <Tag color={value === "completed" ? "green" : "blue"}>{value || "Unknown"}</Tag> },
    { title: "Completed", dataIndex: "completedAt", key: "completed", render: (value) => value ? new Date(value).toLocaleString() : "—" },
    { title: "Result", key: "result", render: (_, row) => row.result ? <div><div>{row.result.hollandCode || "—"} · {row.result.topCareerCluster || "—"}</div><div className="text-xs text-slate-500">{row.result.topCareerMatch != null ? `${row.result.topCareerMatch}% match` : ""}</div></div> : "—" },
    { title: "Report", key: "report", render: (_, row) => row.status === "completed" ? <Button type="primary" icon={<FilePdfOutlined />} onClick={() => navigate(`/institute/psychometric-attempts/${row.attemptId}/report`, { state: { attempt: row } })} className="!bg-[#8f2218]">View report</Button> : "—" },
  ];

  return <section className="space-y-5">
    <div><h2 className="text-2xl font-bold text-[#8f2218]">Psychometric Test Attempts</h2><p className="mt-1 text-sm text-slate-500">Assessment attempts and results for your students.</p></div>
    {error && <Alert type="error" showIcon message={error} />}
    <div className="rounded-2xl border border-[#eaded8] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="font-semibold text-slate-700">{attempts.length} attempts</div><Input allowClear prefix={<SearchOutlined />} placeholder="Search student, assessment, or result" value={search} onChange={(event) => setSearch(event.target.value)} className="sm:max-w-sm" /></div>
      <Table rowKey={(row) => row.attemptId} columns={columns} dataSource={filtered} loading={loading} pagination={{ pageSize: 10, showSizeChanger: true }} scroll={{ x: 900 }} />
    </div>
  </section>;
}
