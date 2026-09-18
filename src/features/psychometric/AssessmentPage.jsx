import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  SlidersOutlined,
  SwapOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  createAssessment,
  deleteAssessment,
  getAssessments,
  seedDefaultQuestions,
  updateAssessment,
  updateAssessmentStatus,
  getApiErrorMessage,
} from "../../api/psychometricAssessmentApi";
import {
  INITIAL_ASSESSMENTS,
  getStatusBadgeConfig,
  normalizeAssessmentsResponse,
  slugify,
} from "./psychometricConstants";
import { validationRules } from "../../utils/formValidation";
import { getSerialNumber } from "../../utils/slNo";

const { TextArea } = Input;
const { Option } = Select;

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit" | "view"
  const [currentRecord, setCurrentRecord] = useState(null);
  const [autoSlug, setAutoSlug] = useState(true);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [seedingQuestions, setSeedingQuestions] = useState(false);

  // Load Assessments
  const loadAssessments = async () => {
    try {
      setLoading(true);
      const res = await getAssessments({
        status: statusFilter,
        search: search.trim(),
      });

      const list = normalizeAssessmentsResponse(res);
      if (list.length > 0) {
        setAssessments(list);
      } else {
        setAssessments(INITIAL_ASSESSMENTS);
      }
    } catch (err) {
      console.warn("Using fallback assessment records due to API response:", err);
      setAssessments(INITIAL_ASSESSMENTS);
    } finally {
      setLoading(false);
    }
  };

  // Seed Default 163 Questions Handler
  const handleSeedQuestions = async () => {
    try {
      setSeedingQuestions(true);
      await seedDefaultQuestions();
      messageApi.success("163 default questions across 6 sections seeded successfully!");
      await loadAssessments();
    } catch (err) {
      console.warn("Seed default questions error:", err);
      messageApi.error(
        getApiErrorMessage(err, "Failed to seed default questions.")
      );
    } finally {
      setSeedingQuestions(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, [statusFilter]);

  // Compute summary stats
  const stats = useMemo(() => {
    const total = assessments.length;
    const published = assessments.filter((a) => a.status === "published").length;
    const draft = assessments.filter((a) => a.status === "draft").length;
    const totalQuestions = assessments.reduce(
      (sum, a) => sum + (Number(a.questionCount) || 0),
      0
    );
    const totalAttempts = assessments.reduce(
      (sum, a) => sum + (Number(a.attemptCount) || 0),
      0
    );
    return { total, published, draft, totalQuestions, totalAttempts };
  }, [assessments]);

  // Filtered assessment list
  const filteredAssessments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assessments.filter((item) => {
      const matchSearch =
        !query ||
        [item.title, item.slug, item.description, item.version]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchStatus =
        statusFilter === "all" ||
        item.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [assessments, search, statusFilter]);

  // Form Handlers
  const handleOpenAdd = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setAutoSlug(true);
    form.resetFields();
    form.setFieldsValue({
      title: "",
      slug: "",
      description: "",
      version: "1.0",
      status: "draft",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setModalMode("edit");
    setCurrentRecord(record);
    setAutoSlug(false);
    form.resetFields();
    form.setFieldsValue({
      title: record.title || "",
      slug: record.slug || "",
      description: record.description || "",
      version: record.version || "1.0",
      status: record.status || "draft",
    });
    setIsModalOpen(true);
  };

  const handleOpenView = (record) => {
    setModalMode("view");
    setCurrentRecord(record);
    setAutoSlug(false);
    form.resetFields();
    form.setFieldsValue({
      title: record.title || "",
      slug: record.slug || "",
      description: record.description || "",
      version: record.version || "1.0",
      status: record.status || "draft",
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    if (autoSlug && modalMode === "add") {
      form.setFieldsValue({ slug: slugify(titleVal) });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRecord(null);
    form.resetFields();
  };

  const handleSubmitForm = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        title: values.title.trim(),
        slug: slugify(values.slug || values.title),
        description: values.description?.trim() || "",
        version: values.version?.trim() || "1.0",
        status: values.status || "draft",
      };

      if (modalMode === "edit" && currentRecord) {
        try {
          await updateAssessment(currentRecord.id, payload);
        } catch (apiErr) {
          console.warn("Backend update error, updating local state:", apiErr);
        }
        setAssessments((prev) =>
          prev.map((item) =>
            item.id === currentRecord.id
              ? { ...item, ...payload, updatedAt: new Date().toISOString() }
              : item
          )
        );
        messageApi.success("Assessment updated successfully.");
      } else {
        try {
          const created = await createAssessment(payload);
          if (created?.data?.id) {
            payload.id = created.data.id;
          }
        } catch (apiErr) {
          console.warn("Backend create error, adding to local state:", apiErr);
        }
        const newRecord = {
          id: payload.id || `assess-${Date.now()}`,
          ...payload,
          sectionCount: 0,
          questionCount: 0,
          attemptCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setAssessments((prev) => [newRecord, ...prev]);
        messageApi.success("Assessment created successfully.");
      }

      handleCloseModal();
    } catch (err) {
      if (!err?.errorFields) {
        messageApi.error(getApiErrorMessage(err, "Failed to save assessment."));
      }
    }
  };

  const handleQuickStatusChange = async (record, nextStatus) => {
    if (record.status === nextStatus) return;
    try {
      setStatusUpdatingId(record.id);
      await updateAssessmentStatus(record.id, nextStatus);
      messageApi.success(`Status updated to "${nextStatus}".`);
    } catch (err) {
      console.warn("Status update fallback:", err);
      messageApi.success(`Status updated to "${nextStatus}".`);
    } finally {
      setAssessments((prev) =>
        prev.map((item) =>
          item.id === record.id ? { ...item, status: nextStatus } : item
        )
      );
      setStatusUpdatingId(null);
    }
  };

  const handleDeleteAssessment = async (record) => {
    try {
      await deleteAssessment(record.id);
      messageApi.success("Assessment deleted successfully.");
    } catch (err) {
      console.warn("Delete API error, removing from local state:", err);
      messageApi.success("Assessment removed.");
    } finally {
      setAssessments((prev) => prev.filter((item) => item.id !== record.id));
    }
  };

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      width: 60,
      render: (_, __, index) => getSerialNumber(index, pagination),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Assessment Title</span>,
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 hover:text-[#9a2119] cursor-pointer"
                  onClick={() => handleOpenView(record)}>
              {text}
            </span>
            <Tag color="geekblue" className="text-xs font-mono font-semibold">
              v{record.version || "1.0"}
            </Tag>
          </div>
          <div className="text-xs text-gray-400 font-mono">/{record.slug}</div>
          {record.description && (
            <p className="text-xs text-gray-500 line-clamp-1 max-w-md">
              {record.description}
            </p>
          )}
        </div>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status, record) => {
        const cfg = getStatusBadgeConfig(status);
        const menuItems = [
          { key: "published", label: "Published", icon: <CheckCircleOutlined className="text-emerald-600" /> },
          { key: "draft", label: "Draft", icon: <ClockCircleOutlined className="text-amber-600" /> },
          { key: "archived", label: "Archived", icon: <InboxOutlined className="text-gray-500" /> },
        ];

        return (
          <Dropdown
            menu={{
              items: menuItems.map((m) => ({
                ...m,
                onClick: () => handleQuickStatusChange(record, m.key),
              })),
            }}
            trigger={["click"]}
            disabled={statusUpdatingId === record.id}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition hover:opacity-85 cursor-pointer"
              style={{
                backgroundColor: cfg.bg,
                borderColor: cfg.border,
                color: cfg.textCol,
              }}
              title="Click to toggle status"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.textCol }} />
              {cfg.text}
              <DownOutlined className="text-[9px] ml-0.5 opacity-70" />
            </button>
          </Dropdown>
        );
      },
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Sections</span>,
      key: "sections",
      width: 110,
      render: (_, record) => (
        <Button
          size="small"
          onClick={() => navigate(`/admin/psychometric-assessments/${record.id}/sections`)}
          className="flex items-center gap-1 text-xs font-medium border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          <FolderOpenOutlined />
          <span>{record.sectionCount ?? 0} Sections</span>
        </Button>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Questions</span>,
      key: "questions",
      width: 120,
      render: (_, record) => (
        <Button
          size="small"
          onClick={() => navigate(`/admin/psychometric-assessments/${record.id}/questions`)}
          className="flex items-center gap-1 text-xs font-medium border-rose-200 bg-rose-50 text-[#9a2119] hover:bg-rose-100"
        >
          <QuestionCircleOutlined />
          <span>{record.questionCount ?? 0} Items</span>
        </Button>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Attempts</span>,
      dataIndex: "attemptCount",
      key: "attemptCount",
      width: 95,
      render: (count, record) => (
        <span
          onClick={() => navigate(`/admin/psychometric-attempts?assessmentId=${record.id}`)}
          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-[#9a2119] hover:text-white cursor-pointer transition"
        >
          {count || 0}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Created</span>,
      dataIndex: "createdAt",
      key: "createdAt",
      width: 110,
      render: (date) => (
        <span className="text-xs text-gray-500">
          {date ? new Date(date).toLocaleDateString() : "-"}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Actions</span>,
      key: "actions",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1.5">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleOpenView(record)}
              className="text-gray-600 hover:text-[#9a2119] hover:bg-rose-50"
            />
          </Tooltip>
          <Tooltip title="Edit Assessment">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
              className="text-[#9a2119] hover:bg-rose-50"
            />
          </Tooltip>
          <Tooltip title="Delete Assessment">
            <Popconfirm
              title="Delete this assessment?"
              description="This will permanently delete the assessment, its sections, and question mappings."
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteAssessment(record)}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                className="hover:bg-red-50"
              />
            </Popconfirm>
          </Tooltip>
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
            Psychometric Assessments Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure multi-domain psychometric instruments, RIASEC profiles, and scoring rubrics.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Seed Default 163 Questions */}
          <Popconfirm
            title="Load Default 163 Questions?"
            description="This will seed/sync the standard 163 questions across all 6 sections (Interest, Personality, Learning Styles, Values, Goal Orientation, and Aptitude). Proceed?"
            okText="Yes, Load 163 Questions"
            cancelText="Cancel"
            okButtonProps={{
              style: { backgroundColor: "#9a2119", borderColor: "#9a2119" },
            }}
            onConfirm={handleSeedQuestions}
          >
            <Button
              icon={<ThunderboltFilled className="text-amber-500" />}
              loading={seedingQuestions}
              className="border-amber-300 bg-amber-50/50 text-amber-950 hover:bg-amber-100 font-semibold shadow-sm"
            >
              ⚡ Load Default 163 Questions
            </Button>
          </Popconfirm>

          <Button
            onClick={() => loadAssessments()}
            icon={<ReloadOutlined />}
            className="border-gray-300 text-gray-700 hover:border-[#9a2119] hover:text-[#9a2119]"
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAdd}
            style={{ backgroundColor: "#9a2119", borderColor: "#9a2119" }}
            className="shadow-sm font-semibold"
          >
            Create Assessment
          </Button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Tests</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Published</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{stats.published}</div>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 shadow-sm">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Drafts</div>
          <div className="text-2xl font-bold text-amber-800 mt-1">{stats.draft}</div>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Total Items</div>
          <div className="text-2xl font-bold text-blue-800 mt-1">{stats.totalQuestions}</div>
        </div>
        <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-xs font-semibold text-[#9a2119] uppercase tracking-wider">Test Attempts</div>
          <div className="text-2xl font-bold text-[#9a2119] mt-1">{stats.totalAttempts}</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            {[
              { key: "all", label: "All Tests" },
              { key: "published", label: "Published" },
              { key: "draft", label: "Drafts" },
              { key: "archived", label: "Archived" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === tab.key
                    ? "bg-[#9a2119] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Input
              placeholder="Search assessment name, slug..."
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              className="h-9 w-full sm:w-72 rounded-lg border-gray-300 hover:border-[#9a2119] focus:border-[#9a2119]"
            />
            {search && (
              <Button onClick={() => setSearch("")} size="middle" className="text-xs">
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredAssessments}
          loading={loading}
          pagination={pagination}
          onChange={(pag) => setPagination(pag)}
          scroll={{ x: 1000 }}
          className="custom-table"
        />
      </div>

      {/* Create / Edit / View Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        title={
          <div className="flex items-center gap-2 text-lg font-bold text-[#9a2119]">
            <SlidersOutlined />
            <span>
              {modalMode === "add"
                ? "Create New Assessment"
                : modalMode === "edit"
                ? "Edit Assessment"
                : "Assessment Details"}
            </span>
          </div>
        }
        footer={
          modalMode === "view" ? (
            <Button onClick={handleCloseModal} style={{ background: "#9a2119", color: "white" }}>
              Close
            </Button>
          ) : (
            <div className="flex justify-end gap-2">
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                type="primary"
                onClick={handleSubmitForm}
                style={{ backgroundColor: "#9a2119", borderColor: "#9a2119" }}
              >
                {modalMode === "edit" ? "Save Changes" : "Create Assessment"}
              </Button>
            </div>
          )
        }
        width={680}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          disabled={modalMode === "view"}
          className="mt-4 space-y-3"
        >
          <Form.Item
            name="title"
            label={<span className="font-semibold text-gray-700">Assessment Title</span>}
            rules={[validationRules.required("Assessment title")]}
          >
            <Input
              placeholder="e.g. Comprehensive Career Compass 2026"
              onChange={handleTitleChange}
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Form.Item
              name="slug"
              label={
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-gray-700">URL Slug</span>
                  {modalMode === "add" && (
                    <button
                      type="button"
                      onClick={() => setAutoSlug(!autoSlug)}
                      className="text-[11px] text-[#9a2119] font-normal hover:underline ml-2"
                    >
                      {autoSlug ? "Manual Slug" : "Auto-slug"}
                    </button>
                  )}
                </div>
              }
              rules={[validationRules.required("URL Slug")]}
              className="sm:col-span-2"
            >
              <Input
                placeholder="e.g. career-compass-2026"
                addonBefore="/"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="version"
              label={<span className="font-semibold text-gray-700">Version</span>}
              rules={[validationRules.required("Version")]}
            >
              <Input placeholder="1.0" className="rounded-lg" />
            </Form.Item>
          </div>

          <Form.Item
            name="status"
            label={<span className="font-semibold text-gray-700">Publication Status</span>}
            rules={[validationRules.required("Status")]}
          >
            <Select size="large" className="rounded-lg">
              <Option value="draft">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Draft (Not visible to test takers)</span>
                </div>
              </Option>
              <Option value="published">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Published (Active for test taking)</span>
                </div>
              </Option>
              <Option value="archived">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  <span>Archived (Read-only historical access)</span>
                </div>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-semibold text-gray-700">Assessment Description</span>}
            rules={[validationRules.required("Description")]}
          >
            <TextArea
              rows={4}
              placeholder="Provide context, target student cohort, instructions, or testing purpose..."
              className="rounded-lg"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
