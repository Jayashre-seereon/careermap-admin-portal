import { useMemo, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function CareerCategoryForm({ form, initialValues, viewMode, onSubmit, onCancel }) {
  const editorRule = (label) => [
    validationRules.required(label),
    {
      validator: (_, value) =>
        stripHtml(value)
          ? Promise.resolve()
          : Promise.reject(new Error(`${label} is required.`)),
    },
  ];

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
        name="name"
        label="Career Category Name"
        className="md:col-span-2"
        rules={editorRule("Career Category Name")}
      >
        <RichTextEditor disabled={viewMode} placeholder="Enter career category name" height={150} />
      </Form.Item>

      <Form.Item
        name="hook"
        label="Hook"
        className="md:col-span-2"
        rules={editorRule("Hook")}
      >
        <RichTextEditor disabled={viewMode} placeholder="Enter hook" height={150} />
      </Form.Item>

      <Form.Item
        name="whatIsIt"
        label="What is it?"
        className="md:col-span-2"
        rules={editorRule("What is it?")}
      >
        <RichTextEditor disabled={viewMode} placeholder="Enter what is it?" height={170} />
      </Form.Item>

      <Form.Item
        name="exampleRoles"
        label="Example roles"
        className="md:col-span-2"
        rules={editorRule("Example roles")}
      >
        <RichTextEditor disabled={viewMode} placeholder="Enter example roles" height={170} />
      </Form.Item>

      <Form.Item
        name="subjects"
        label="Subjects"
        className="md:col-span-2"
        rules={editorRule("Subjects")}
      >
        <RichTextEditor disabled={viewMode} placeholder="Enter subjects" height={170} />
      </Form.Item>

      <Form.Item
        name="coreAptitudes"
        label="Core aptitudes to highlight"
        className="md:col-span-2"
        rules={editorRule("Core aptitudes to highlight")}
      >
        <RichTextEditor
          disabled={viewMode}
          placeholder="Enter core aptitudes to highlight"
          height={170}
        />
      </Form.Item>

      <Form.Item
        name="valueAndPersonalityEdge"
        label="Value and personality edge"
        className="md:col-span-2"
        rules={editorRule("Value and personality edge")}
      >
        <RichTextEditor
          disabled={viewMode}
          placeholder="Enter value and personality edge"
          height={170}
        />
      </Form.Item>

      <Form.Item
        name="whyItCouldFitYou"
        label="Why it could fit you"
        className="md:col-span-2"
        rules={editorRule("Why it could fit you")}
      >
        <RichTextEditor
          disabled={viewMode}
          placeholder="Enter why it could fit you"
          height={170}
        />
      </Form.Item>

      <Form.Item
        name="earlyActions"
        label="Early actions"
        className="md:col-span-2"
        rules={editorRule("Early actions")}
      >
        <RichTextEditor disabled={viewMode} placeholder="Enter early actions" height={170} />
      </Form.Item>

      <Form.Item
        name="indiaStudyPathways"
        label="India study pathways"
        className="md:col-span-2"
        rules={editorRule("India study pathways")}
      >
        <RichTextEditor
          disabled={viewMode}
          placeholder="Enter India study pathways"
          height={170}
        />
      </Form.Item>

      <Form.Item
        name="futureTrends"
        label="Future trends"
        className="md:col-span-2"
        rules={editorRule("Future trends")}
      >
        <RichTextEditor disabled={viewMode} placeholder="Enter future trends" height={170} />
      </Form.Item>

      <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
        <Button onClick={onCancel}>{viewMode ? "Back" : "Cancel"}</Button>
        {!viewMode && (
          <Button
            htmlType="submit"
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            {initialValues ? "Update Career Category" : "Create Career Category"}
          </Button>
        )}
      </div>
    </Form>
  );
}

