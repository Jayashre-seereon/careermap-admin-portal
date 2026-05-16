import { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Select, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import RichTextEditor from "../../components/ui/RichTextEditor";
import StatusSwitch from "../../components/ui/StatusSwitch";
import { getValueFromInput, inputSanitizers, validationRules } from "../../utils/formValidation";

const { Option } = Select;

const DOMAIN_OPTIONS = [
  "All Domain",
  "RIASEC",
  "Aptitude",
  "OCEN",
  "Goal Oriented",
  "VARK",
  "Work Values",
];

const SECTION_OPTIONS_BY_DOMAIN = {
  "All Domain": ["General", "Mixed Assessment", "Foundation"],
  RIASEC: ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"],
  Aptitude: ["Numerical Ability", "Logical Reasoning", "Verbal Ability", "Abstract Reasoning"],
  OCEN: ["Openness", "Conscientiousness", "Extraversion", "Neuroticism"],
  "Goal Oriented": ["Short Term Goals", "Long Term Goals", "Achievement Focus"],
  VARK: ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"],
  "Work Values": ["Leadership", "Recognition", "Security", "Independence", "Service"],
};

const QUESTION_TYPE_OPTIONS = ["Likert", "Likert2"];

const INITIAL_DATA = [
  {
    id: "question-1",
    domain: "RIASEC",
    section: "Investigative",
    questionType: "Likert",
    question: "<p>I enjoy solving complex problems and understanding how things work.</p>",
    options: [
      "<p>Strongly Disagree</p>",
      "<p>Disagree</p>",
      "<p>Neutral</p>",
      "<p>Agree</p>",
      "<p>Strongly Agree</p>",
    ],
    isReverse: "No",
    createdAt: "2026-05-10",
  },
  {
    id: "question-2",
    domain: "VARK",
    section: "Visual",
    questionType: "Likert2",
    question: "<p>I remember information better when I see charts, maps, or diagrams.</p>",
    options: [
      "<p>Never</p>",
      "<p>Sometimes</p>",
      "<p>Often</p>",
      "<p>Always</p>",
    ],
    isReverse: "Yes",
    createdAt: "2026-05-14",
  },
];

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getSectionOptions(domain) {
  return SECTION_OPTIONS_BY_DOMAIN[domain] || [];
}

function QuestionForm({ form, initialValues, viewMode, onSubmit, onCancel }) {
  const selectedDomain = Form.useWatch("domain", form);

  useEffect(() => {
    const section = form.getFieldValue("section");
    const validSections = getSectionOptions(selectedDomain);

    if (selectedDomain && section && !validSections.includes(section)) {
      form.setFieldValue("section", undefined);
    }
  }, [form, selectedDomain]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <Form.Item
        name="domain"
        label="Domain"
        rules={[validationRules.required("Domain")]}
      >
        <Select disabled={viewMode} placeholder="Select Domain">
          {DOMAIN_OPTIONS.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="section"
        label="Section"
        rules={[validationRules.required("Section")]}
      >
        <Select
          disabled={viewMode || !selectedDomain}
          placeholder="Select Section"
        >
          {getSectionOptions(selectedDomain).map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="questionType"
        label="Question Type"
        rules={[validationRules.required("Question type")]}
      >
        <Select disabled={viewMode} placeholder="Select Question Type">
          {QUESTION_TYPE_OPTIONS.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="isReverse"
        label="Is Reverse?"
        valuePropName="checked"
        getValueProps={(value) => ({ checked: value === "Yes" })}
        normalize={(checked) => (checked ? "Yes" : "No")}
      >
        <StatusSwitch disabled={viewMode} checkedChildren="Yes" unCheckedChildren="No" />
      </Form.Item>

      <Form.Item
        name="question"
        label="Question"
        className="md:col-span-2"
        rules={[
          validationRules.required("Question"),
          {
            validator: (_, value) =>
              stripHtml(value)
                ? Promise.resolve()
                : Promise.reject(new Error("Question is required.")),
          },
        ]}
      >
        <RichTextEditor
          disabled={viewMode}
          placeholder="Enter question"
          height={180}
        />
      </Form.Item>

      <div className="md:col-span-2">
        <p className="mb-2 text-sm font-medium text-slate-700">Options</p>

        <Form.List name="options">
          {(fields, { add, remove }) => (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.key} className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#9a2119]">Option {index + 1}</p>
                    {!viewMode && fields.length > 1 && (
                      <Button
                        danger
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <Form.Item
                    {...field}
                    name={field.name}
                    className="mb-0"
                    rules={[
                      validationRules.required("Option"),
                      {
                        validator: (_, value) =>
                          stripHtml(value)
                            ? Promise.resolve()
                            : Promise.reject(new Error("Option is required.")),
                      },
                    ]}
                  >
                    <RichTextEditor
                      disabled={viewMode}
                      placeholder={`Enter option ${index + 1}`}
                      height={140}
                    />
                  </Form.Item>
                </div>
              ))}

              {!viewMode && (
                <Button
                  type="dashed"
                  onClick={() => add("")}
                  icon={<PlusOutlined />}
                  className="w-full"
                >
                  Add Option
                </Button>
              )}
            </div>
          )}
        </Form.List>
      </div>

      <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
        <Button onClick={onCancel}>{viewMode ? "Back" : "Cancel"}</Button>
        {!viewMode && (
          <Button
            htmlType="submit"
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            {initialValues ? "Update Question" : "Create Question"}
          </Button>
        )}
      </div>
    </Form>
  );
}

export default function Question() {
  const [form] = Form.useForm();
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState(undefined);
  const [sectionFilter, setSectionFilter] = useState(undefined);
  const [questionTypeFilter, setQuestionTypeFilter] = useState(undefined);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return data.filter((item) => {
      const matchesSearch =
        !query ||
        [
          item.domain,
          item.section,
          item.questionType,
          stripHtml(item.question),
          item.options.map((option) => stripHtml(option)).join(" "),
          item.isReverse,
          item.createdAt,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesDomain = !domainFilter || item.domain === domainFilter;
      const matchesSection = !sectionFilter || item.section === sectionFilter;
      const matchesQuestionType = !questionTypeFilter || item.questionType === questionTypeFilter;
      const matchesFromDate = !fromDate || item.createdAt >= fromDate;
      const matchesToDate = !toDate || item.createdAt <= toDate;

      return (
        matchesSearch &&
        matchesDomain &&
        matchesSection &&
        matchesQuestionType &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [data, search, domainFilter, sectionFilter, questionTypeFilter, fromDate, toDate]);

  const isViewMode = mode === "view";
  const activeSectionOptions = useMemo(() => getSectionOptions(domainFilter), [domainFilter]);

  useEffect(() => {
    if (sectionFilter && !activeSectionOptions.includes(sectionFilter)) {
      setSectionFilter(undefined);
    }
  }, [sectionFilter, activeSectionOptions]);

  function handleOpenAdd() {
    setMode("add");
    setSelectedRecord(null);
    form.resetFields();
    form.setFieldsValue({
      isReverse: "No",
      options: ["", ""],
    });
    setOpen(true);
  }

  function handleOpenView(record) {
    setMode("view");
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setOpen(true);
  }

  function handleOpenEdit(record) {
    setMode("edit");
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setMode("add");
    setSelectedRecord(null);
    form.resetFields();
  }

  function handleDelete(record) {
    setData((prev) => prev.filter((item) => item.id !== record.id));
    setSelectedRowKeys((prev) => prev.filter((key) => key !== record.id));
  }

  function handleBulkDelete() {
    setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
    setSelectedRowKeys([]);
  }

  function handleResetFilters() {
    setSearch("");
    setDomainFilter(undefined);
    setSectionFilter(undefined);
    setQuestionTypeFilter(undefined);
    setFromDate("");
    setToDate("");
    setSelectedRowKeys([]);
  }

  function handleSubmit(values) {
    const nextRecord = {
      ...values,
      options: (values.options || []).filter((option) => stripHtml(option)),
      isReverse: values.isReverse || "No",
      createdAt:
        mode === "edit" && selectedRecord ? selectedRecord.createdAt : new Date().toISOString().slice(0, 10),
    };

    if (mode === "edit" && selectedRecord) {
      setData((prev) =>
        prev.map((item) => (item.id === selectedRecord.id ? { ...item, ...nextRecord } : item))
      );
    } else {
      setData((prev) => [...prev, { id: `question-${Date.now()}`, ...nextRecord }]);
    }

    handleClose();
  }

  const columns = [
    {
      title: "SL",
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Domain",
      dataIndex: "domain",
      width: 150,
    },
    {
      title: "Section",
      dataIndex: "section",
      width: 180,
    },
    {
      title: "Question Type",
      dataIndex: "questionType",
      width: 130,
    },
    {
      title: "Question",
      width: 300,
      render: (_, record) => stripHtml(record.question) || "-",
    },
    {
      title: "Options",
      width: 260,
      render: (_, record) =>
        record.options?.map((option) => stripHtml(option)).filter(Boolean).join(", ") || "-",
    },
    {
      title: "Is Reverse",
      dataIndex: "isReverse",
      width: 110,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      width: 130,
    },
    {
      title: "Action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119]"
            icon={<EyeOutlined />}
            onClick={() => handleOpenView(record)}
          />
          <Button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119]"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this question?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">Psychometric Question Management</h2>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Questions</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Popconfirm
              title="Bulk delete?"
              description="Delete all selected questions?"
              okText="Yes"
              cancelText="No"
              onConfirm={handleBulkDelete}
              disabled={!selectedRowKeys.length}
            >
              <Button danger disabled={!selectedRowKeys.length}>
                Bulk Delete
              </Button>
            </Popconfirm>

            <Button
              onClick={handleResetFilters}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <ReloadOutlined />
              Reset
            </Button>

            <Button
              onClick={handleOpenAdd}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <PlusOutlined />
              Add Question
            </Button>
          </div>
        </div>

        <div className="mb-5 space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input
              placeholder="Search questions..."
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 rounded-md border-[#9a2119]"
            />

            <Select
              allowClear
              value={domainFilter}
              placeholder="Filter by Domain"
              onChange={(value) => {
                setDomainFilter(value);
                setSectionFilter(undefined);
              }}
            >
              {DOMAIN_OPTIONS.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>

            <Select
              allowClear
              value={sectionFilter}
              placeholder="Filter by Section"
              onChange={setSectionFilter}
              disabled={!domainFilter}
            >
              {activeSectionOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Select
              allowClear
              value={questionTypeFilter}
              placeholder="Filter by Question Type"
              onChange={setQuestionTypeFilter}
            >
              {QUESTION_TYPE_OPTIONS.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>

            <Input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="h-10 rounded-md border-[#9a2119]"
              placeholder="From Date"
            />

            <Input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="h-10 rounded-md border-[#9a2119]"
              placeholder="To Date"
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />
      </div>

      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        width={1100}
        destroyOnClose
        title={
          mode === "view"
            ? "View Question"
            : mode === "edit"
              ? "Edit Question"
              : "Add Question"
        }
      >
        <QuestionForm
          form={form}
          initialValues={selectedRecord}
          viewMode={isViewMode}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
}
