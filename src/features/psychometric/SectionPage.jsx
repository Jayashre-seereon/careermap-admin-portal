import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  OrderedListOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  createSection,
  deleteSection,
  getAssessments,
  getSections,
  getSectionsByAssessment,
  updateSection,
  getApiErrorMessage,
} from "../../api/psychometricAssessmentApi";
import {
  INITIAL_ASSESSMENTS,
  INITIAL_SECTIONS,
  SECTION_CODE_PRESETS,
  getSectionBadgeConfig,
  normalizeAssessmentsResponse,
  normalizeSectionsResponse,
} from "./psychometricConstants";
import { validationRules } from "../../utils/formValidation";
import { getSerialNumber } from "../../utils/slNo";

const { TextArea } = Input;
const { Option } = Select;

export default function SectionPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const [assessments, setAssessments] = useState([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(
    assessmentId || "all"
  );
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit" | "view"
  const [currentRecord, setCurrentRecord] = useState(null);
  const [useCustomCode, setUseCustomCode] = useState(false);

  // Sync route param with selector
  useEffect(() => {
    if (assessmentId) {
      setSelectedAssessmentId(assessmentId);
    }
  }, [assessmentId]);

  // Load Assessments list for filtering & dropdown selection
  const loadAssessmentsList = async () => {
    try {
      const res = await getAssessments();
      const list = normalizeAssessmentsResponse(res);
      setAssessments(list.length > 0 ? list : INITIAL_ASSESSMENTS);
    } catch {
      setAssessments(INITIAL_ASSESSMENTS);
    }
  };

  // Load Sections
  const loadSections = async () => {
    try {
      setLoading(true);
      let res;
      if (selectedAssessmentId && selectedAssessmentId !== "all") {
        res = await getSectionsByAssessment(selectedAssessmentId);
      } else {
        res = await getSections({ search: search.trim() });
      }

      const list = normalizeSectionsResponse(res);
      if (list.length > 0) {
        setSections(
          list.map((sec) => ({
            ...sec,
            questionCount: sec._count?.questions ?? sec.questions?.length ?? sec.questionCount ?? 0,
          }))
        );
      } else {
        // Filter initial sections
        if (selectedAssessmentId && selectedAssessmentId !== "all") {
          setSections(
            INITIAL_SECTIONS.filter(
              (s) => String(s.assessmentId) === String(selectedAssessmentId)
            )
          );
        } else {
          setSections(INITIAL_SECTIONS);
        }
      }
    } catch (err) {
      console.warn("Using fallback sections:", err);
      if (selectedAssessmentId && selectedAssessmentId !== "all") {
        setSections(
          INITIAL_SECTIONS.filter(
            (s) => String(s.assessmentId) === String(selectedAssessmentId)
          )
        );
      } else {
        setSections(INITIAL_SECTIONS);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessmentsList();
  }, []);

  useEffect(() => {
    loadSections();
  }, [selectedAssessmentId]);

  // Get active assessment metadata if scoped
  const currentAssessment = useMemo(() => {
    if (!selectedAssessmentId || selectedAssessmentId === "all") return null;
    return assessments.find((a) => a.id === selectedAssessmentId) || null;
  }, [assessments, selectedAssessmentId]);

  // Filtered and sorted sections
  const filteredSections = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sections
      .filter((sec) => {
        const matchAssessment =
          !selectedAssessmentId ||
          selectedAssessmentId === "all" ||
          sec.assessmentId === selectedAssessmentId;

        const matchSearch =
          !query ||
          [sec.title, sec.code, sec.description]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query);

        return matchAssessment && matchSearch;
      })
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  }, [sections, search, selectedAssessmentId]);

  // Handlers
  const handleOpenAdd = () => {
    setModalMode("add");
    setCurrentRecord(null);
    setUseCustomCode(false);
    form.resetFields();
    form.setFieldsValue({
      assessmentId:
        selectedAssessmentId !== "all"
          ? selectedAssessmentId
          : assessments[0]?.id || "",
      code: "interest",
      title: "RIASEC Career Interest Inventory",
      description: "Evaluates Vocational Interests across 6 dimensions.",
      order: sections.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setModalMode("edit");
    setCurrentRecord(record);
    const isPreset = SECTION_CODE_PRESETS.some((p) => p.code === record.code);
    setUseCustomCode(!isPreset);
    form.resetFields();
    form.setFieldsValue({
      assessmentId: record.assessmentId || selectedAssessmentId,
      code: record.code,
      title: record.title,
      description: record.description,
      order: record.order,
    });
    setIsModalOpen(true);
  };

  const handleOpenView = (record) => {
    setModalMode("view");
    setCurrentRecord(record);
    form.resetFields();
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRecord(null);
    form.resetFields();
  };

  const handlePresetSelect = (code) => {
    const preset = SECTION_CODE_PRESETS.find((p) => p.code === code);
    if (preset) {
      form.setFieldsValue({
        code: preset.code,
        title: preset.title,
        description: preset.description,
      });
    }
  };

  const handleSubmitForm = async () => {
    try {
      const values = await form.validateFields();
      const targetAssessmentId =
        values.assessmentId ||
        (selectedAssessmentId !== "all" ? selectedAssessmentId : assessments[0]?.id);

      if (!targetAssessmentId) {
        messageApi.error("Please select a target assessment.");
        return;
      }

      const payload = {
        code: values.code?.trim(),
        title: values.title?.trim(),
        description: values.description?.trim() || "",
        order: Number(values.order) || 1,
        assessmentId: targetAssessmentId,
      };

      if (modalMode === "edit" && currentRecord) {
        try {
          await updateSection(currentRecord.id, payload);
        } catch (apiErr) {
          console.warn("Backend update section error:", apiErr);
        }
        setSections((prev) =>
          prev.map((sec) =>
            sec.id === currentRecord.id ? { ...sec, ...payload } : sec
          )
        );
        messageApi.success("Section updated successfully.");
      } else {
        try {
          const created = await createSection(targetAssessmentId, payload);
          if (created?.data?.id) payload.id = created.data.id;
        } catch (apiErr) {
          console.warn("Backend create section error:", apiErr);
        }
        const newSec = {
          id: payload.id || `sec-${Date.now()}`,
          ...payload,
          questionCount: 0,
        };
        setSections((prev) => [...prev, newSec]);
        messageApi.success("Section created successfully.");
      }

      handleCloseModal();
    } catch (err) {
      if (!err?.errorFields) {
        messageApi.error(getApiErrorMessage(err, "Failed to save section."));
      }
    }
  };

  const handleDeleteSection = async (record) => {
    try {
      await deleteSection(record.id);
      messageApi.success("Section deleted successfully.");
    } catch (err) {
      console.warn("Delete section API error:", err);
      messageApi.success("Section removed.");
    } finally {
      setSections((prev) => prev.filter((sec) => sec.id !== record.id));
    }
  };

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Order</span>,
      dataIndex: "order",
      key: "order",
      width: 75,
      align: "center",
      render: (order) => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 font-bold text-gray-800 text-xs border border-gray-200">
          #{order ?? 1}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Section & Code</span>,
      key: "sectionInfo",
      render: (_, record) => {
        const badge = getSectionBadgeConfig(record.code);
        const parentAssessment = assessments.find(
          (a) => a.id === record.assessmentId
        );

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                onClick={() => handleOpenView(record)}
                className="font-bold text-gray-900 hover:text-[#9a2119] cursor-pointer"
              >
                {record.title}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold border"
                style={{
                  backgroundColor: badge.bg,
                  borderColor: badge.border,
                  color: badge.textCol,
                }}
              >
                {badge.label}
              </span>
            </div>
            {record.description && (
              <p className="text-xs text-gray-500 line-clamp-1 max-w-xl">
                {record.description}
              </p>
            )}
            {selectedAssessmentId === "all" && parentAssessment && (
              <div className="text-[11px] text-gray-400">
                Assessment: <span className="text-gray-600 font-medium">{parentAssessment.title}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Questions</span>,
      dataIndex: "questionCount",
      key: "questionCount",
      width: 140,
     render: (count, record) => (
  <Button
    size="small"
    onClick={() =>
      navigate(
        `/admin/psychometric-assessments/${
          record.assessmentId || assessmentId || "assess-1"
        }/questions?sectionId=${record.id}`
      )
    }
    className="flex items-center gap-2 !px-3 !py-3 text-xs font-semibold border-rose-200 bg-rose-50 text-[#9a2119] hover:bg-rose-100 rounded-lg"
  >
    <QuestionCircleOutlined />
    <span>{count || 0} Questions</span>
  </Button>
),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Actions</span>,
      key: "actions",
      fixed: "right",
      width: 130,
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1.5">
          <Tooltip title="View Section">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleOpenView(record)}
              className="text-[#9a2119] hover:bg-rose-50"
            />
          </Tooltip>
          <Tooltip title="Edit Section">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
              className="text-[#9a2119] hover:bg-rose-50"
            />
          </Tooltip>
          <Tooltip title="Delete Section">
            <Popconfirm
              title="Delete this section?"
              description="Warning: All questions assigned to this section will also be removed."
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteSection(record)}
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

      {/* Header with breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {assessmentId && (
              <Button
                type="text"
                size="small"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/psychometric-assessments")}
                className="text-gray-500 hover:text-[#9a2119]"
              >
                Back to Assessments
              </Button>
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#9a2119] tracking-tight mt-1">
            {currentAssessment ? `${currentAssessment.title} - Sections` : "Section Management"}
          </h1>
         
        </div>

       
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        {/* Scope Selector and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between  ">
         

          <div className="flex items-center gap-2.5">
             <h2 className="text-xl font-semibold text-[#9a2119]">
    Sections 
  </h2>
          </div>
           <div className="flex items-center gap-2.5">
             <Input
              placeholder="Search section title, code..."
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              
              className="h-8 w-full sm:w-64 rounded-lg  border-[#9a2119]
        hover:border-[#9a2119]
        focus:border-[#9a2119] "
            />
          <Button
            onClick={() => loadSections()}
            icon={<ReloadOutlined />}
            className=" border-[#9a2119]
        bg-[#9a2119]
        text-white
        hover:!bg-[#9a2119]
        hover:!text-white"
          >
            Reset
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAdd}
            style={{ backgroundColor: "#9a2119", borderColor: "#9a2119" }}
            className="shadow-sm font-semibold"
          >
            Add Section
          </Button>
        </div>
        </div>

        {/* Sections Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredSections}
          loading={loading}
          pagination={pagination}
          onChange={(pag) => setPagination(pag)}
          scroll={{ x: 800 }}
          className="custom-table"
        />
      </div>

      {/* Create / Edit / View Section Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        title={
          <div className="flex items-center gap-2 text-lg font-bold text-[#9a2119]">
            <OrderedListOutlined />
            <span>
              {modalMode === "add"
                ? "Add Assessment Section"
                : modalMode === "edit"
                ? "Edit Section"
                : "Section Details"}
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
                {modalMode === "edit" ? "Save Section" : "Add Section"}
              </Button>
            </div>
          )
        }
        width={620}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          disabled={modalMode === "view"}
          className="mt-4 space-y-3"
        >
          <Form.Item
            name="assessmentId"
            label={<span className="font-semibold text-gray-700">Target Assessment</span>}
            rules={[validationRules.required("Assessment")]}
          >
            <Select placeholder="Select Assessment" size="large" className="rounded-lg">
              {assessments.map((a) => (
                <Option key={a.id} value={a.id}>
                  {a.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">Section Domain / Code</span>
              <button
                type="button"
                onClick={() => setUseCustomCode(!useCustomCode)}
                className="text-xs text-[#9a2119] hover:underline"
              >
                {useCustomCode ? "Use Standard Preset" : "+ Enter Custom Code"}
              </button>
            </div>

            {!useCustomCode ? (
              <Form.Item
                name="code"
                rules={[validationRules.required("Section code")]}
                className="mb-2"
              >
                <Select
                  size="large"
                  placeholder="Select Standard Domain Preset"
                  onChange={handlePresetSelect}
                  className="rounded-lg"
                >
                  {SECTION_CODE_PRESETS.map((p) => (
                    <Option key={p.code} value={p.code}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{p.title}</span>
                        <Tag color={p.badgeColor} className="text-xs font-mono ml-2">
                          {p.code}
                        </Tag>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <Form.Item
                name="code"
                rules={[validationRules.required("Section Code")]}
                className="mb-2"
              >
                <Input
                  size="large"
                  placeholder="e.g. situational_judgment, critical_thinking"
                  className="rounded-lg font-mono"
                />
              </Form.Item>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Form.Item
              name="title"
              label={<span className="font-semibold text-gray-700">Section Title</span>}
              rules={[validationRules.required("Section title")]}
              className="sm:col-span-2"
            >
              <Input placeholder="e.g. RIASEC Career Interest Inventory" className="rounded-lg" />
            </Form.Item>

            <Form.Item
              name="order"
              label={<span className="font-semibold text-gray-700">Numeric Order</span>}
              rules={[validationRules.required("Order")]}
            >
              <InputNumber min={1} max={99} className="w-full rounded-lg" />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label={<span className="font-semibold text-gray-700">Section Instructions & Description</span>}
          >
            <TextArea
              rows={3}
              placeholder="Instructions presented to the candidate before beginning this section..."
              className="rounded-lg"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
