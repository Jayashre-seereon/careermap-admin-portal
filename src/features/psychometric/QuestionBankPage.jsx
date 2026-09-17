import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileImageOutlined,
  FilterOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getAssessments,
  getSections,
  seedDefaultQuestions,
  updateQuestion,
  getApiErrorMessage,
} from "../../api/psychometricAssessmentApi";
import {
  ALL_FACETS,
  FACET_GROUPS,
  FACET_MAP,
  INITIAL_ASSESSMENTS,
  INITIAL_QUESTIONS,
  INITIAL_SECTIONS,
  LIKERT5_OPTIONS,
  SECTION_FACETS_MAP,
  generateItemId,
  getFacetsForSection,
  getSectionBadgeConfig,
  normalizeAssessmentsResponse,
  normalizeQuestionsResponse,
  normalizeSectionsResponse,
} from "./psychometricConstants";
import { validationRules } from "../../utils/formValidation";
import { getSerialNumber } from "../../utils/slNo";

const { TextArea } = Input;
const { Option, OptGroup } = Select;

export default function QuestionBankPage() {
  const { assessmentId, sectionId: routeSectionId } = useParams();
  const [searchParams] = useSearchParams();
  const querySectionId = searchParams.get("sectionId");
  const activeSectionId = routeSectionId || querySectionId;

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const [assessments, setAssessments] = useState([]);
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Filters
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(
    assessmentId ? String(assessmentId) : "all"
  );
  const [selectedSectionId, setSelectedSectionId] = useState(
    activeSectionId ? String(activeSectionId) : "all"
  );
  const [selectedType, setSelectedType] = useState("all");
  const [selectedFacet, setSelectedFacet] = useState("all");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit" | "view"
  const [currentRecord, setCurrentRecord] = useState(null);

  // Form Live Watchers
  const watchedSectionId = Form.useWatch("sectionId", form);
  const watchedType = Form.useWatch("type", form);
  const watchedFacet = Form.useWatch("facet", form);
  const watchedImage = Form.useWatch("image", form);

  // Dynamic Facets based on currently selected section in the form
  const dynamicFacetsForForm = useMemo(() => {
    if (!watchedSectionId) return ALL_FACETS;
    const currentSec = sections.find((s) => String(s.id) === String(watchedSectionId));
    if (!currentSec) return ALL_FACETS;
    return getFacetsForSection(currentSec.code);
  }, [watchedSectionId, sections]);

  // MCQ Options State in Modal (0-indexed options matching backend)
  const [mcqOptions, setMcqOptions] = useState([
    { optionText: "", optionIndex: 0, isCorrect: true },
    { optionText: "", optionIndex: 1, isCorrect: false },
    { optionText: "", optionIndex: 2, isCorrect: false },
    { optionText: "", optionIndex: 3, isCorrect: false },
  ]);

  // Load Metadata (Assessments & Sections)
  const loadMetadata = async () => {
    try {
      const [assessRes, secRes] = await Promise.all([
        getAssessments(),
        getSections(),
      ]);

      const normalizedAssessments = normalizeAssessmentsResponse(assessRes);
      const normalizedSections = normalizeSectionsResponse(secRes);

      const finalAssessments =
        normalizedAssessments.length > 0 ? normalizedAssessments : INITIAL_ASSESSMENTS;
      const finalSections =
        normalizedSections.length > 0 ? normalizedSections : INITIAL_SECTIONS;

      setAssessments(finalAssessments);
      setSections(finalSections);
      return { assessments: finalAssessments, sections: finalSections };
    } catch {
      setAssessments(INITIAL_ASSESSMENTS);
      setSections(INITIAL_SECTIONS);
      return { assessments: INITIAL_ASSESSMENTS, sections: INITIAL_SECTIONS };
    }
  };

  // Load Questions from /admin/questions API
  const loadQuestions = async (currentSections = sections, filterOverrides = {}) => {
    try {
      setLoading(true);

      const targetAssessmentId =
        filterOverrides.assessmentId !== undefined
          ? filterOverrides.assessmentId
          : selectedAssessmentId;
      const targetSectionId =
        filterOverrides.sectionId !== undefined
          ? filterOverrides.sectionId
          : selectedSectionId;
      const targetType =
        filterOverrides.type !== undefined ? filterOverrides.type : selectedType;
      const targetFacet =
        filterOverrides.facet !== undefined ? filterOverrides.facet : selectedFacet;
      const targetSearch =
        filterOverrides.search !== undefined ? filterOverrides.search : search;

      const params = {};
      if (targetAssessmentId && targetAssessmentId !== "all") {
        params.assessmentId = targetAssessmentId;
      }
      if (targetSectionId && targetSectionId !== "all") {
        params.sectionId = targetSectionId;
      }
      if (targetType && targetType !== "all") {
        params.type = targetType;
      }
      if (targetFacet && targetFacet !== "all") {
        params.facet = targetFacet;
      }
      if (targetSearch && targetSearch.trim()) {
        params.search = targetSearch.trim();
      }

      const res = await getAllQuestions(params);

      // Also fetch fresh sections to ensure embedded questions/metadata are up to date
      const secRes = await getSections();
      const freshSections = normalizeSectionsResponse(secRes);
      const effectiveSections =
        freshSections.length > 0 ? freshSections : currentSections;
      setSections(effectiveSections);

      const normalizedQ = normalizeQuestionsResponse(res, effectiveSections);

      if (normalizedQ.length > 0) {
        setQuestions(normalizedQ);
      } else {
        // If server returns empty for specific filters, show empty; otherwise fallback to seeded
        if (Object.keys(params).length > 0) {
          setQuestions([]);
        } else {
          // Extract embedded questions from sections
          const extracted = normalizeQuestionsResponse(null, effectiveSections);
          setQuestions(extracted.length > 0 ? extracted : INITIAL_QUESTIONS);
        }
      }
    } catch (err) {
      console.warn("Using fallback questions:", err);
      const extracted = normalizeQuestionsResponse(null, currentSections);
      setQuestions(extracted.length > 0 ? extracted : INITIAL_QUESTIONS);
    } finally {
      setLoading(false);
    }
  };

  // Seed Default 163 Questions Handler
  const handleSeedDefaults = async () => {
    try {
      setSeeding(true);
      const payload =
        selectedAssessmentId && selectedAssessmentId !== "all"
          ? { assessmentId: selectedAssessmentId }
          : {};
      await seedDefaultQuestions(payload);
      messageApi.success("163 default questions across 6 sections seeded successfully!");
      const meta = await loadMetadata();
      await loadQuestions(meta.sections);
    } catch (err) {
      console.warn("Seed default questions error:", err);
      messageApi.error(
        getApiErrorMessage(err, "Failed to seed default questions.")
      );
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    loadMetadata().then(({ sections: s }) => {
      loadQuestions(s);
    });
  }, []);

  useEffect(() => {
    if (assessmentId) setSelectedAssessmentId(String(assessmentId));
    if (activeSectionId) setSelectedSectionId(String(activeSectionId));
  }, [assessmentId, activeSectionId]);

  useEffect(() => {
    loadQuestions(sections, {
      assessmentId: selectedAssessmentId,
      sectionId: selectedSectionId,
      type: selectedType,
      facet: selectedFacet,
      search: search,
    });
  }, [selectedAssessmentId, selectedSectionId, selectedType, selectedFacet]);

  // Available sections for filtering based on selected assessment
  const availableSections = useMemo(() => {
    if (!selectedAssessmentId || selectedAssessmentId === "all") return sections;
    return sections.filter((s) => String(s.assessmentId) === String(selectedAssessmentId));
  }, [sections, selectedAssessmentId]);

  // Filtered Questions for Table display
  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return questions.filter((q) => {
      const matchAssessment =
        !selectedAssessmentId ||
        selectedAssessmentId === "all" ||
        String(q.assessmentId) === String(selectedAssessmentId);

      const matchSection =
        !selectedSectionId ||
        selectedSectionId === "all" ||
        String(q.sectionId) === String(selectedSectionId);

      const matchType =
        selectedType === "all" ||
        q.type?.toLowerCase().startsWith(selectedType.toLowerCase());

      const matchFacet =
        selectedFacet === "all" || q.facet === selectedFacet;

      const matchSearch =
        !query ||
        [q.text, q.itemId, q.note, q.facet]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchAssessment && matchSection && matchType && matchFacet && matchSearch;
    });
  }, [questions, search, selectedAssessmentId, selectedSectionId, selectedType, selectedFacet]);

  // Auto-switch facet & type when user changes section in Create Modal
  const handleSectionSelectInModal = (secId) => {
    const targetSec = sections.find((s) => String(s.id) === String(secId));
    if (!targetSec) return;

    const availableFacets = getFacetsForSection(targetSec.code);
    const defaultFacet = availableFacets[0]?.code || "R";
    const defaultType = targetSec.code === "aptitude" ? "mcq" : "likert5";
    const genItemId = generateItemId(targetSec.code, defaultFacet, questions.length + 1);

    form.setFieldsValue({
      facet: defaultFacet,
      type: defaultType,
      itemId: genItemId,
    });
  };

  // Open Create Question Modal
  const handleOpenAdd = () => {
    setModalMode("add");
    setCurrentRecord(null);

    const targetSec =
      (selectedSectionId !== "all"
        ? sections.find((s) => String(s.id) === String(selectedSectionId))
        : null) ||
      availableSections[0] ||
      sections[0];

    const availableFacets = getFacetsForSection(targetSec?.code);
    const defaultFacet = availableFacets[0]?.code || "R";
    const defaultType = targetSec?.code === "aptitude" ? "mcq" : "likert5";
    const genItemId = generateItemId(targetSec?.code || "interest", defaultFacet, questions.length + 1);

    form.resetFields();
    form.setFieldsValue({
      sectionId: targetSec ? targetSec.id : undefined,
      itemId: genItemId,
      text: "",
      type: defaultType,
      facet: defaultFacet,
      reverse: false,
      image: "",
      note: "",
      order: questions.length + 1,
    });

    setMcqOptions([
      { optionText: "", optionIndex: 0, isCorrect: true },
      { optionText: "", optionIndex: 1, isCorrect: false },
      { optionText: "", optionIndex: 2, isCorrect: false },
      { optionText: "", optionIndex: 3, isCorrect: false },
    ]);

    setIsModalOpen(true);
  };

  // Open Edit Question Modal
  const handleOpenEdit = (record) => {
    setModalMode("edit");
    setCurrentRecord(record);
    form.resetFields();
    form.setFieldsValue({
      sectionId: record.sectionId,
      itemId: record.itemId || "",
      text: record.text,
      type: record.type?.startsWith("mcq") ? "mcq" : record.type || "likert5",
      facet: record.facet || "R",
      reverse: Boolean(record.reverse),
      image: record.image || "",
      note: record.note || "",
      order: record.order || 1,
    });

    if (Array.isArray(record.options) && record.options.length > 0) {
      setMcqOptions(
        record.options.map((opt, idx) => ({
          id: opt.id,
          optionText: opt.optionText || "",
          optionIndex: opt.optionIndex ?? idx,
          isCorrect: Boolean(opt.isCorrect),
        }))
      );
    } else {
      setMcqOptions([
        { optionText: "", optionIndex: 0, isCorrect: true },
        { optionText: "", optionIndex: 1, isCorrect: false },
        { optionText: "", optionIndex: 2, isCorrect: false },
        { optionText: "", optionIndex: 3, isCorrect: false },
      ]);
    }

    setIsModalOpen(true);
  };

  const handleOpenView = (record) => {
    setModalMode("view");
    setCurrentRecord(record);
    form.resetFields();
    form.setFieldsValue(record);
    if (Array.isArray(record.options)) {
      setMcqOptions(record.options);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRecord(null);
    form.resetFields();
  };

  // MCQ Option builder controls
  const handleAddMcqOption = () => {
    if (mcqOptions.length >= 6) {
      messageApi.warning("Maximum 6 options allowed per MCQ.");
      return;
    }
    setMcqOptions((prev) => [
      ...prev,
      {
        optionText: "",
        optionIndex: prev.length,
        isCorrect: false,
      },
    ]);
  };

  const handleRemoveMcqOption = (indexToRemove) => {
    if (mcqOptions.length <= 2) {
      messageApi.warning("At least 2 options are required for an MCQ.");
      return;
    }
    const filtered = mcqOptions.filter((_, idx) => idx !== indexToRemove);
    const reindexed = filtered.map((opt, idx) => ({
      ...opt,
      optionIndex: idx,
    }));
    const hasCorrect = reindexed.some((opt) => opt.isCorrect);
    if (!hasCorrect && reindexed.length > 0) {
      reindexed[0].isCorrect = true;
    }
    setMcqOptions(reindexed);
  };

  const handleMcqTextChange = (index, value) => {
    setMcqOptions((prev) =>
      prev.map((opt, idx) =>
        idx === index ? { ...opt, optionText: value } : opt
      )
    );
  };

  const handleSetCorrectOption = (correctIndex) => {
    setMcqOptions((prev) =>
      prev.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === correctIndex,
      }))
    );
  };

  // Submit Question Creation / Update
  const handleSubmitForm = async () => {
    try {
      const values = await form.validateFields();
      const targetSecId = values.sectionId;

      if (!targetSecId) {
        messageApi.error("Please select a target section.");
        return;
      }

      const targetSection = sections.find((s) => String(s.id) === String(targetSecId));
      const targetAssessmentId =
        targetSection?.assessmentId || selectedAssessmentId || 1;

      // Validate MCQ options if MCQ
      if (values.type === "mcq" || values.type === "mcq4") {
        const emptyOption = mcqOptions.some((opt) => !opt.optionText?.trim());
        if (emptyOption) {
          messageApi.error("All MCQ option texts must be filled.");
          return;
        }
        const hasCorrect = mcqOptions.some((opt) => opt.isCorrect);
        if (!hasCorrect) {
          messageApi.error("Please select which option is the correct answer.");
          return;
        }
      }

      const generatedId =
        values.itemId?.trim() ||
        generateItemId(targetSection?.code || "interest", values.facet, questions.length + 1);

      const payload = {
        itemId: generatedId,
        text: values.text.trim(),
        type: values.type,
        facet: values.facet,
        reverse: Boolean(values.reverse),
        image: values.image?.trim() || null,
        note: values.note?.trim() || null,
        order: Number(values.order) || 1,
        options:
          values.type === "mcq" || values.type === "mcq4"
            ? mcqOptions.map((opt, idx) => ({
                optionText: opt.optionText.trim(),
                optionIndex: opt.optionIndex ?? idx,
                isCorrect: Boolean(opt.isCorrect),
                image: null,
              }))
            : [],
      };

      if (modalMode === "edit" && currentRecord) {
        try {
          await updateQuestion(currentRecord.id, payload);
          messageApi.success("Question updated successfully on server.");
        } catch (apiErr) {
          console.warn("Backend update question error:", apiErr);
          messageApi.info("Updated question locally.");
        }
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === currentRecord.id ? { ...q, ...payload, sectionId: targetSecId } : q
          )
        );
      } else {
        try {
          const res = await createQuestion(targetSecId, payload);
          if (res?.data?.id) payload.id = res.data.id;
          messageApi.success(`Question ${payload.itemId} created successfully on server.`);
        } catch (apiErr) {
          console.warn("Backend create question error:", apiErr);
          messageApi.warning(getApiErrorMessage(apiErr, "Added question locally."));
        }
        const newQ = {
          id: payload.id || Date.now(),
          sectionId: targetSecId,
          sectionCode: targetSection?.code,
          sectionTitle: targetSection?.title,
          assessmentId: targetAssessmentId,
          ...payload,
        };
        setQuestions((prev) => [newQ, ...prev]);
      }

      handleCloseModal();
      // Reload fresh questions from server
      await loadQuestions();
    } catch (err) {
      if (!err?.errorFields) {
        messageApi.error(getApiErrorMessage(err, "Failed to save question."));
      }
    }
  };

  const handleDeleteQuestion = async (record) => {
    try {
      await deleteQuestion(record.id);
      messageApi.success("Question deleted successfully.");
    } catch (err) {
      console.warn("Delete question API error:", err);
      messageApi.success("Question removed.");
    } finally {
      setQuestions((prev) => prev.filter((q) => q.id !== record.id));
    }
  };

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">#</span>,
      key: "slNo",
      width: 60,
      render: (_, __, index) => (
        <span className="font-mono text-xs text-gray-500 font-semibold">
          {getSerialNumber(index, pagination)}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Item Code</span>,
      dataIndex: "itemId",
      key: "itemId",
      width: 120,
      render: (code, record) => (
        <span
          onClick={() => handleOpenView(record)}
          className="font-mono text-xs font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded cursor-pointer hover:text-[#9a2119]"
        >
          {code || `ITM_${record.id}`}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Question Prompt</span>,
      key: "prompt",
      render: (_, record) => {
        const facetInfo = FACET_MAP[record.facet];
        const sectionInfo = sections.find(
          (s) => String(s.id) === String(record.sectionId)
        );

        return (
          <div className="space-y-1.5 py-1">
            <div className="flex items-start gap-2.5">
              {record.image && (
                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <Image
                    src={record.image}
                    alt="Question Diagram"
                    className="w-full h-full object-cover"
                    fallback="https://placehold.co/100x100?text=IMG"
                  />
                </div>
              )}
              <div className="space-y-1">
                <p className="font-medium text-gray-900 leading-snug">
                  {record.text}
                </p>
                {record.note && (
                  <p className="text-xs text-gray-400 italic">
                    💡 Rubric: {record.note}
                  </p>
                )}
              </div>
            </div>

            {/* Options Preview */}
            <div className="flex items-center gap-2 pt-0.5">
              {record.type?.startsWith("mcq") || (record.options && record.options.length > 0) ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {record.options?.map((opt, i) => (
                    <span
                      key={i}
                      className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        opt.isCorrect
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      {opt.isCorrect ? "✓ " : ""}
                      {opt.optionText || `Option ${i + 1}`}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                  📊 Likert 1–5 Scale (Strongly Disagree to Strongly Agree)
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Section & Facet</span>,
      key: "facetSection",
      width: 190,
      render: (_, record) => {
        const facetInfo = FACET_MAP[record.facet];
        const sectionInfo = sections.find(
          (s) => String(s.id) === String(record.sectionId)
        );

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {facetInfo ? (
                <Tooltip title={`${facetInfo.groupName}: ${facetInfo.description}`}>
                  <Tag
                    color={facetInfo.groupColor}
                    className="font-bold font-mono text-xs px-2 py-0.5 rounded m-0"
                  >
                    {record.facet} — {facetInfo.name}
                  </Tag>
                </Tooltip>
              ) : (
                <Tag className="font-mono text-xs m-0">{record.facet || "General"}</Tag>
              )}
            </div>

            {sectionInfo && (
              <div className="text-[11px] text-gray-500 font-medium line-clamp-1">
                {sectionInfo.title}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Type</span>,
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase font-mono ${
            type?.startsWith("mcq")
              ? "bg-purple-100 text-purple-800 border border-purple-200"
              : "bg-blue-100 text-blue-800 border border-blue-200"
          }`}
        >
          {type || "likert5"}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Reverse</span>,
      dataIndex: "reverse",
      key: "reverse",
      width: 90,
      render: (isRev) =>
        isRev ? (
          <Tag color="orange" className="text-xs font-semibold">
            Reverse
          </Tag>
        ) : (
          <span className="text-xs text-gray-400">Normal</span>
        ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Actions</span>,
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1.5">
          <Tooltip title="View Question">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleOpenView(record)}
              className="text-gray-600 hover:text-[#9a2119] hover:bg-rose-50"
            />
          </Tooltip>
          <Tooltip title="Edit Question">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenEdit(record)}
              className="text-[#9a2119] hover:bg-rose-50"
            />
          </Tooltip>
          <Tooltip title="Delete Question">
            <Popconfirm
              title="Delete this question?"
              description="Are you sure you want to remove this question from the section?"
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteQuestion(record)}
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
          <div className="flex items-center gap-2">
            {(assessmentId || activeSectionId) && (
              <Button
                type="text"
                size="small"
                icon={<ArrowLeftOutlined />}
                onClick={() =>
                  navigate(
                    assessmentId
                      ? `/admin/psychometric-assessments/${assessmentId}/sections`
                      : "/admin/psychometric-sections"
                  )
                }
                className="text-gray-500 hover:text-[#9a2119]"
              >
                Back to Sections
              </Button>
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#9a2119] tracking-tight mt-1">
            Psychometric Question Bank & Options Builder
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure dynamic Likert-5 rating prompts and timed aptitude MCQs linked directly to backend sections.
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
            onConfirm={handleSeedDefaults}
          >
            <Button
              icon={<ThunderboltFilled className="text-amber-500" />}
              loading={seeding}
              className="border-amber-300 bg-amber-50/50 text-amber-950 hover:bg-amber-100 font-semibold shadow-sm"
            >
              ⚡ Load Default 163 Questions
            </Button>
          </Popconfirm>

          <Button
            onClick={() => loadQuestions()}
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
            Add Question
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        {/* Multi-Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-b border-gray-100 pb-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Assessment:
            </label>
            <Select
              value={selectedAssessmentId}
              onChange={(val) => {
                setSelectedAssessmentId(val);
                setSelectedSectionId("all");
              }}
              className="w-full"
            >
              <Option value="all">🌐 All Assessments</Option>
              {assessments.map((a) => (
                <Option key={a.id} value={String(a.id)}>
                  {a.title}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Section:
            </label>
            <Select
              value={selectedSectionId}
              onChange={setSelectedSectionId}
              className="w-full"
            >
              <Option value="all">📑 All Sections ({sections.length})</Option>
              {availableSections.map((s) => (
                <Option key={s.id} value={String(s.id)}>
                  {s.title} ({s.code})
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Question Type:
            </label>
            <Select value={selectedType} onChange={setSelectedType} className="w-full">
              <Option value="all">All Types</Option>
              <Option value="likert5">Likert 1–5 Scale</Option>
              <Option value="mcq">MCQ (Multiple Choice)</Option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Facet Dimension:
            </label>
            <Select value={selectedFacet} onChange={setSelectedFacet} className="w-full">
              <Option value="all">All Facets</Option>
              {FACET_GROUPS.map((group) => (
                <OptGroup key={group.group} label={group.group}>
                  {group.facets.map((f) => (
                    <Option key={f.code} value={f.code}>
                      {f.code} - {f.name}
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          </div>
        </div>

        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Showing <strong className="text-gray-900">{filteredQuestions.length}</strong> items in bank
          </div>
          <Input
            placeholder="Search prompt, item code (e.g. INT01, APT01)..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="h-9 w-full sm:w-80 rounded-lg border-gray-300 hover:border-[#9a2119]"
          />
        </div>

        {/* Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredQuestions}
          loading={loading}
          pagination={pagination}
          onChange={(pag) => setPagination(pag)}
          scroll={{ x: 1000 }}
          className="custom-table"
        />
      </div>

      {/* Create / Edit / View Question Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        title={
          <div className="flex items-center gap-2 text-lg font-bold text-[#9a2119]">
            <QuestionCircleOutlined />
            <span>
              {modalMode === "add"
                ? "Add Question to Section"
                : modalMode === "edit"
                ? "Edit Question"
                : "Question Preview"}
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
                {modalMode === "edit" ? "Save Changes" : "Create Question"}
              </Button>
            </div>
          )
        }
        width={760}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          disabled={modalMode === "view"}
          className="mt-4 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Form.Item
              name="sectionId"
              label={<span className="font-semibold text-gray-700">Target Section</span>}
              rules={[validationRules.required("Section")]}
              className="sm:col-span-2"
            >
              <Select
                size="large"
                placeholder="Select Target Section"
                onChange={handleSectionSelectInModal}
                className="rounded-lg"
              >
                {sections.map((s) => (
                  <Option key={s.id} value={s.id}>
                    {s.title} ({s.code})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="itemId"
              label={
                <Tooltip title="Standard Item ID code like INT01, PER01, LRN01, VAL01, APT01">
                  <span className="font-semibold text-gray-700 cursor-help">
                    Item Code (?)
                  </span>
                </Tooltip>
              }
            >
              <Input
                size="large"
                placeholder="e.g. INT01, APT01"
                className="rounded-lg font-mono"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Form.Item
              name="facet"
              label={
                <span className="font-semibold text-gray-700">
                  Facet (Domain Specific)
                </span>
              }
              rules={[validationRules.required("Facet")]}
            >
              <Select
                size="large"
                showSearch
                optionFilterProp="children"
                className="rounded-lg"
              >
                {dynamicFacetsForForm.map((f) => (
                  <Option key={f.code} value={f.code}>
                    {f.code} — {f.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="type"
              label={<span className="font-semibold text-gray-700">Question Type</span>}
              rules={[validationRules.required("Question type")]}
            >
              <Select size="large" className="rounded-lg">
                <Option value="likert5">Likert 1–5 Scale</Option>
                <Option value="mcq">MCQ (Multiple Choice)</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="order"
              label={<span className="font-semibold text-gray-700">Numeric Order</span>}
              rules={[validationRules.required("Order")]}
            >
              <InputNumber min={1} max={999} className="w-full rounded-lg" size="large" />
            </Form.Item>
          </div>

          <Form.Item
            name="text"
            label={<span className="font-semibold text-gray-700">Question Prompt / Statement</span>}
            rules={[validationRules.required("Question prompt")]}
          >
            <TextArea
              rows={3}
              placeholder="Enter the question prompt statement (e.g. Using tools to build or fix things)..."
              className="rounded-lg"
            />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Form.Item
              name="image"
              label={<span className="font-semibold text-gray-700">Diagram / Visual Image URL</span>}
            >
              <Input
                placeholder="https://example.com/diagram.png (Optional)"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="reverse"
              valuePropName="checked"
              label={<span className="font-semibold text-gray-700">Reverse Scoring</span>}
            >
              <div className="flex items-center gap-3 pt-1">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
                <span className="text-xs text-gray-500">
                  Reverse 1-5 scale for negative valence items
                </span>
              </div>
            </Form.Item>
          </div>

          {/* Image Live Preview */}
          {watchedImage && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 flex items-center gap-4">
              <Image
                src={watchedImage}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg"
                fallback="https://placehold.co/100x100?text=Invalid+URL"
              />
              <div className="text-xs text-gray-600">
                <div className="font-semibold">Image Preview</div>
                <div className="text-gray-400 truncate max-w-sm">{watchedImage}</div>
              </div>
            </div>
          )}

          <Form.Item
            name="note"
            label={<span className="font-semibold text-gray-700">Rubric / Explanation Note</span>}
          >
            <Input
              placeholder="Internal scoring rationale or help note..."
              className="rounded-lg"
            />
          </Form.Item>

          {/* Dynamic MCQ Option Builder (Only visible when MCQ is selected) */}
          {(watchedType === "mcq" || watchedType === "mcq4") && (
            <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-purple-950 text-sm">
                    MCQ Options Builder & Answer Key
                  </h4>
                  <p className="text-xs text-purple-700">
                    Define 2–6 answer choices and select the radio button for the correct answer.
                  </p>
                </div>
                {modalMode !== "view" && (
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={handleAddMcqOption}
                    className="border-purple-300 text-purple-900 hover:bg-purple-100"
                  >
                    Add Option
                  </Button>
                )}
              </div>

              <div className="space-y-2.5">
                {mcqOptions.map((option, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border transition ${
                      option.isCorrect
                        ? "bg-emerald-50/80 border-emerald-300 shadow-sm"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {/* Correct Radio */}
                    <Tooltip title="Mark as correct answer">
                      <input
                        type="radio"
                        name="correctOptionRadio"
                        checked={option.isCorrect}
                        onChange={() => handleSetCorrectOption(idx)}
                        disabled={modalMode === "view"}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </Tooltip>

                    <span className="font-mono text-xs font-bold text-gray-500 w-6 text-center">
                      #{idx + 1}
                    </span>

                    <Input
                      value={option.optionText}
                      onChange={(e) => handleMcqTextChange(idx, e.target.value)}
                      placeholder={`Enter Option ${idx + 1} text...`}
                      disabled={modalMode === "view"}
                      className="rounded-md flex-1"
                    />

                    {option.isCorrect && (
                      <Tag color="success" className="font-semibold text-xs">
                        Correct Answer
                      </Tag>
                    )}

                    {modalMode !== "view" && mcqOptions.length > 2 && (
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<MinusCircleOutlined />}
                        onClick={() => handleRemoveMcqOption(idx)}
                        className="text-gray-400 hover:text-red-600"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}
