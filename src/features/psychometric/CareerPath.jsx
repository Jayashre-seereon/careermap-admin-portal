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
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

const SECTION_OPTIONS = [
  "Realistic",
  "Investigative",
  "Artistic",
  "Social",
  "Enterprising",
  "Conventional",
  "Numerical Ability",
  "Logical Reasoning",
  "Visual",
  "Leadership",
];

const CAREER_OPTIONS = [
  "Doctor",
  "Engineer",
  "Teacher",
  "Designer",
  "Lawyer",
  "Psychologist",
  "Data Analyst",
  "Architect",
  "Entrepreneur",
  "Civil Services",
];

const INITIAL_DATA = [
  {
    id: "psychometric-career-path-1",
    sections: ["Investigative", "Logical Reasoning"],
    careers: ["Doctor", "Data Analyst"],
  },
  {
    id: "psychometric-career-path-2",
    sections: ["Artistic", "Visual"],
    careers: ["Designer", "Architect"],
  },
];

function CareerPathForm({ form, initialValues, viewMode, onSubmit, onCancel }) {
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
        name="sections"
        label="Sections"
        className="md:col-span-2"
        rules={[validationRules.required("Sections")]}
      >
        <Select
          mode="multiple"
          showSearch
          allowClear
          disabled={viewMode}
          placeholder="Select sections"
          optionFilterProp="children"
        >
          {SECTION_OPTIONS.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="careers"
        label="Careers"
        className="md:col-span-2"
        rules={[validationRules.required("Careers")]}
      >
        <Select
          mode="multiple"
          showSearch
          allowClear
          disabled={viewMode}
          placeholder="Select careers"
          optionFilterProp="children"
        >
          {CAREER_OPTIONS.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
        <Button onClick={onCancel}>{viewMode ? "Back" : "Cancel"}</Button>
        {!viewMode && (
          <Button
            htmlType="submit"
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            {initialValues ? "Update Career Path" : "Create Career Path"}
          </Button>
        )}
      </div>
    </Form>
  );
}

export default function CareerPath() {
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
      [...(item.sections || []), ...(item.careers || [])]
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
    const nextRecord = {
      sections: values.sections || [],
      careers: values.careers || [],
    };

    if (mode === "edit" && selectedRecord) {
      setData((prev) =>
        prev.map((item) => (item.id === selectedRecord.id ? { ...item, ...nextRecord } : item))
      );
    } else {
      setData((prev) => [...prev, { id: `psychometric-career-path-${Date.now()}`, ...nextRecord }]);
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
      title: "Sections",
      dataIndex: "sections",
      width: 320,
      render: (value) => (value?.length ? value.join(", ") : "-"),
    },
    {
      title: "Careers",
      dataIndex: "careers",
      width: 320,
      render: (value) => (value?.length ? value.join(", ") : "-"),
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
            description="Are you sure you want to delete this career path?"
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
      <h2 className="text-xl font-bold text-[#9a2119]">Career Path Management</h2>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Career Paths</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search career paths..."
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
              Add Career Path
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
        width={900}
        destroyOnClose
        title={
          mode === "view"
            ? "View Career Path"
            : mode === "edit"
              ? "Edit Career Path"
              : "Add Career Path"
        }
      >
        <CareerPathForm
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

