import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Input, Table, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getInstituteStudents } from "../../api/psychometricAssessmentApi";

const rowsFrom = (response) => Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];

export default function InstituteStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setStudents(rowsFrom(await getInstituteStudents()));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Could not load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => !query || [student.fullName, student.username, student.email, student.mobile, student.class, student.stream].filter(Boolean).join(" ").toLowerCase().includes(query));
  }, [students, search]);

  const columns = [
    { title: "Student", dataIndex: "fullName", key: "name", render: (value, row) => <div><div className="font-semibold text-slate-800">{value || row.username || "—"}</div><div className="text-xs text-slate-500">{row.username ? `@${row.username}` : ""}</div></div> },
    { title: "Email", dataIndex: "email", key: "email", render: (value) => value || "—" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile", render: (value) => value || "—" },
    { title: "Class / Stream", key: "class", render: (_, row) => [row.class, row.stream].filter(Boolean).join(" · ") || "—" },
    { title: "Quiz Attempts", dataIndex: "totalQuizAttempts", key: "quiz", render: (value) => value ?? 0 },
    { title: "Psychometric", dataIndex: "hasAttemptedPsychometric", key: "attempted", render: (value) => <Tag color={value ? "green" : "default"}>{value ? "Attempted" : "Not attempted"}</Tag> },
    { title: "Latest Result", key: "result", render: (_, row) => row.latestPsychometric ? <div><div>{row.latestPsychometric.hollandCode || "—"} · {row.latestPsychometric.topCareerCluster || "—"}</div><div className="text-xs text-slate-500">{row.latestPsychometric.topCareerMatch != null ? `${row.latestPsychometric.topCareerMatch}% match` : ""}</div></div> : "—" },
  ];

  return <section className="space-y-5">
    <div><h2 className="text-2xl font-bold text-[#8f2218]">All Students</h2><p className="mt-1 text-sm text-slate-500">Students registered with your institute.</p></div>
    {error && <Alert type="error" showIcon message={error} />}
    <div className="rounded-2xl border border-[#eaded8] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="font-semibold text-slate-700">{students.length} students</div><Input allowClear prefix={<SearchOutlined />} placeholder="Search students" value={search} onChange={(event) => setSearch(event.target.value)} className="sm:max-w-xs" /></div>
      <Table rowKey={(row) => row.id ?? row.username} columns={columns} dataSource={filtered} loading={loading} pagination={{ pageSize: 10, showSizeChanger: true }} scroll={{ x: 900 }} />
    </div>
  </section>;
}
