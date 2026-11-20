import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  message,
} from "antd";
import {
  AimOutlined,
  AuditOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAttemptDetails,
  getStudentAttempts,
  getApiErrorMessage,
} from "../../api/psychometricAssessmentApi";
import { FACET_MAP } from "./psychometricConstants";
import { buildAttemptAnswerRows } from "./attemptAnswers";
import { getSerialNumber } from "../../utils/slNo";
import useDebouncedValue from "../../hooks/useDebouncedValue";

const { Option } = Select;

// Helpers to extract candidate details from API response
export const getCandidateName = (record) => {
  if (!record) return "Candidate";
  if (record.studentName && record.studentName !== "Candidate") return record.studentName;
  if (record.user) {
    const { firstName, lastName, username, name } = record.user;
    const parts = [firstName, lastName].filter(Boolean);
    if (parts.length > 0) {
      return parts
        .map((p) => String(p).trim())
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(" ");
    }
    if (name) return name;
    if (username) return username;
  }
  if (record.name) return record.name;
  return "Candidate";
};

export const getCandidateEmail = (record) => {
  if (!record) return "";
  return record.studentEmail || record.user?.email || record.email || "";
};

export const normalizeAttemptItem = (item) => {
  if (!item) return item;
  const studentName = getCandidateName(item);
  const studentEmail = getCandidateEmail(item);
  return {
    ...item,
    studentName,
    studentEmail,
    instituteName: item.user?.institute?.name || item.instituteName || "",
    assessmentTitle: item.assessment?.title || item.assessmentTitle || "Career Compass Standard Assessment",
    hollandCode: item.result?.hollandCode || item.hollandCode || "",
    topClusterName: item.result?.topCareerCluster || item.topClusterName || "",
    fitScore: item.result?.topCareerMatch ?? item.fitScore ?? 0,
    status: item.status || (item.completedAt ? "completed" : "in_progress"),
  };
};

