import { useMemo, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Select, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getValueFromInput, inputSanitizers, validationRules } from "../../utils/formValidation";

const { Option } = Select;

const INSTITUTION_OPTIONS = [
  "Career Map Institute",
  "Odisha Career School",
  "Future Vision Academy",
];

const INITIAL_DATA = [
  {
    id: "student-1",
    registerInstitution: "Career Map Institute",
    name: "Rahul Das",
    email: "rahul.das@example.com",
    age: "16",
    studentClass: "10",
    school: "DAV Public School",
    location: "Bhubaneswar",
    subjectsStream: "Science",
    careerAspiration: "Doctor",
    parentalOccupation: "Teacher",
  },
];

function StudentForm({ form, initialValues, viewMode, onSubmit, onCancel }) {
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
        name="registerInstitution"
        label="Register Institution"
        rules={[validationRules.required("Register institution")]}
      >
        <Select disabled={viewMode} placeholder="-- Select Institution --">
          {INSTITUTION_OPTIONS.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label="Name"
        rules={[validationRules.required("Name"), validationRules.maxLength(100, "Name")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter student name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[validationRules.required("Email"), validationRules.email("Email")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter email" />
      </Form.Item>

      <Form.Item
        name="age"
        label="Age"
        rules={[validationRules.required("Age"), validationRules.numbersOnly("Age")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.numbersOnly)}
      >
        <Input disabled={viewMode} placeholder="Enter age" maxLength={2} />
      </Form.Item>

      <Form.Item
        name="studentClass"
        label="Class"
        rules={[validationRules.required("Class"), validationRules.maxLength(50, "Class")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter class" />
      </Form.Item>

      <Form.Item
        name="school"
        label="School"
        rules={[validationRules.required("School"), validationRules.maxLength(150, "School")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter school name" />
      </Form.Item>

      <Form.Item
        name="location"
        label="Location"
        rules={[validationRules.required("Location"), validationRules.maxLength(150, "Location")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter location" />
      </Form.Item>

      <Form.Item
        name="subjectsStream"
        label="Subjects/Stream"
        rules={[
          validationRules.required("Subjects/Stream"),
          validationRules.maxLength(150, "Subjects/Stream"),
        ]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter subjects or stream" />
      </Form.Item>

      <Form.Item
        name="careerAspiration"
        label="Career Aspiration"
        rules={[
          validationRules.required("Career aspiration"),
          validationRules.maxLength(150, "Career aspiration"),
        ]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter career aspiration" />
      </Form.Item>

      <Form.Item
        name="parentalOccupation"
        label="Parental Occupation"
        className="md:col-span-2"
        rules={[
          validationRules.required("Parental occupation"),
          validationRules.maxLength(150, "Parental occupation"),
        ]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter parental occupation" />
      </Form.Item>

      <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
        <Button onClick={onCancel}>{viewMode ? "Back" : "Cancel"}</Button>
        {!viewMode && (
          <Button
            htmlType="submit"
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            {initialValues ? "Update Student" : "Create Student"}
          </Button>
        )}
      </div>
    </Form>
  );
}

export default function Student() {
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
        item.registerInstitution,
        item.name,
        item.email,
        item.age,
        item.studentClass,
        item.school,
        item.location,
        item.subjectsStream,
        item.careerAspiration,
        item.parentalOccupation,
      ]
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
      setData((prev) => [...prev, { id: `student-${Date.now()}`, ...values }]);
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
      title: "Institution",
      dataIndex: "registerInstitution",
      width: 190,
      render: (value) => value || "-",
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 170,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 220,
    },
    {
      title: "Age",
      dataIndex: "age",
      width: 90,
      render: (value) => value || "-",
    },
    {
      title: "Class",
      dataIndex: "studentClass",
      width: 110,
      render: (value) => value || "-",
    },
    {
      title: "School",
      dataIndex: "school",
      width: 180,
      render: (value) => value || "-",
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: "Subjects/Stream",
      dataIndex: "subjectsStream",
      width: 170,
      render: (value) => value || "-",
    },
    {
      title: "Career Aspiration",
      dataIndex: "careerAspiration",
      width: 180,
      render: (value) => value || "-",
    },
    {
      title: "Parental Occupation",
      dataIndex: "parentalOccupation",
      width: 180,
      render: (value) => value || "-",
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
            description="Are you sure you want to delete this student?"
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
      <h2 className="text-xl font-bold text-[#9a2119]">Student Management</h2>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Students</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search students..."
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
              Add Student
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
        width={980}
        destroyOnClose
        title={
          mode === "view"
            ? "View Student"
            : mode === "edit"
              ? "Edit Student"
              : "Add Student"
        }
      >
        <StudentForm
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
