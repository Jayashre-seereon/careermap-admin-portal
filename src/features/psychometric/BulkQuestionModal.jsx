import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Button,
  Select,
  Input,
  InputNumber,
  Switch,
  Tag,
  Tooltip,
  Space,
  Tabs,
  Popconfirm,
  Image,
  Alert,
  message,
} from "antd";
import {
  ThunderboltOutlined,
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  FileTextOutlined,
  CodeOutlined,
  CheckCircleFilled,
  FileImageOutlined,
  UnorderedListOutlined,
  ClearOutlined,
  AppstoreAddOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { bulkCreateQuestions, getApiErrorMessage } from "../../api/psychometricAssessmentApi";
import {
  ALL_FACETS,
  FACET_GROUPS,
  FACET_MAP,
  getFacetsForSection,
} from "./psychometricConstants";

const { TextArea } = Input;
const { Option, OptGroup } = Select;

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function BulkQuestionModal({
  open,
  onClose,
  onSuccess,
  sections = [],
  assessments = [],
  defaultSectionId = null,
}) {
  const [activeTab, setActiveTab] = useState("builder"); // "builder" | "json"
  const [submitting, setSubmitting] = useState(false);

  // Common Header Configuration
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedFacet, setSelectedFacet] = useState("R");
  const [selectedType, setSelectedType] = useState("likert5"); // "likert5" | "mcq"
  const [startingOrder, setStartingOrder] = useState(1);

  // Mode A: Likert-5 Questions List
  const [likertQuestions, setLikertQuestions] = useState([
    { id: 1, text: "", order: 1, reverse: false },
    { id: 2, text: "", order: 2, reverse: false },
    { id: 3, text: "", order: 3, reverse: false },
  ]);

  // Mode B: MCQ Questions List
  const [mcqQuestions, setMcqQuestions] = useState([
    {
      id: 1,
      text: "",
      image: "",
      order: 1,
      note: "",
      options: [
        { optionText: "", image: "", isCorrect: true, optionIndex: 0 },
        { optionText: "", image: "", isCorrect: false, optionIndex: 1 },
        { optionText: "", image: "", isCorrect: false, optionIndex: 2 },
        { optionText: "", image: "", isCorrect: false, optionIndex: 3 },
      ],
    },
  ]);

  // Quick Multi-line Paste Modal
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");

  // Mode C: Raw JSON Editor state
  const [rawJsonText, setRawJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");

  // Sync section defaults when modal opens
  useEffect(() => {
    if (open) {
      const initialSecId =
        defaultSectionId && defaultSectionId !== "all"
          ? defaultSectionId
          : sections[0]?.id || null;

      setSelectedSectionId(initialSecId);
      syncDefaultsForSection(initialSecId);
    }
  }, [open, defaultSectionId, sections]);

  // Sync facet & type when section changes
  const syncDefaultsForSection = (secId) => {
    const targetSec = sections.find((s) => String(s.id) === String(secId));
    if (!targetSec) return;

    const availableFacets = getFacetsForSection(targetSec.code);
    const defFacet = availableFacets[0]?.code || "R";
    const defType = targetSec.code === "aptitude" ? "mcq" : "likert5";

    setSelectedFacet(defFacet);
    setSelectedType(defType);

    // Calculate starting order from existing questions in section
    const existingCount =
      targetSec.questionCount ??
      targetSec._count?.questions ??
      targetSec.questions?.length ??
      0;
    const nextOrder = existingCount + 1;
    setStartingOrder(nextOrder);

    // Initialize clean rows with starting order
    if (defType === "likert5") {
      setLikertQuestions([
        { id: 1, text: "", order: nextOrder, reverse: false },
        { id: 2, text: "", order: nextOrder + 1, reverse: false },
        { id: 3, text: "", order: nextOrder + 2, reverse: false },
      ]);
    } else {
      setMcqQuestions([
        {
          id: 1,
          text: "",
          image: "",
          order: nextOrder,
          note: "",
          options: [
            { optionText: "", image: "", isCorrect: true, optionIndex: 0 },
            { optionText: "", image: "", isCorrect: false, optionIndex: 1 },
            { optionText: "", image: "", isCorrect: false, optionIndex: 2 },
            { optionText: "", image: "", isCorrect: false, optionIndex: 3 },
          ],
        },
      ]);
    }
  };

  const handleSectionChange = (secId) => {
    setSelectedSectionId(secId);
    syncDefaultsForSection(secId);
  };

  // Dynamic Facets for the chosen Section
  const currentSection = useMemo(() => {
    return sections.find((s) => String(s.id) === String(selectedSectionId)) || null;
  }, [sections, selectedSectionId]);

  const availableFacets = useMemo(() => {
    if (!currentSection) return ALL_FACETS;
    return getFacetsForSection(currentSection.code);
  }, [currentSection]);

  // ==========================================
  // LIKERT-5 QUESTIONS BUILDER HANDLERS
  // ==========================================

  const handleAddLikertRow = () => {
    const nextOrder =
      likertQuestions.length > 0
        ? (Number(likertQuestions[likertQuestions.length - 1].order) || 0) + 1
        : startingOrder;

    setLikertQuestions((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text: "",
        order: nextOrder,
        reverse: false,
      },
    ]);
  };

  const handleAddMultipleLikertRows = (count = 5) => {
    let lastOrder =
      likertQuestions.length > 0
        ? (Number(likertQuestions[likertQuestions.length - 1].order) || 0)
        : startingOrder - 1;

    const newRows = [];
    for (let i = 0; i < count; i++) {
      lastOrder += 1;
      newRows.push({
        id: Date.now() + i + Math.random(),
        text: "",
        order: lastOrder,
        reverse: false,
      });
    }

    setLikertQuestions((prev) => [...prev, ...newRows]);
  };

  const handleLikertFieldChange = (id, field, value) => {
    setLikertQuestions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveLikertRow = (id) => {
    if (likertQuestions.length <= 1) {
      message.warning("At least one question row is required.");
      return;
    }
    setLikertQuestions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearLikertRows = () => {
    setLikertQuestions([
      { id: Date.now(), text: "", order: startingOrder, reverse: false },
    ]);
  };

  const handleApplyPasteText = () => {
    const lines = pasteText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      message.warning("No non-empty lines found to import.");
      return;
    }

    let orderCounter = startingOrder;
    const importedRows = lines.map((line, idx) => {
      // Remove leading numbering e.g. "1.", "1)", "Q1:", "- "
      const cleanText = line.replace(/^(\d+[\.\)]\s*|Q\d+[:\.]\s*|-\s*|\*\s*)/i, "").trim();
      return {
        id: Date.now() + idx + Math.random(),
        text: cleanText || line,
        order: orderCounter++,
        reverse: false,
      };
    });

    setLikertQuestions(importedRows);
    setPasteText("");
    setPasteModalOpen(false);
    message.success(`Imported ${importedRows.length} questions from text!`);
  };

  // ==========================================
  // MCQ QUESTIONS BUILDER HANDLERS
  // ==========================================

  const handleAddMcqQuestion = () => {
    const nextOrder =
      mcqQuestions.length > 0
        ? (Number(mcqQuestions[mcqQuestions.length - 1].order) || 0) + 1
        : startingOrder;

    setMcqQuestions((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text: "",
        image: "",
        order: nextOrder,
        note: "",
        options: [
          { optionText: "", image: "", isCorrect: true, optionIndex: 0 },
          { optionText: "", image: "", isCorrect: false, optionIndex: 1 },
          { optionText: "", image: "", isCorrect: false, optionIndex: 2 },
          { optionText: "", image: "", isCorrect: false, optionIndex: 3 },
        ],
      },
    ]);
  };

  const handleAddMultipleMcqQuestions = (count = 3) => {
    let lastOrder =
      mcqQuestions.length > 0
        ? (Number(mcqQuestions[mcqQuestions.length - 1].order) || 0)
        : startingOrder - 1;

    const newItems = [];
    for (let i = 0; i < count; i++) {
      lastOrder += 1;
      newItems.push({
        id: Date.now() + i + Math.random(),
        text: "",
        image: "",
        order: lastOrder,
        note: "",
        options: [
          { optionText: "", image: "", isCorrect: true, optionIndex: 0 },
          { optionText: "", image: "", isCorrect: false, optionIndex: 1 },
          { optionText: "", image: "", isCorrect: false, optionIndex: 2 },
          { optionText: "", image: "", isCorrect: false, optionIndex: 3 },
        ],
      });
    }

    setMcqQuestions((prev) => [...prev, ...newItems]);
  };

  const handleMcqFieldChange = (qId, field, value) => {
    setMcqQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, [field]: value } : q))
    );
  };

  const handleDuplicateMcq = (q) => {
    const nextOrder = (Number(q.order) || 0) + 1;
    const duplicated = {
      ...q,
      id: Date.now() + Math.random(),
      order: nextOrder,
      options: q.options.map((opt) => ({ ...opt })),
    };
    setMcqQuestions((prev) => [...prev, duplicated]);
    message.success("MCQ question card duplicated.");
  };

  const handleRemoveMcq = (qId) => {
    if (mcqQuestions.length <= 1) {
      message.warning("At least one MCQ card is required.");
      return;
    }
    setMcqQuestions((prev) => prev.filter((q) => q.id !== qId));
  };

  const handleAddOptionToMcq = (qId) => {
    setMcqQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        if (q.options.length >= 6) {
          message.warning("Maximum 6 options allowed per question.");
          return q;
        }
        return {
          ...q,
          options: [
            ...q.options,
            {
              optionText: "",
              image: "",
              isCorrect: false,
              optionIndex: q.options.length,
            },
          ],
        };
      })
    );
  };

  const handleRemoveOptionFromMcq = (qId, optIdx) => {
    setMcqQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        if (q.options.length <= 2) {
          message.warning("At least 2 options are required for an MCQ.");
          return q;
        }
        const filtered = q.options.filter((_, idx) => idx !== optIdx);
        const reindexed = filtered.map((o, idx) => ({ ...o, optionIndex: idx }));
        if (!reindexed.some((o) => o.isCorrect)) {
          reindexed[0].isCorrect = true;
        }
        return { ...q, options: reindexed };
      })
    );
  };

  const handleOptionFieldChange = (qId, optIdx, field, value) => {
    setMcqQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const nextOptions = q.options.map((opt, idx) => {
          if (idx === optIdx) {
            return { ...opt, [field]: value };
          }
          if (field === "isCorrect" && value === true) {
            return { ...opt, isCorrect: false };
          }
          return opt;
        });
        return { ...q, options: nextOptions };
      })
    );
  };

  // ==========================================
  // RAW JSON TEMPLATES & VALIDATION
  // ==========================================

  const loadLikertTemplate = () => {
    const template = {
      sectionId: selectedSectionId || 1,
      facet: selectedFacet || "R",
      type: "likert5",
      questions: [
        {
          text: "I enjoy repairing household electrical appliances",
          order: 1,
          reverse: false,
        },
        {
          text: "I like assembling furniture or mechanical parts",
          order: 2,
          reverse: false,
        },
        {
          text: "I prefer working outdoors on physical tasks",
          order: 3,
          reverse: false,
        },
      ],
    };
    setRawJsonText(JSON.stringify(template, null, 2));
    setJsonError("");
  };

  const loadMcqTemplate = () => {
    const template = {
      sectionId: selectedSectionId || 6,
      facet: selectedFacet || "Spat",
      type: "mcq",
      questions: [
        {
          text: "If the picture below is rotated, which option is the result?",
          image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794882/35q.png",
          order: 35,
          note: "Mental rotation figure question",
          options: [
            {
              optionText: "Figure 1",
              image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794882/35op1.png",
              isCorrect: false,
              optionIndex: 0,
            },
            {
              optionText: "Figure 2",
              image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794882/35op2.png",
              isCorrect: false,
              optionIndex: 1,
            },
            {
              optionText: "Figure 3",
              image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794882/35op3.png",
              isCorrect: true,
              optionIndex: 2,
            },
            {
              optionText: "Figure 4",
              image: "https://res.cloudinary.com/tj6xmmar/image/upload/v1789794882/35op4.png",
              isCorrect: false,
              optionIndex: 3,
            },
          ],
        },
      ],
    };
    setRawJsonText(JSON.stringify(template, null, 2));
    setJsonError("");
  };

  const validateRawJson = () => {
    try {
      if (!rawJsonText.trim()) {
        setJsonError("JSON cannot be empty.");
        return null;
      }
      const parsed = JSON.parse(rawJsonText);
      if (!parsed.sectionId && !selectedSectionId) {
        setJsonError("Missing 'sectionId' in payload.");
        return null;
      }
      if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        setJsonError("'questions' must be a non-empty array.");
        return null;
      }
      setJsonError("");
      return parsed;
    } catch (e) {
      setJsonError(`Invalid JSON Syntax: ${e.message}`);
      return null;
    }
  };

  // ==========================================
  // BULK SUBMIT DISPATCHER
  // ==========================================

  const handleBulkSubmit = async () => {
    try {
      setSubmitting(true);

      let payload = null;

      if (activeTab === "json") {
        payload = validateRawJson();
        if (!payload) {
          setSubmitting(false);
          return;
        }
      } else {
        if (!selectedSectionId) {
          message.error("Please select a target section.");
          setSubmitting(false);
          return;
        }

        if (selectedType === "likert5") {
          const validRows = likertQuestions.filter((q) => q.text.trim());
          if (validRows.length === 0) {
            message.error("Please enter at least one question statement.");
            setSubmitting(false);
            return;
          }

          payload = {
            sectionId: selectedSectionId,
            facet: selectedFacet,
            type: "likert5",
            questions: validRows.map((q, idx) => ({
              text: q.text.trim(),
              order: Number(q.order) || startingOrder + idx,
              reverse: Boolean(q.reverse),
            })),
          };
        } else {
          const validMcqs = mcqQuestions.filter((q) => q.text.trim());
          if (validMcqs.length === 0) {
            message.error("Please enter question prompts for the MCQs.");
            setSubmitting(false);
            return;
          }

          for (let i = 0; i < validMcqs.length; i++) {
            const mcq = validMcqs[i];
            const emptyOpt = mcq.options.some((o) => !o.optionText.trim() && !o.image?.trim());
            if (emptyOpt) {
              message.error(`MCQ #${i + 1} has empty options without text or images.`);
              setSubmitting(false);
              return;
            }
            const hasCorrect = mcq.options.some((o) => o.isCorrect);
            if (!hasCorrect) {
              message.error(`MCQ #${i + 1} must have one option marked as correct answer.`);
              setSubmitting(false);
              return;
            }
          }

          payload = {
            sectionId: selectedSectionId,
            facet: selectedFacet,
            type: "mcq",
            questions: validMcqs.map((q, idx) => ({
              text: q.text.trim(),
              image: q.image?.trim() || null,
              order: Number(q.order) || startingOrder + idx,
              note: q.note?.trim() || null,
              options: q.options.map((opt, optIdx) => ({
                optionText: opt.optionText.trim() || `Option ${optIdx + 1}`,
                image: opt.image?.trim() || null,
                isCorrect: Boolean(opt.isCorrect),
                optionIndex: opt.optionIndex ?? optIdx,
              })),
            })),
          };
        }
      }

      const count = payload.questions.length;
      const res = await bulkCreateQuestions(payload);

      message.success(
        res?.message || `Successfully created batch of ${count} questions!`
      );

      if (onSuccess) {
        onSuccess(res?.data || res);
      }
      onClose();
    } catch (err) {
      console.error("Bulk create questions error:", err);
      message.error(getApiErrorMessage(err, "Failed to bulk create questions."));
    } finally {
      setSubmitting(false);
    }
  };

  const validLikertCount = likertQuestions.filter((q) => q.text.trim()).length;
  const validMcqCount = mcqQuestions.filter((q) => q.text.trim()).length;

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        width={1000}
        style={{ top: 20 }}
        title={
          <div className="flex items-center gap-2.5 text-lg font-bold text-[#8C1814]">
               <span>Add Questions & Answers</span>
          
          </div>
        }
        footer={
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs text-gray-500">
              {activeTab === "builder" ? (
                <span>
                  Ready to add{" "}
                  <strong className="text-gray-900 font-bold">
                    {selectedType === "likert5" ? validLikertCount : validMcqCount}
                  </strong>{" "}
                  questions into{" "}
                  <strong className="text-gray-900">
                    {currentSection?.title || "selected section"}
                  </strong>
                </span>
              ) : (
                <span>Raw JSON Payload Importer</span>
              )}
            </div>

            <Space>
              <Button onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="primary"
                loading={submitting}
                onClick={handleBulkSubmit}
                style={{ backgroundColor: "#8C1814", borderColor: "#8C1814" }}
                className="font-semibold shadow-sm"
              >
                Submit 
              </Button>
            </Space>
          </div>
        }
        destroyOnClose
      >
        <div className="space-y-4 pt-2">
          {/* Top Selection Scope Bar */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/80 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Target Section */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  1. Target Section <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedSectionId}
                  onChange={handleSectionChange}
                  placeholder="Select Section"
                  className="w-full"
                  size="middle"
                >
                  {sections.map((s) => (
                    <Option key={s.id} value={s.id}>
                      {s.title} ({s.code})
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Facet Dimension */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  2. Facet Dimension <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedFacet}
                  onChange={setSelectedFacet}
                  placeholder="Select Facet"
                  className="w-full"
                  showSearch
                  optionFilterProp="children"
                  size="middle"
                >
                  {availableFacets.map((f) => (
                    <Option key={f.code} value={f.code}>
                      {f.code} — {f.name}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Question Type */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  3. Question Type <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedType}
                  onChange={setSelectedType}
                  className="w-full"
                  size="middle"
                >
                  <Option value="likert5">Likert 1–5 Scale</Option>
                  <Option value="mcq">MCQ (Multiple Choice & Images)</Option>
                </Select>
              </div>

             
            </div>

           
          </div>

          {/* Mode Switch Tabs */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "builder",
                label: (
                  <span className="font-bold flex items-center gap-1.5 text-sm">
                   
                    <span>
                      {selectedType === "likert5"
                        ? "Likert-5 Questions Builder"
                        : "Multiple Choice Questions & Options Builder"}
                    </span>
                    <Tag color="blue" className="ml-1 text-[10px]">
                      {selectedType === "likert5"
                        ? `${likertQuestions.length} Items`
                        : `${mcqQuestions.length} MCQs`}
                    </Tag>
                  </span>
                ),
                children: (
                  <div className="space-y-4 pt-1">
                    {/* ========================================================
                        TAB A: LIKERT-5 QUESTIONS BUILDER
                    ======================================================== */}
                    {selectedType === "likert5" ? (
                      <div className="space-y-3">
                        {/* Information banner about standard Likert-5 scale */}
                        <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Standard 5-Point Scale:</span>
                            <span className="bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-800">
                              1: Strongly Disagree
                            </span>
                            <span>→</span>
                            <span className="bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-800">
                              5: Strongly Agree
                            </span>
                          </div>
                          <span className="text-blue-700 italic">
                            Options are auto-configured by the system.
                          </span>
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              type="primary"
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={handleAddLikertRow}
                              style={{ backgroundColor: "#8C1814", borderColor: "#8C1814" }}
                              className="font-semibold"
                            >
                              Add Row
                            </Button>
                            <Button
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => handleAddMultipleLikertRows(5)}
                            >
                              Add 5 Rows
                            </Button>
                           
                            <Button
                              size="small"
                              icon={<FileTextOutlined />}
                              onClick={() => setPasteModalOpen(true)}
                              className="border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                            Paste Multi-line List
                            </Button>
                          </div>

                          <Popconfirm
                            title="Clear all question rows?"
                            onConfirm={handleClearLikertRows}
                            okText="Yes, Clear"
                            cancelText="Cancel"
                          >
                            <Button size="small" icon={<ClearOutlined />} danger>
                              Clear
                            </Button>
                          </Popconfirm>
                        </div>

                        {/* Likert Rows Table */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs max-h-[380px] overflow-y-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-gray-100/80 sticky top-0 z-10 border-b border-gray-200">
                              <tr>
                                <th className="p-2.5 w-12 text-center font-bold text-gray-700">sl</th>
                                <th className="p-2.5 font-bold text-gray-700">
                                   Question Statement (Likert-5 Prompt) <span className="text-red-500">*</span>
                                </th>
                                <th className="p-2.5 w-32 text-center font-bold text-gray-700">
                                  Reverse Score
                                </th>
                                <th className="p-2.5 w-12 text-center font-bold text-gray-700"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                              {likertQuestions.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-gray-50/80 transition">
                                  <td className="p-2.5 text-center font-mono font-bold text-gray-400">
                                    {idx + 1}
                                  </td>
                                
                                  <td className="p-2">
                                    <Input
                                      value={item.text}
                                      onChange={(e) =>
                                        handleLikertFieldChange(item.id, "text", e.target.value)
                                      }
                                      placeholder={`e.g. I like solving logical problems (Question ${idx + 1})...`}
                                      className="rounded-md"
                                    />
                                  </td>
                                  <td className="p-2 text-center">
                                    <Switch
                                      size="small"
                                      checked={item.reverse}
                                      onChange={(checked) =>
                                        handleLikertFieldChange(item.id, "reverse", checked)
                                      }
                                    />
                                    <span className="text-[11px] text-gray-400 ml-1.5">
                                      {item.reverse ? "Yes" : "No"}
                                    </span>
                                  </td>
                                  <td className="p-2 text-center">
                                    <Button
                                      type="text"
                                      size="small"
                                      danger
                                      icon={<DeleteOutlined />}
                                      onClick={() => handleRemoveLikertRow(item.id)}
                                      disabled={likertQuestions.length <= 1}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* ========================================================
                         TAB B: MCQ WITH OPTIONS & IMAGES BUILDER
                      ======================================================== */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              type="primary"
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={handleAddMcqQuestion}
                              style={{ backgroundColor: "#8C1814", borderColor: "#8C1814" }}
                              className="font-semibold"
                            >
                              Add Question
                            </Button>
                            <Button
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => handleAddMultipleMcqQuestions(3)}
                            >
                              Add 3 Questions
                            </Button>
                          </div>

                          <span className="text-xs text-gray-500">
                            Total MCQs in batch: <strong>{mcqQuestions.length}</strong>
                          </span>
                        </div>

                        {/* MCQ Question Cards List */}
                        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                          {mcqQuestions.map((q, qIdx) => (
                            <div
                              key={q.id}
                              className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs space-y-3 relative hover:border-[#8C1814]/40 transition"
                            >
                              {/* Card Header */}
                              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-[#8C1814] text-white font-bold text-xs flex items-center justify-center">
                                    {qIdx + 1}
                                  </span>
                                  <span className="font-bold text-sm text-gray-800">
                                    MCQ Question #{qIdx + 1}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                 
                                 
                                  <Button
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleRemoveMcq(q.id)}
                                    disabled={mcqQuestions.length <= 1}
                                    title="Delete MCQ"
                                  />
                                </div>
                              </div>

                              {/* Question Prompt */}
                              <div>
                                <label className="text-xs font-bold text-gray-700 block mb-1">
                                  Question<span className="text-red-500">*</span>
                                </label>
                                <TextArea
                                  rows={2}
                                  value={q.text}
                                  onChange={(e) =>
                                    handleMcqFieldChange(q.id, "text", e.target.value)
                                  }
                                  placeholder="Enter the question statement / problem (e.g. If the picture below is rotated, which option is the result?)..."
                                  className="rounded-lg"
                                />
                              </div>

                              {/* Question Image URL & Note */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                                    Question Diagram Image URL (Cloudinary / CDN)
                                  </label>
                                  <Input
                                    value={q.image}
                                    onChange={(e) =>
                                      handleMcqFieldChange(q.id, "image", e.target.value)
                                    }
                                    placeholder="https://res.cloudinary.com/.../question.png"
                                    prefix={<FileImageOutlined className="text-gray-400" />}
                                    className="rounded-lg"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                                    Note / Rubric / Solution Tip (Optional)
                                  </label>
                                  <Input
                                    value={q.note}
                                    onChange={(e) =>
                                      handleMcqFieldChange(q.id, "note", e.target.value)
                                    }
                                    placeholder="Mental rotation figure question..."
                                    className="rounded-lg"
                                  />
                                </div>
                              </div>

                              {/* Question Image Live Preview */}
                              {q.image && (
                                <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-3">
                                  <Image
                                    src={q.image}
                                    alt={`Question ${qIdx + 1}`}
                                    className="w-16 h-16 object-cover rounded-md"
                                    fallback="https://placehold.co/80x80?text=Invalid+URL"
                                  />
                                  <div className="text-xs text-gray-500 truncate">
                                    <div className="font-semibold text-gray-700">
                                      Diagram Preview
                                    </div>
                                    <div className="truncate max-w-xs">{q.image}</div>
                                  </div>
                                </div>
                              )}

                              {/* Options & Answers Builder for this MCQ */}
                              <div className="p-3 rounded-xl bg-purple-50/40 border border-purple-200 space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-bold text-xs text-purple-950">
                                      Options & Answer Key ({q.options.length} Choices)
                                    </span>
                                    <span className="text-[11px] text-purple-700 block">
                                      Fill option text/image and select the radio button for the correct answer.
                                    </span>
                                  </div>
                                  {q.options.length < 6 && (
                                    <Button
                                      size="small"
                                      type="dashed"
                                      icon={<PlusOutlined />}
                                      onClick={() => handleAddOptionToMcq(q.id)}
                                      className="text-xs text-purple-900 border-purple-300"
                                    >
                                      Add Option
                                    </Button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  {q.options.map((opt, optIdx) => {
                                    const letter = OPTION_LETTERS[optIdx] || `#${optIdx + 1}`;
                                    return (
                                      <div
                                        key={optIdx}
                                        className={`p-2.5 rounded-lg border transition space-y-1.5 ${
                                          opt.isCorrect
                                            ? "bg-emerald-50/95 border-emerald-400 shadow-xs"
                                            : "bg-white border-gray-200"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                                            <input
                                              type="radio"
                                              name={`correct_radio_${q.id}`}
                                              checked={opt.isCorrect}
                                              onChange={() =>
                                                handleOptionFieldChange(
                                                  q.id,
                                                  optIdx,
                                                  "isCorrect",
                                                  true
                                                )
                                              }
                                              className="text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span
                                              className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold ${
                                                opt.isCorrect
                                                  ? "bg-emerald-600 text-white"
                                                  : "bg-gray-100 text-gray-700"
                                              }`}
                                            >
                                              {letter}
                                            </span>
                                            <span
                                              className={
                                                opt.isCorrect
                                                  ? "text-emerald-900 font-bold"
                                                  : "text-gray-700"
                                              }
                                            >
                                              Option {letter}
                                            </span>
                                          </label>

                                          <div className="flex items-center gap-1">
                                            {opt.isCorrect && (
                                              <Tag color="success" className="text-[10px] m-0 font-bold">
                                                ✓ Correct Answer
                                              </Tag>
                                            )}
                                            {q.options.length > 2 && (
                                              <Button
                                                type="text"
                                                size="small"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() =>
                                                  handleRemoveOptionFromMcq(q.id, optIdx)
                                                }
                                                className="h-5 w-5 p-0 text-gray-400 hover:text-red-600"
                                              />
                                            )}
                                          </div>
                                        </div>

                                        <Input
                                          size="small"
                                          value={opt.optionText}
                                          onChange={(e) =>
                                            handleOptionFieldChange(
                                              q.id,
                                              optIdx,
                                              "optionText",
                                              e.target.value
                                            )
                                          }
                                          placeholder={`Option ${letter} text (e.g. Figure ${optIdx + 1})...`}
                                          className="rounded"
                                        />

                                        <Input
                                          size="small"
                                          value={opt.image}
                                          onChange={(e) =>
                                            handleOptionFieldChange(
                                              q.id,
                                              optIdx,
                                              "image",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Option image URL (e.g. 35op1.png)..."
                                          prefix={<FileImageOutlined className="text-gray-300" />}
                                          className="rounded text-xs"
                                        />

                                        {/* Option Image Thumbnail Preview */}
                                        {opt.image && (
                                          <div className="pt-1 flex items-center gap-2">
                                            <Image
                                              src={opt.image}
                                              alt={`Opt ${letter}`}
                                              className="w-10 h-10 object-cover rounded border border-gray-200"
                                              fallback="https://placehold.co/40x40?text=IMG"
                                            />
                                            <span className="text-[10px] text-gray-400 truncate">
                                              {opt.image}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ),
              },
            
            ]}
          />
        </div>
      </Modal>

      {/* Quick Multi-line Paste Modal */}
      <Modal
        open={pasteModalOpen}
        onCancel={() => setPasteModalOpen(false)}
        title={
          <div className="flex items-center gap-2 text-base font-bold text-gray-800">
            <FileTextOutlined className="text-blue-600" />
            <span>Paste Multiple Questions (One per line)</span>
          </div>
        }
        footer={[
          <Button key="cancel" onClick={() => setPasteModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={handleApplyPasteText}
            style={{ backgroundColor: "#8C1814", borderColor: "#8C1814" }}
            className="font-semibold"
          >
            Import Questions into Batch
          </Button>,
        ]}
        width={650}
        destroyOnClose
      >
        <div className="space-y-3 pt-2">
          <p className="text-xs text-gray-500 leading-relaxed">
            Paste 5 to 50 question prompts below (one question on each line).
            Numbers like <code className="bg-gray-100 px-1 py-0.5 rounded">1.</code>,{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded">Q1:</code> or bullets will be
            automatically cleaned.
          </p>

          <TextArea
            rows={10}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder={`1. I enjoy repairing household electrical appliances\n2. I like assembling furniture or mechanical parts\n3. I prefer working outdoors on physical tasks\n4. I like operating power tools and mechanical equipment`}
            className="rounded-lg text-xs"
          />

          <div className="text-xs text-gray-400 flex items-center justify-between">
            <span>
              Detected Lines:{" "}
              <strong>
                {pasteText.split("\n").filter((l) => l.trim()).length}
              </strong>
            </span>
            <span>Starting from Order #{startingOrder}</span>
          </div>
        </div>
      </Modal>
    </>
  );
}