export default function StudentAttemptsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryAssessmentId = searchParams.get("assessmentId");

  const [messageApi, contextHolder] = message.useMessage();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const { current: currentPage, pageSize: currentPageSize } = pagination;

  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [answerSection, setAnswerSection] = useState("all");

  const loadAttempts = () => setRefreshKey((key) => key + 1);

  // Load Attempts (server-side search, status filter and pagination)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getStudentAttempts({
          assessmentId: queryAssessmentId || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: debouncedSearch || undefined,
          page: currentPage,
          limit: currentPageSize,
        });
        if (cancelled) return;

        let list = [];
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.attempts)) list = res.attempts;

        // Show exactly what the server returned. Never substitute sample students.
        setAttempts(list.map(normalizeAttemptItem));
        const serverTotal = Number(res?.pagination?.total);
        setTotal(Number.isFinite(serverTotal) ? serverTotal : list.length);
      } catch (err) {
        if (cancelled) return;
        console.warn("Could not load attempts:", err);
        setAttempts([]);
        setTotal(0);
        messageApi.error(getApiErrorMessage(err, "Failed to load student attempts."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, queryAssessmentId, debouncedSearch, currentPage, currentPageSize, refreshKey]);

  // Open Attempt Details Drawer
  const handleOpenAudit = async (record) => {
    setSelectedAttempt(normalizeAttemptItem(record));
    setAnswerSection("all");
    setDrawerOpen(true);
    try {
      setDrawerLoading(true);
      const details = await getAttemptDetails(record.id);
      if (details?.data) {
        setSelectedAttempt(normalizeAttemptItem(details.data));
      }
    } catch (err) {
      console.warn("Could not load attempt details:", err);
      messageApi.warning(
        getApiErrorMessage(err, "Could not load full attempt details. Showing list data only.")
      );
    } finally {
      setDrawerLoading(false);
    }
  };

  // Read-only list of what the candidate answered (built from the attempt's answers)
  const answerAudit = useMemo(() => buildAttemptAnswerRows(selectedAttempt), [selectedAttempt]);

  // Section dropdown (with "answered/total" per section) and the rows for the chosen section
  const answerSectionOptions = useMemo(() => {
    const bySection = new Map();
    answerAudit.rows.forEach((r) => {
      const s = bySection.get(r.sectionTitle) || { total: 0, answered: 0 };
      s.total += 1;
      if (r.answered) s.answered += 1;
      bySection.set(r.sectionTitle, s);
    });
    return [...bySection.entries()].map(([title, s]) => ({
      value: title,
      label: `${title} (${s.answered}/${s.total})`,
    }));
  }, [answerAudit]);

  const visibleAnswerRows = useMemo(
    () =>
      answerSection === "all"
        ? answerAudit.rows
        : answerAudit.rows.filter((r) => r.sectionTitle === answerSection),
    [answerAudit, answerSection]
  );

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      width: 60,
      render: (_, __, index) => getSerialNumber(index, pagination),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Student Candidate</span>,
      key: "student",
      render: (_, record) => {
        const name = record.studentName || getCandidateName(record);
        const email = record.studentEmail || getCandidateEmail(record);
        const initial = name?.charAt(0)?.toUpperCase() || "C";
        const isCompleted = record.status === "completed";

        return (
          <div className="flex items-center gap-3">
            <Avatar
              style={{ backgroundColor: "#9a2119" }}
              size={38}
              className="font-bold flex-shrink-0"
            >
              {initial}
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">{name}</span>
             
              </div>
              <div className="text-xs text-gray-400 font-mono">
                {email}
              </div>
              {record.instituteName && (
                <div className="text-[11px] text-gray-500 mt-0.5 font-sans">
                  {record.instituteName}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
   
    {
      title: <span className="text-[#9a2119] font-semibold">Actions</span>,
      key: "actions",
      fixed: "right",
      width: 270,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tooltip title="View questions & answers">
            <Button
              aria-label="View questions and answers"
              icon={<EyeOutlined style={{ fontSize: "16px" }} />}
              onClick={() => handleOpenAudit(record)}
              style={{ height: "32px", width: "36px", borderRadius: "6px" }}
              className="!text-[#9a2119] !border-[#9a2119] hover:!bg-rose-50 cursor-pointer"
            />
          </Tooltip>

          <Button
            type="primary"
            size="small"
            icon={<FilePdfOutlined style={{ color: "#ffffff", fontSize: "14px" }} />}
            onClick={() => navigate(`/admin/psychometric-attempts/${record.id}/report`)}
            style={{
              backgroundColor: "#9a2119",
              borderColor: "#9a2119",
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              height: "32px",
              padding: "0 14px",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "12px",
            }}
            className="!bg-[#9a2119] hover:!bg-[#72120F] !text-white !border-[#9a2119] cursor-pointer shadow-sm"
          >
            <span style={{ color: "#ffffff", fontWeight: 600 }}>Report (31-Page)</span>
          </Button>

        
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {contextHolder}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#9a2119] tracking-tight">
            Candidate Test Attempts & Psychometric Audit
          </h1>
         
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => loadAttempts()}
            icon={<ReloadOutlined />}
            className="border-gray-300 text-gray-700 hover:border-[#9a2119] hover:text-[#9a2119]"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        
          <Input
            placeholder="Search candidate name, email, RIASEC..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((p) => ({ ...p, current: 1 }));
            }}
            allowClear
            className="h-9 w-full sm:w-72 rounded-lg border-gray-300 hover:border-[#9a2119]"
          />
          <Select
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPagination((p) => ({ ...p, current: 1 }));
            }}
            style={{ width: 170 }}
            options={[
              { value: "all", label: "All Status" },
              { value: "completed", label: "Completed" },
              { value: "in_progress", label: "In Progress" },
            ]}
          />
        </div>

        {/* Attempts Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={attempts}
          loading={loading}
          pagination={{ current: currentPage, pageSize: currentPageSize, total, showSizeChanger: true }}
          onChange={(pag) => setPagination({ current: pag.current, pageSize: pag.pageSize })}
          scroll={{ x: 1000 }}
          className="custom-table"
        />
      </div>

      {/* Candidate Audit & Scoring Details Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-3">
              <Avatar
                size={40}
                style={{ backgroundColor: "#9a2119" }}
                icon={<UserOutlined />}
              >
                {selectedAttempt?.studentName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div className="text-base font-bold text-gray-900">
                {selectedAttempt?.studentName} — Psychometric Report
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                onClick={() => navigate(`/admin/psychometric-attempts/${selectedAttempt?.id}/report`)}
                className="font-semibold bg-[#8C1814] border-[#8C1814] hover:bg-[#72120F]"
              >
                View 31-Page Report
              </Button>
            </div>
          </div>
        }
        width={860}
        destroyOnClose
      >
        <Spin spinning={drawerLoading}>
          {selectedAttempt && (
            <div className="space-y-4">
              {/* Read-only answers: summary + section filter */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-700">
                  <span>
                    Answered:{" "}
                    <b>
                      {answerAudit.summary.answered} of {answerAudit.summary.total}
                    </b>
                  </span>
                  <span className="text-gray-400">View only</span>
                </div>
                <Select
                  value={answerSection}
                  onChange={setAnswerSection}
                  style={{ width: 340, maxWidth: "100%" }}
                  options={[
                    { value: "all", label: `All sections (${answerAudit.summary.total})` },
                    ...answerSectionOptions,
                  ]}
                />
              </div>

              <Table
                rowKey="key"
                size="small"
                pagination={{
                  pageSize: 20,
                  showSizeChanger: true,
                  pageSizeOptions: [20, 50, 100, 200],
                  hideOnSinglePage: true,
                }}
                dataSource={visibleAnswerRows}
                locale={{
                  emptyText: drawerLoading ? "Loading answers…" : "No answers recorded for this attempt.",
                }}
                columns={[
                  {
                    title: <span className="text-[#9a2119] font-semibold text-xs">#</span>,
                    dataIndex: "no",
                    width: 50,
                    render: (n) => <span className="text-xs text-gray-500">{n}</span>,
                  },
                  {
                    title: <span className="text-[#9a2119] font-semibold text-xs">Question</span>,
                    dataIndex: "prompt",
                    render: (text, rec) => (
                      <div>
                        <span className="text-xs text-gray-800">{text}</span>
                        <div className="text-[10px] text-gray-400">
                          {rec.sectionTitle} · <span className="font-mono">{rec.itemId}</span>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: <span className="text-[#9a2119] font-semibold text-xs">Candidate's Answer</span>,
                    key: "selected",
                    width: 200,
                    render: (_, rec) =>
                      rec.answered ? (
                        <span className="text-xs font-semibold text-gray-900">{rec.selected}</span>
                      ) : (
                        <span className="text-xs italic text-gray-400">Not answered</span>
                      ),
                  },
                ]}
              />
            </div>
          )}
        </Spin>
      </Drawer>
    </div>
  );
}
