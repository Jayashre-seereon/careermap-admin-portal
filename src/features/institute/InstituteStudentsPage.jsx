import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Tag,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  DownloadOutlined,
  EyeOutlined,
  SearchOutlined,
  UploadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useSessionStore } from "../../store/sessionStore";
import { getInstituteDashboard } from "../../api/instituteDashboard";
import {
  bulkUploadInstituteStudents,
  createInstituteStudent,
  deleteInstituteStudent,
  getInstituteStudents,
  updateInstituteStudent,
} from "../../api/instituteStudents";

const rowsFrom = (response) => Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
const messageFrom = (response, fallback) => response?.message || fallback;
const STUDENT_FIELDS = [
  ["firstName", "First Name", true],
  ["lastName", "Last Name"],
  ["username", "Username"],
  ["email", "Email", true],
  ["mobile", "Mobile", true],
];

export default function InstituteStudentsPage() {
  const institute = useSessionStore((state) => state.user);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const fileInputRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [seatInfo, setSeatInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [error, setError] = useState("");
  const [seatError, setSeatError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [bulkResult, setBulkResult] = useState(null);

  useEffect(() => {
    const studentRecord = editingStudent || viewingStudent;
    if (!modalOpen || !studentRecord) return;
    form.setFieldsValue({
      ...studentRecord,
      mobile: String(studentRecord.mobile || "").replace(/\D/g, "").slice(-10),
    });
  }, [editingStudent, form, modalOpen, viewingStudent]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [studentsResponse, dashboardResponse] = await Promise.all([
        getInstituteStudents(),
        getInstituteDashboard(),
      ]);
      if (studentsResponse?.success === false) throw new Error(messageFrom(studentsResponse, "Could not load students."));
      if (dashboardResponse?.success === false) throw new Error(messageFrom(dashboardResponse, "Could not load seat information."));
      setStudents(rowsFrom(studentsResponse));
      setSeatInfo(dashboardResponse?.data || dashboardResponse || {});
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Could not load institute student information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  const totalStudents = Number(seatInfo?.totalStudents ?? seatInfo?.studentCount ?? students.length);
  const studentLimit = Number(seatInfo?.studentLimit ?? 0);
  const availableSeats = Number(seatInfo?.availableSeats ?? Math.max(0, studentLimit - totalStudents));
  const limitReached = availableSeats === 0;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => !query || [
      student.firstName,
      student.lastName,
      student.fullName,
      student.username,
      student.email,
      student.mobile,
      student.class,
      student.stream,
    ].filter(Boolean).join(" ").toLowerCase().includes(query));
  }, [students, search]);

  const startAdd = () => {
    setEditingStudent(null);
    setViewingStudent(null);
    form.resetFields();
    setSeatError("");
    setModalOpen(true);
  };

  const startEdit = (student) => {
    setViewingStudent(null);
    setEditingStudent(student);
    setSeatError("");
    setModalOpen(true);
  };

  const startView = (student) => {
    setEditingStudent(null);
    setViewingStudent(student);
    setSeatError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStudent(null);
    setViewingStudent(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setSeatError("");
    form.setFields([{ name: "email", errors: [] }]);
    const payload = {
      ...values,
      mobile: String(values.mobile || "").replace(/\D/g, "").slice(-10),
    };
    delete payload.instituteId;
    delete payload.password;
    delete payload.gender;
    delete payload.country;
    delete payload.state;
    delete payload.city;
    delete payload.district;
    delete payload.address;
    if (editingStudent) delete payload.email;
    try {
      const result = editingStudent
        ? await updateInstituteStudent(editingStudent.id, payload)
        : await createInstituteStudent(payload);

      if (result?.success === false) {
        const backendMessage = messageFrom(result, "Student operation failed.");
        if (/email already exists/i.test(backendMessage)) {
          form.setFields([{ name: "email", errors: [backendMessage] }]);
        }
        if (/student limit reached/i.test(backendMessage)) {
          setSeatError(backendMessage);
          setSeatInfo((current) => ({
            ...current,
            studentLimit: result.limit ?? current?.studentLimit,
            totalStudents: result.used ?? current?.totalStudents,
            availableSeats: 0,
          }));
        }
        messageApi.error(backendMessage);
        return;
      }

      if (editingStudent) {
        messageApi.success(messageFrom(result, "Student updated successfully."));
      } else {
        messageApi.success("Student added. Login password has been sent to their email.");
      }
      closeModal();
      await refreshData();
    } catch (err) {
      const backendMessage = err?.response?.data?.message || err.message || "Student operation failed.";
      if (/email already exists/i.test(backendMessage)) {
        form.setFields([{ name: "email", errors: [backendMessage] }]);
      }
      if (err?.response?.status === 403) {
        setSeatError(backendMessage);
        messageApi.error(backendMessage);
        if (/student limit/i.test(backendMessage)) {
          setSeatInfo((current) => ({
            ...current,
            studentLimit: err.response.data?.limit ?? current?.studentLimit,
            totalStudents: err.response.data?.used ?? current?.totalStudents,
            availableSeats: 0,
          }));
        }
      } else if (err?.response?.status === 404) {
        messageApi.error(err?.response?.data?.message || "Student not found in this institute.");
      } else {
        messageApi.error(backendMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (student) => {
    try {
      const result = await deleteInstituteStudent(student.id);
      if (result?.success === false) {
        messageApi.error(messageFrom(result, "Could not delete student."));
        return;
      }
      messageApi.success(messageFrom(result, "Student deleted successfully."));
      await refreshData();
    } catch (err) {
      messageApi.error(err?.response?.data?.message || err.message || "Could not delete student.");
    }
  };

  const handleBulkFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!/\.xlsx$/i.test(file.name)) {
      messageApi.error("Please select an .xlsx file.");
      return;
    }
    setBulkLoading(true);
    setSeatError("");
    try {
      const result = await bulkUploadInstituteStudents(file);
      if (result?.success === false) {
        const backendMessage = messageFrom(result, "Bulk upload failed.");
        if (/student limit/i.test(backendMessage)) {
          setSeatError(backendMessage);
          setSeatInfo((current) => ({ ...current, availableSeats: 0 }));
        }
        messageApi.error(backendMessage);
        return;
      }
      setBulkResult(result);
      messageApi.success(`${result.created ?? 0} of ${result.total ?? 0} students added, ${result.failed ?? 0} failed.`);
      await refreshData();
    } catch (err) {
      const backendMessage = err?.response?.data?.message || err.message || "Bulk upload failed.";
      if (err?.response?.status === 403) {
        setSeatError(backendMessage);
        if (/student limit/i.test(backendMessage)) {
          setSeatInfo((current) => ({
            ...current,
            studentLimit: err.response.data?.limit ?? current?.studentLimit,
            totalStudents: err.response.data?.used ?? current?.totalStudents,
            availableSeats: 0,
          }));
        }
      }
      messageApi.error(backendMessage);
    } finally {
      setBulkLoading(false);
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/institute-students-template.xlsx";
    link.download = "institute-students-template.xlsx";
    link.click();
  };

  const columns = [
    { title: "Register Institution", key: "institute", render: () => institute?.name || "—" },
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, student) => <div className="flex gap-2">
        <Button aria-label={`View ${student.firstName || "student"}`} icon={<EyeOutlined />} onClick={() => startView(student)} className="!border-[#8f2218] !text-[#8f2218] hover:!border-[#a6291d] hover:!text-[#a6291d]" />
        <Button aria-label={`Edit ${student.firstName || "student"}`} icon={<EditOutlined />} onClick={() => startEdit(student)} className="!border-[#8f2218] !text-[#8f2218] hover:!border-[#a6291d] hover:!text-[#a6291d]" />
        <Popconfirm title="Delete this student?" description="This will free one institute seat." okText="Delete" okButtonProps={{ danger: true }} onConfirm={() => handleDelete(student)}>
          <Button danger aria-label={`Delete ${student.firstName || "student"}`} icon={<DeleteOutlined />} />
        </Popconfirm>
      </div>,
    },
  ];

  return <section className="space-y-5">
    {contextHolder}
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="text-2xl font-bold text-[#8f2218]">Psychometric Students</h2><p className="mt-1 text-sm text-slate-500">Manage students registered with your institute.</p></div>
      <Tag color={limitReached ? "red" : "processing"} className="!m-0 !rounded-full !px-4 !py-2 !text-sm !font-semibold">{totalStudents} / {studentLimit} students used</Tag>
    </div>

    {limitReached && <Alert type="warning" showIcon message="Student limit reached. Contact admin to increase the limit." />}
    {seatError && <Alert type="error" showIcon closable onClose={() => setSeatError("")} message={seatError} />}
    {error && <Alert type="error" showIcon message={error} />}

    <div className="rounded-2xl border border-[#eaded8] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="font-semibold text-slate-700">{students.length} students</div>
        <div className="flex flex-wrap items-center gap-2">
          <Input allowClear prefix={<SearchOutlined />} placeholder="Search students" value={search} onChange={(event) => setSearch(event.target.value)} className="sm:w-56" />
          <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>Download sample template</Button>
          <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleBulkFile} />
          <Button icon={<UploadOutlined />} loading={bulkLoading} disabled={limitReached || bulkLoading} onClick={() => fileInputRef.current?.click()}>Bulk Upload</Button>
          <Button type="primary" icon={<UserAddOutlined />} className="!bg-[#8f2218]" disabled={limitReached} onClick={startAdd}>Add Student</Button>
        </div>
      </div>
      <Table rowKey="id" columns={columns} dataSource={filtered} loading={loading} pagination={{ pageSize: 10, showSizeChanger: true }} scroll={{ x: 1000 }} />
    </div>

    {bulkResult && <div className="rounded-2xl border border-[#eaded8] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800">Bulk upload results</h3>
        <Button type="text" onClick={() => setBulkResult(null)}>Dismiss</Button>
      </div>
      <Alert type={Number(bulkResult.failed) ? "warning" : "success"} showIcon message={`${bulkResult.created ?? 0} of ${bulkResult.total ?? 0} added, ${bulkResult.failed ?? 0} failed`} />
      {!!bulkResult.failedRecords?.length && <Table className="mt-4" rowKey={(row, index) => `${row.email}-${index}`} pagination={false} size="small" dataSource={bulkResult.failedRecords} columns={[{ title: "Email", dataIndex: "email", key: "email" }, { title: "Reason", dataIndex: "reason", key: "reason" }]} />}
    </div>}

    <Modal open={modalOpen} onCancel={closeModal} footer={null} destroyOnClose title={viewingStudent ? "Student Details" : editingStudent ? "Edit Student" : "Add Student"}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={Boolean(viewingStudent)}>
        <div className="grid gap-x-4 md:grid-cols-2">
          <Form.Item label="Register Institution">
            <Input value={institute?.name || "Institute"} readOnly disabled={Boolean(viewingStudent)} />
          </Form.Item>
          {STUDENT_FIELDS.map(([name, label, required]) => (
            <Form.Item key={name} name={name} label={label} rules={[
              ...(required ? [{ required: true, message: `${label} is required.` }] : []),
              ...(name === "email" ? [{ type: "email", message: "Enter a valid email address." }] : []),
              ...(name === "mobile" ? [{ pattern: /^\d{10}$/, message: "Enter a valid 10-digit mobile number." }] : []),
            ]}>
              {name === "mobile"
                ? <Input addonBefore="+91" maxLength={10} readOnly={name === "email" && Boolean(editingStudent)} />
                : <Input readOnly={name === "email" && Boolean(editingStudent)} />}
            </Form.Item>
          ))}
        </div>
        {seatError && <Alert className="mb-4" type="error" showIcon message={seatError} />}
        <div className="flex justify-end gap-2">
          {viewingStudent ? <Button onClick={closeModal}>Close</Button> : <>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting} disabled={limitReached && !editingStudent} className="!bg-[#8f2218]">{editingStudent ? "Save Changes" : "Add Student"}</Button>
          </>}
        </div>
      </Form>
    </Modal>
  </section>;
}
