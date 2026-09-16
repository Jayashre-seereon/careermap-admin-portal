import { useMemo, useState,useEffect } from "react";
import { Button, Form, Modal, Popconfirm, Select, Table, Input } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {getAssessments, createAssessment, updateAssessment, deleteAssessment} from "../../api/assessment";
import { validationRules } from "../../utils/formValidation";
const { Option } = Select;

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function CareerForm({
  form,
  initialValues,
  viewMode,
  onSubmit,
  onCancel,
}) {
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
        name="title"
        label="Title"
        rules={[validationRules.required("Title")]}
      >
        <Input
          disabled={viewMode}
          placeholder="Enter assessment title"
        />
      </Form.Item>

      <Form.Item
        name="slug"
        label="Slug"
        rules={[validationRules.required("Slug")]}
      >
        <Input
          disabled={viewMode}
          placeholder="career-compass-test"
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        className="md:col-span-2"
        rules={[validationRules.required("Description")]}
      >
        <Input.TextArea
          disabled={viewMode}
          rows={4}
          placeholder="Enter assessment description"
        />
      </Form.Item>

      <Form.Item
        name="version"
        label="Version"
        rules={[validationRules.required("Version")]}
      >
        <Input
          disabled={viewMode}
          placeholder="1.0"
        />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[validationRules.required("Status")]}
      >
        <Select
          disabled={viewMode}
          placeholder="Select status"
        >
          <Option value="draft">Draft</Option>
          <Option value="published">Published</Option>
          <Option value="archived">Archived</Option>
        </Select>
      </Form.Item>

      <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
        <Button onClick={onCancel}>
          {viewMode ? "Back" : "Cancel"}
        </Button>

        {!viewMode && (
          <Button
            htmlType="submit"
            style={{
              background: "#9a2119",
              borderColor: "#9a2119",
            }}
            className="text-white"
          >
            {initialValues ? "Update Assessment" : "Create Assessment"}
          </Button>
        )}
      </div>
    </Form>
  );
}



export default function Assessment() {
  const [form] = Form.useForm();
 
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);


  useEffect(() => {
  loadAssessments();
}, []);

async function loadAssessments() {
  try {
    setLoading(true);

    const response = await getAssessments();

    if (response?.success) {
      setData(response.data || []);
    }
  } catch (error) {
    console.error("Failed to load assessments:", error);
  } finally {
    setLoading(false);
  }
}
  const filteredData = useMemo(() => {
  const query = search.trim().toLowerCase();

  if (!query) {
    return data;
  }

  return data.filter((item) =>
    [
      item.title,
      item.slug,
      item.description,
      item.version,
      item.status,
    ]
      .filter(Boolean)
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

 async function handleDelete(record) {
  try {
    const response = await deleteAssessment(record.id);

    if (response?.success) {
      await loadAssessments();
    }
  } catch (error) {
    console.error("Assessment delete failed:", error);
  }
}

async function handleSubmit(values) {
  try {
    const payload = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      version: values.version,
      status: values.status,
    };

    if (mode === "edit" && selectedRecord) {
      const response = await updateAssessment(
        selectedRecord.id,
        payload
      );

      if (response?.success) {
        await loadAssessments();
        handleClose();
      }
    } else {
      const response = await createAssessment(payload);

      if (response?.success) {
        await loadAssessments();
        handleClose();
      }
    }
  } catch (error) {
    console.error("Assessment save failed:", error);
  }
}
 const columns = [
  {
    title: "SL",
    width: 70,
    render: (_, __, index) => index + 1,
  },
  {
    title: "Title",
    dataIndex: "title",
    width: 250,
  },
  {
    title: "Slug",
    dataIndex: "slug",
    width: 220,
  },
  {
    title: "Description",
    dataIndex: "description",
    width: 350,
  },
  {
    title: "Version",
    dataIndex: "version",
    width: 100,
  },
  {
    title: "Status",
    dataIndex: "status",
    width: 130,
    render: (value) => (
      <span className="capitalize">
        {value}
      </span>
    ),
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
          description="Are you sure you want to delete this assessment?"
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
      <h2 className="text-xl font-bold text-[#9a2119]">Assessment Management</h2>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Assessments</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search assessments..."
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
              Add Assessment
            </Button>
          </div>
        </div>

       <Table
  columns={columns}
  dataSource={
    Array.isArray(filteredData)
      ? [...filteredData].reverse()
      : []
  }
  rowKey="id"
  loading={loading}
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
            ? "View Assessment"
            : mode === "edit"
              ? "Edit Assessment"
              : "Add Assessment"
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

