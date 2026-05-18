import { useMemo, useState } from "react";
import { Button, Form, Modal, Popconfirm, Select, Table, Input } from "antd";
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

const { Option } = Select;

const CAREER_CATEGORY_OPTIONS = [
  "Investigative",
  "Artistic",
  "Social",
  "Enterprising",
  "Conventional",
  "Realistic",
];

const INITIAL_DATA = [
  {
    id: "career-1",
    categories: ["Investigative", "Social"],
    careers: "<p>Doctor, Clinical Psychologist, Research Scientist</p>",
  },
  {
    id: "career-2",
    categories: ["Artistic", "Enterprising"],
    careers: "<p>Graphic Designer, Creative Director, Content Strategist</p>",
  },
];

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function CareerForm({ form, initialValues, viewMode, onSubmit, onCancel }) {
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
        name="categories"
        label="Career Categories"
        className="md:col-span-2"
        rules={[validationRules.required("Career Categories")]}
      >
        <Select
          mode="multiple"
          showSearch
          allowClear
          disabled={viewMode}
          placeholder="Select categories"
          optionFilterProp="children"
        >
          {CAREER_CATEGORY_OPTIONS.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="careers"
        label="Add Careers"
        className="md:col-span-2"
        rules={[
          validationRules.required("Add Careers"),
          {
            validator: (_, value) =>
              stripHtml(value)
                ? Promise.resolve()
                : Promise.reject(new Error("Add Careers is required.")),
          },
        ]}
      >
        <RichTextEditor disabled={viewMode} placeholder="Add careers" height={180} />
      </Form.Item>

      <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
        <Button onClick={onCancel}>{viewMode ? "Back" : "Cancel"}</Button>
        {!viewMode && (
          <Button
            htmlType="submit"
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            {initialValues ? "Update Career" : "Create Career"}
          </Button>
        )}
      </div>
    </Form>
  );
}

export default function Career() {
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
      [...(item.categories || []), stripHtml(item.careers)].join(" ").toLowerCase().includes(query)
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
    const nextRecord = {
      categories: values.categories || [],
      careers: values.careers || "",
    };

    if (mode === "edit" && selectedRecord) {
      setData((prev) =>
        prev.map((item) => (item.id === selectedRecord.id ? { ...item, ...nextRecord } : item))
      );
    } else {
      setData((prev) => [...prev, { id: `career-${Date.now()}`, ...nextRecord }]);
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
      title: "Career Categories",
      dataIndex: "categories",
      width: 260,
      render: (value) => (value?.length ? value.join(", ") : "-"),
    },
    {
      title: "Add Careers",
      dataIndex: "careers",
      width: 420,
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
            description="Are you sure you want to delete this career?"
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
      <h2 className="text-xl font-bold text-[#9a2119]">Career Management</h2>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Careers</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search careers..."
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
              Add Career
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
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
            ? "View Career"
            : mode === "edit"
              ? "Edit Career"
              : "Add Career"
        }
      >
        <CareerForm
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