const INITIAL_DATA = [
  {
    id: "career-category-1",
    name: "<p>Investigative</p>",
    hook: "<p>Think deeply and solve problems</p>",
    whatIsIt: "<p>People in this category enjoy research, analysis, and understanding how things work.</p>",
    exampleRoles: "<p>Doctor, Scientist, Data Analyst</p>",
    subjects: "<p>Biology, Mathematics, Physics</p>",
    coreAptitudes: "<p>Analytical thinking, observation, problem solving</p>",
    valueAndPersonalityEdge: "<p>Curious, detail-oriented, enjoys discovering patterns</p>",
    whyItCouldFitYou: "<p>It may fit you if you enjoy asking why and exploring answers deeply.</p>",
    earlyActions: "<p>Join science clubs, solve case studies, read research-based articles</p>",
    indiaStudyPathways: "<p>Science stream, entrance exams, professional degrees and research programs</p>",
    futureTrends: "<p>Growth in health tech, AI research, biotech, and data-driven careers</p>",
  },
  {
    id: "career-category-2",
    name: "<p>Artistic</p>",
    hook: "<p>Create, imagine, and express</p>",
    whatIsIt: "<p>People in this category like creative work, design, storytelling, and visual expression.</p>",
    exampleRoles: "<p>Designer, Writer, Animator</p>",
    subjects: "<p>Fine Arts, Design, Literature, Media Studies</p>",
    coreAptitudes: "<p>Creativity, imagination, visual thinking, expression</p>",
    valueAndPersonalityEdge: "<p>Original, expressive, open-minded, idea-driven</p>",
    whyItCouldFitYou: "<p>It may fit you if you like turning ideas into visuals, words, or experiences.</p>",
    earlyActions: "<p>Build a portfolio, join workshops, create projects and share them</p>",
    indiaStudyPathways: "<p>Design schools, media studies, fine arts, communication programs</p>",
    futureTrends: "<p>Increasing demand in digital media, UX, content creation, and creative tech</p>",
  },
];

export default function CareerCategory() {
  const [form] = Form.useForm();
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data.filter((item) =>
      [
        item.name,
        item.hook,
        item.whatIsIt,
        item.exampleRoles,
        item.subjects,
        item.coreAptitudes,
        item.valueAndPersonalityEdge,
        item.whyItCouldFitYou,
        item.earlyActions,
        item.indiaStudyPathways,
        item.futureTrends,
      ]
        .map((value) => stripHtml(value))
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [data, search]);

  const isViewMode = mode === "view";

  function handleOpenAdd() {
    setMode("add");
    setSelectedRecord(null);
    form.resetFields();
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
  }

  function handleSubmit(values) {
    if (mode === "edit" && selectedRecord) {
      setData((prev) =>
        prev.map((item) => (item.id === selectedRecord.id ? { ...item, ...values } : item))
      );
    } else {
      setData((prev) => [...prev, { id: `career-category-${Date.now()}`, ...values }]);
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
      title: "Name",
      dataIndex: "name",
      width: 180,
      render: (value) => stripHtml(value) || "-",
    },
    {
      title: "Hook",
      dataIndex: "hook",
      width: 240,
      render: (value) => stripHtml(value) || "-",
    },
    {
      title: "What is it?",
      dataIndex: "whatIsIt",
      width: 320,
      render: (value) => stripHtml(value) || "-",
    },
    {
      title: "Example roles",
      dataIndex: "exampleRoles",
      width: 280,
      render: (value) => stripHtml(value) || "-",
    },
    {
      title: "Actions",
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
            description="Are you sure you want to delete this career category?"
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
      <h2 className="text-xl font-bold text-[#9a2119]">Career Category Management</h2>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Career Categories</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search career categories..."
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
            />

            <Button
              onClick={() => setSearch("")}
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
              Add Career Category
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={Array.isArray(filteredData) ? [...filteredData].reverse() : []}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        width={950}
        destroyOnClose
        title={
          mode === "view"
            ? "View Career Category"
            : mode === "edit"
              ? "Edit Career Category"
              : "Add Career Category"
        }
      >
        <CareerCategoryForm
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

