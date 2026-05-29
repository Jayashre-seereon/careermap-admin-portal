import { useEffect, useMemo, useState } from "react";
import { Form, Input, message, Modal, Popconfirm, Select, Table, Button } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { validationRules } from "../../utils/formValidation";
import {
  createQuiz,
  deleteQuiz,
  getQuizzes,
  getQuizAttempts,
  updateQuiz,
} from "../../api/quiz";

const initialValues = {
  title: "",
  type: "Mock",
  from: "",
  to: "",
  duration: "",
};

const normalizeList = (response) => {
  const list = response?.data;

  if (Array.isArray(list)) {
    return list;
  }

  if (list && typeof list === "object") {
    return [list];
  }

  return [];
};

const formatDateForInput = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString().split("T")[0];
};

const mapQuiz = (item = {}) => ({
  ...item,
  id: item.id,
  key: item.id,
  title: item.title || "",
  type: item.type || "",
  from: formatDateForInput(item.from),
  to: formatDateForInput(item.to),
  duration: item.duration ?? "",
  attemptsCount: item._count?.attempts ?? item.attemptsCount ?? 0,
  participants: Array.isArray(item.participants) ? item.participants : [],
});

const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

export default function QuizPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQuizAttempts, setSelectedQuizAttempts] = useState(null);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await getQuizzes();
      setQuizzes(normalizeList(response).map(mapQuiz));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load quizzes."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const quizCount = useMemo(() => quizzes.length, [quizzes]);
  const filteredQuizzes = useMemo(
    () =>
      quizzes.filter((quiz) =>
        `${quiz.title} ${quiz.type} ${quiz.from} ${quiz.to} ${quiz.duration}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [quizzes, search]
  );

  const resetForm = () => {
    form.resetFields();
    form.setFieldsValue(initialValues);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    resetForm();
  };

  const closeEditModal = () => {
    setEditingQuiz(null);
    editForm.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createQuiz(values);
      messageApi.success("Quiz added successfully.");
      closeAddModal();
      await loadQuizzes();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }

      messageApi.error(getApiErrorMessage(error, "Failed to add quiz."));
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    editForm.setFieldsValue({
      title: quiz.title,
      type: quiz.type,
      from: quiz.from,
      to: quiz.to,
      duration: quiz.duration,
    });
  };

  const handleUpdate = async () => {
    if (!editingQuiz) {
      return;
    }

    try {
      const values = await editForm.validateFields();
      await updateQuiz(editingQuiz.id, values);
      messageApi.success("Quiz updated successfully.");
      closeEditModal();
      await loadQuizzes();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }

      messageApi.error(getApiErrorMessage(error, "Failed to update quiz."));
    }
  };

  const handleDelete = async (quizId) => {
    try {
      await deleteQuiz(quizId);
      messageApi.success("Quiz deleted successfully.");
      await loadQuizzes();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete quiz."));
    }
  };

  const handleOpenAttempts = async (quiz) => {
    try {
      setSelectedQuizAttempts({
        quiz,
        totalUsers: quiz.attemptsCount || 0,
        data: [],
      });
      setAttemptsLoading(true);

      const response = await getQuizAttempts(quiz.id);
      setSelectedQuizAttempts({
        quiz,
        totalUsers: response?.totalUsers ?? quiz.attemptsCount ?? 0,
        data: Array.isArray(response?.data) ? response.data : [],
      });
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load quiz attempts."));
      setSelectedQuizAttempts(null);
    } finally {
      setAttemptsLoading(false);
    }
  };

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Title</span>,
      dataIndex: "title",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Type</span>,
      dataIndex: "type",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">From</span>,
      dataIndex: "from",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">To</span>,
      dataIndex: "to",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Add</span>,
      width: 160,
      render: (_, record) => (
        <button
          onClick={() =>
            navigate(`/quiz/${record.id}/questions`, {
              state: { quiz: record },
            })
          }
          className="rounded-xl bg-[#9a2119] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b62b21]"
        >
          Add Question
        </button>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Duration</span>,
      dataIndex: "duration",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Attempts</span>,
      render: (_, record) => {
        const attemptsCount = record.attemptsCount || 0;

        return (
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#fdf2f1] px-3 py-1 text-xs font-semibold text-[#9a2119]">
              {attemptsCount}
            </span>
            <Button
              type="button"
              onClick={() => handleOpenAttempts(record)}
              className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
              title="View quiz attempts"
            >
              <UserOutlined />
            </Button>
          </div>
        );
      },
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={() => handleEdit(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
            title="Edit quiz"
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete this quiz?"
            description="All quiz questions will also be removed."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="button"
              className="w-8 h-8 border border-red-500 text-red-500 hover:bg-red-50"
              title="Delete quiz"
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-5">
      {contextHolder}
      <h2 className="text-xl font-bold text-[#9a2119]">
        Quiz Management 
      </h2>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#9a2119]">Quiz List</h3>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              placeholder="Search quiz..."
              className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
            />
            <Button
              onClick={() => setSearch("")}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <ReloadOutlined />
              Reset
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              + Add Quiz
            </Button>
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredQuizzes}
          loading={loading}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 900 }}
          rowClassName="hover:bg-[#fff8f7]"
        />
      </div>

      <Modal
        title={<span className="text-[#9a2119] font-semibold">Add Quiz</span>}
        open={isAddModalOpen}
        onCancel={closeAddModal}
        destroyOnHidden
        footer={[
          <button
            key="reset"
            onClick={resetForm}
            className="rounded-xl border border-[#d7d7d7] bg-white px-5 py-2 text-sm font-semibold text-[#222] transition hover:border-[#9a2119] hover:text-[#9a2119]"
          >
            <ReloadOutlined className="mr-2" />
            Reset
          </button>,
          <button
            key="submit"
            onClick={handleSubmit}
            className="rounded-xl bg-[#9a2119] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b62b21]"
          >
            <PlusOutlined className="mr-2" />
            Add Quiz
          </button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          validateTrigger={["onChange", "onBlur"]}
          className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Form.Item
            label="Quiz Title"
            name="title"
            rules={[validationRules.required("Quiz title")]}
          >
            <Input placeholder="Quiz Title" />
          </Form.Item>

          <Form.Item
            label="Quiz Type"
            name="type"
            rules={[validationRules.required("Quiz type")]}
          >
            <Select
              options={[
                { label: "Live", value: "Live" },
                { label: "Mock", value: "Mock" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[validationRules.required("Duration")]}
          >
            <Input placeholder="30 Minutes" />
          </Form.Item>

          <Form.Item
            label="From"
            name="from"
            rules={[{ required: true, message: "Please select start date." }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="To"
            name="to"
            rules={[{ required: true, message: "Please select end date." }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<span className="text-[#9a2119] font-semibold">Edit Quiz</span>}
        open={Boolean(editingQuiz)}
        onCancel={closeEditModal}
        destroyOnHidden
        footer={[
          <button
            key="cancel"
            onClick={closeEditModal}
            className="rounded-xl border border-[#d7d7d7] bg-white px-5 py-2 text-sm font-semibold text-[#222] transition hover:border-[#9a2119] hover:text-[#9a2119]"
          >
            Cancel
          </button>,
          <button
            key="update"
            onClick={handleUpdate}
            className="rounded-xl bg-[#9a2119] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#b62b21]"
          >
            Update
          </button>,
        ]}
      >
        <Form form={editForm} layout="vertical" validateTrigger={["onChange", "onBlur"]} className="mt-4">
          <Form.Item
            label="Quiz Title"
            name="title"
            rules={[validationRules.required("Quiz title")]}
          >
            <Input placeholder="Quiz Title" />
          </Form.Item>

          <Form.Item
            label="Quiz Type"
            name="type"
            rules={[validationRules.required("Quiz type")]}
          >
            <Select
              options={[
                { label: "Live", value: "Live" },
                { label: "Mock", value: "Mock" },
              ]}
            />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Form.Item
              label="Duration"
              name="duration"
              rules={[validationRules.required("Duration")]}
            >
              <Input placeholder="30 Minutes" />
            </Form.Item>

            <Form.Item
              label="From"
              name="from"
              rules={[{ required: true, message: "Please select start date." }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              label="To"
              name="to"
              rules={[{ required: true, message: "Please select end date." }]}
            >
              <Input type="date" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <Modal
        title={
          <span className="text-[#9a2119] font-semibold">
            Quiz Attempts{selectedQuizAttempts ? ` - ${selectedQuizAttempts.quiz.title}` : ""}
          </span>
        }
        open={Boolean(selectedQuizAttempts)}
        onCancel={() => setSelectedQuizAttempts(null)}
        footer={null}
        destroyOnHidden
        width={720}
      >
        <Table
          rowKey="id"
          loading={attemptsLoading}
          pagination={false}
          dataSource={selectedQuizAttempts?.data || []}
          locale={{ emptyText: "No users have taken this quiz yet." }}
          columns={[
            {
              title: <span className="text-[#9a2119] font-semibold">User Name</span>,
              render: (_, record) =>
                `${record?.user?.firstName || ""} ${record?.user?.lastName || ""}`.trim() ||
                "-",
            },
            {
              title: <span className="text-[#9a2119] font-semibold">Email</span>,
              render: (_, record) => record?.user?.email || "-",
            },
            {
              title: <span className="text-[#9a2119] font-semibold">Correct</span>,
              dataIndex: "correctAnswers",
              width: 100,
            },
            {
              title: <span className="text-[#9a2119] font-semibold">Score</span>,
              dataIndex: "score",
              width: 110,
            },
            {
              title: <span className="text-[#9a2119] font-semibold">Attended On</span>,
              dataIndex: "attendedOn",
              width: 140,
              render: (_, record) => {
                const value = record?.attemptedAt || record?.attendedOn;
                return value ? new Date(value).toLocaleString() : "-";
              },
            },
          ]}
        />
      </Modal>
    </section>
  );
}
