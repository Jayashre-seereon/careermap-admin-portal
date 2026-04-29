import { useMemo, useState } from "react";
import { Form, Input, message, Modal, Popconfirm, Select, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createQuizId, getQuizzes, saveQuizzes } from "./quizStore";

const initialValues = {
  title: "",
  type: "Mock",
  from: "",
  to: "",
  duration: "",
};

export default function QuizPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [quizzes, setQuizzes] = useState(() => getQuizzes());
  const [editingQuiz, setEditingQuiz] = useState(null);

  const persistQuizzes = (nextQuizzes) => {
    setQuizzes(nextQuizzes);
    saveQuizzes(nextQuizzes);
  };

  const quizCount = useMemo(() => quizzes.length, [quizzes]);

  const resetForm = () => {
    form.resetFields();
    form.setFieldsValue(initialValues);
  };

  const closeEditModal = () => {
    setEditingQuiz(null);
    editForm.resetFields();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const nextQuizId = createQuizId();
    const nextQuiz = {
      key: nextQuizId,
      id: nextQuizId,
      title: values.title,
      type: values.type,
      from: values.from,
      to: values.to,
      duration: values.duration,
      questions: [],
    };

    persistQuizzes([...quizzes, nextQuiz]);
    message.success("Quiz added successfully.");
    resetForm();
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

    const values = await editForm.validateFields();
    const nextQuizzes = quizzes.map((quiz) =>
      quiz.id === editingQuiz.id ? { ...quiz, ...values } : quiz
    );

    persistQuizzes(nextQuizzes);
    message.success("Quiz updated successfully.");
    closeEditModal();
  };

  const handleDelete = (quizId) => {
    const nextQuizzes = quizzes.filter((quiz) => quiz.id !== quizId);
    persistQuizzes(nextQuizzes);
    message.success("Quiz deleted successfully.");
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
      render: (_, record) => (
        <button
          onClick={() => navigate(`/quiz/${record.id}/questions`)}
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
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => handleEdit(record)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d7d7d7] bg-white text-[#222] transition hover:border-[#9a2119] hover:text-[#9a2119]"
            title="Edit quiz"
          >
            <EditOutlined />
          </button>
          <Popconfirm
            title="Delete this quiz?"
            description="All quiz questions will also be removed."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record.id)}
          >
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ff4d4f] bg-white text-[#ff4d4f] transition hover:bg-[#fff1f0]"
              title="Delete quiz"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">Quiz Management</h2>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-[#9a2119]">Add Quiz</h3>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5"
        >
          <Form.Item
            label="Quiz Title"
            name="title"
            rules={[{ required: true, message: "Please enter quiz title." }]}
          >
            <Input placeholder="Quiz Title" />
          </Form.Item>

          <Form.Item
            label="Quiz Type"
            name="type"
            rules={[{ required: true, message: "Please select quiz type." }]}
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
            rules={[{ required: true, message: "Please enter duration." }]}
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

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-[#9a2119] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b62b21]"
          >
            <PlusOutlined className="mr-2" />
            Add Quiz
          </button>
          <button
            onClick={resetForm}
            className="rounded-xl border border-[#d7d7d7] bg-white px-5 py-2.5 text-sm font-semibold text-[#222] transition hover:border-[#9a2119] hover:text-[#9a2119]"
          >
            <ReloadOutlined className="mr-2" />
            Reset
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#9a2119]">Quiz List</h3>
          <div className="rounded-full bg-[#fdf2f1] px-4 py-2 text-sm font-semibold text-[#9a2119]">
            Total Quiz: {quizCount}
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={quizzes}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 900 }}
          rowClassName="hover:bg-[#fff8f7]"
        />
      </div>

      <Modal
        title={<span className="text-[#9a2119] font-semibold">Edit Quiz</span>}
        open={Boolean(editingQuiz)}
        onCancel={closeEditModal}
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
        <Form form={editForm} layout="vertical" className="mt-4">
          <Form.Item
            label="Quiz Title"
            name="title"
            rules={[{ required: true, message: "Please enter quiz title." }]}
          >
            <Input placeholder="Quiz Title" />
          </Form.Item>

          <Form.Item
            label="Quiz Type"
            name="type"
            rules={[{ required: true, message: "Please select quiz type." }]}
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
              rules={[{ required: true, message: "Please enter duration." }]}
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
    </section>
  );
}
