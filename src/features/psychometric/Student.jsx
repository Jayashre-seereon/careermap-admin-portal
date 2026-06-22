import { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getValueFromInput, inputSanitizers, validationRules } from "../../utils/formValidation";
import { DATE_DISPLAY_FORMAT, formatDateDisplay, formatDateForPayload, parseDateValue } from "../../utils/date";
import { getInstitutes } from "../../api/institutions";
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "../../api/student";

const { Option } = Select;

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

const normalizeList = (response) => {
  const list = response?.data;
  if (Array.isArray(list)) return list;
  if (list && typeof list === "object") return [list];
  return [];
};

// Strip "+91" (or any leading +) so the input only ever shows the bare 10 digits
const stripCountryCode = (value) => {
  const text = (value || "").trim();
  if (!text) return "";
  return text.replace(/^\+91/, "").replace(/^\+/, "");
};

// Always re-add "+91" before sending to the backend
const formatMobileForPayload = (value) => {
  const digits = (value || "").trim();
  if (!digits) return "";
  return `+91${digits}`;
};

// backend -> frontend
const mapStudent = (item = {}) => ({
  id: item.id,
  registerInstitution: item.instituteId,
  firstName: item.firstName || "",
  lastName:item.lastName || "",
  username:item.username || "",
  email: item.email || "",
  mobile: stripCountryCode(item.mobile),
  gender: item.gender || undefined,
  dob: parseDateValue(item.dataOfBirth),
  address: item.address || "",
});

// frontend -> backend
// NOTE: backend key is "dataOfBirth" (confirmed from API response), not "dateOfBirth"
const buildStudentPayload = ({
  registerInstitution,
  firstName,
  lastName,
  username,
  email,
  mobile,
  gender,
  dob,
  address,
}) => ({
  instituteId: registerInstitution,
  firstName,
  lastName,
  username,
  email,
  mobile: formatMobileForPayload(mobile),
  gender,
  dataOfBirth: formatDateForPayload(dob),
  address,
});

function StudentForm({ form, initialValues, viewMode, onSubmit, onCancel, institutes, institutesLoading }) {
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
        <Select
          disabled={viewMode}
          loading={institutesLoading}
          placeholder="-- Select Institution --"
          showSearch
          optionFilterProp="children"
        >
          {institutes.map((institute) => (
            <Option key={institute.id} value={institute.id}>
              {institute.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="firstName"
        label="First Name"
        rules={[validationRules.required("First Name"), validationRules.maxLength(50, "First Name")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter first name" />
      </Form.Item>
        <Form.Item
        name="lastName"
        label="Last Name"
        rules={[validationRules.required("Last Name"), validationRules.maxLength(50, "Last Name")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter last name" />
      </Form.Item>
        <Form.Item
        name="username"
        label="User Name"
        rules={[validationRules.required("User Name"), validationRules.maxLength(50, "User Name")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input disabled={viewMode} placeholder="Enter user name" />
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
        name="mobile"
        label="Mobile"
        rules={[validationRules.required("Mobile"), validationRules.phone("Mobile")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.numbersOnly)}
      >
        <Input
          addonBefore="+91"
          disabled={viewMode}
          placeholder="Enter 10-digit mobile number"
          maxLength={10}
        />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        rules={[validationRules.required("Gender")]}
      >
        <Select disabled={viewMode} placeholder="-- Select Gender --">
          {GENDER_OPTIONS.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="dob"
        label="Date of Birth"
        rules={[validationRules.required("Date of birth")]}
      >
        <DatePicker
          className="w-full"
          disabled={viewMode}
          format={DATE_DISPLAY_FORMAT}
          placeholder="DD-MM-YYYY"
        />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        className="md:col-span-2"
        rules={[validationRules.required("Address"), validationRules.maxLength(300, "Address")]}
        getValueFromEvent={getValueFromInput(inputSanitizers.trim)}
      >
        <Input.TextArea disabled={viewMode} rows={4} placeholder="Enter address" />
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
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [institutes, setInstitutes] = useState([]);
  const [institutesLoading, setInstitutesLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents();
      setData(normalizeList(response).map(mapStudent));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load students."));
    } finally {
      setLoading(false);
    }
  };

  const loadInstitutes = async () => {
    try {
      setInstitutesLoading(true);
      const response = await getInstitutes();
      setInstitutes(normalizeList(response));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load institutions."));
    } finally {
      setInstitutesLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
    loadInstitutes();
  }, []);

  const institutionName = (id) => institutes.find((inst) => inst.id === id)?.name || "-";

  const filteredData = data.filter((item) =>
    [
      institutionName(item.registerInstitution),
      item.firstName,
      item.lastName,
      item.username,
      item.email,
      item.mobile,
      item.gender,
      formatDateDisplay(item.dob),
      item.address,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

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
      await deleteStudent(record.id);
      messageApi.success("Student deleted successfully.");
      await loadStudents();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete student."));
    }
  }

  async function handleSubmit(values) {
    try {
      const payload = buildStudentPayload(values);

      if (mode === "edit" && selectedRecord) {
        await updateStudent(selectedRecord.id, payload);
        messageApi.success("Student updated successfully.");
      } else {
        await createStudent(payload);
        messageApi.success("Student created successfully.");
      }

      handleClose();
      await loadStudents();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit" ? "Failed to update student." : "Failed to create student."
        )
      );
    }
  }

  const columns = [
    { title: "SL", width: 70, render: (_, __, index) => index + 1 },
    {
      title: "Institution",
      dataIndex: "registerInstitution",
      width: 190,
      render: (value) => institutionName(value),
    },
    { title: "First Name", dataIndex: "firstName", width: 150 },
    {title:"Last Name", dataIndex:"lastName",width:150},
    {title:"User Name", dataIndex:"username",width:150},
    { title: "Email", dataIndex: "email", width: 220 },
    {
      title: "Mobile",
      dataIndex: "mobile",
      width: 150,
      render: (value) => (value ? `+91${value}` : "-"),
    },
    { title: "Gender", dataIndex: "gender", width: 100, render: (v) => v || "-" },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      width: 140,
      render: (value) => formatDateDisplay(value),
    },
    { title: "Address", dataIndex: "address", width: 220, render: (v) => v || "-" },
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
      {contextHolder}
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
          dataSource={Array.isArray(filteredData) ? [...filteredData].reverse() : []}
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
        width={800}
        destroyOnClose
        title={mode === "view" ? "View Student" : mode === "edit" ? "Edit Student" : "Add Student"}
      >
        <StudentForm
          form={form}
          initialValues={selectedRecord}
          viewMode={isViewMode}
          onSubmit={handleSubmit}
          onCancel={handleClose}
          institutes={institutes}
          institutesLoading={institutesLoading}
        />
      </Modal>
    </div>
  );
}