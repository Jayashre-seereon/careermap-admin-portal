import { useMemo, useState } from "react";
import { Form, Input, Modal, Popconfirm, Select, Table, message } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { createQuestionId, getQuizzes, saveQuizzes } from "./quizStore";

const initialQuestionValues = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correctOption: 0,
};

export default function QuizQuestionsPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [quizzes, setQuizzes] = useState(() => getQuizzes());
  const [editingQuestion, setEditingQuestion] = useState(null);

  const quiz = useMemo(
    () => quizzes.find((item) => item.id === quizId),
    [quizId, quizzes]
  );

  const persistQuizzes = (nextQuizzes) => {
    setQuizzes(nextQuizzes);
    saveQuizzes(nextQuizzes);
  };

  const resetForm = () => {
    form.resetFields();
    form.setFieldsValue(initialQuestionValues);
  };

  const closeEditModal = () => {
    setEditingQuestion(null);
    editForm.resetFields();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (!quiz) {
      return;
    }

    const nextQuestion = {
      id: createQuestionId(),
      question: values.question,
      options: [values.option1, values.option2, values.option3, values.option4],
      correctOption: values.correctOption,
    };

    const nextQuizzes = quizzes.map((item) =>
      item.id === quizId
        ? { ...item, questions: [...item.questions, nextQuestion] }
        : item
    );

    persistQuizzes(nextQuizzes);
    message.success("Question added successfully.");
    resetForm();
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    editForm.setFieldsValue({
      question: question.question,
      option1: question.options[0],
      option2: question.options[1],
      option3: question.options[2],
      option4: question.options[3],
      correctOption: question.correctOption,
    });
  };

  const handleUpdate = async () => {
    if (!editingQuestion) {
      return;
    }

    const values = await editForm.validateFields();
    const nextQuestion = {
      id: editingQuestion.id,
      question: values.question,
      options: [values.option1, values.option2, values.option3, values.option4],
      correctOption: values.correctOption,
    };

    const nextQuizzes = quizzes.map((item) =>
      item.id === quizId
        ? {
            ...item,
            questions: item.questions.map((question) =>
              question.id === editingQuestion.id ? nextQuestion : question
            ),
          }
        : item
    );

    persistQuizzes(nextQuizzes);
    message.success("Question updated successfully.");
    closeEditModal();
  };

  const handleDelete = (questionId) => {
    const nextQuizzes = quizzes.map((item) =>
      item.id === quizId
        ? {
            ...item,
            questions: item.questions.filter((question) => question.id !== questionId),
          }
        : item
    );

    persistQuizzes(nextQuizzes);
    message.success("Question deleted successfully.");
  };

  if (!quiz) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-[#9a2119]">Quiz not found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The selected quiz could not be found.
        </p>
        <button
          onClick={() => navigate("/quiz")}
          className="mt-5 rounded-xl bg-[#9a2119] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b62b21]"
        >
          <ArrowLeftOutlined className="mr-2" />
          Back to Quiz
        </button>
      </div>
    );
  }

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Question</span>,
      dataIndex: "question",
      render: (question) => <span className="text-slate-700">{question}</span>,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Option 1</span>,
      render: (_, record) => (
        <span className={record.correctOption === 0 ? "font-semibold text-[#9a2119]" : "text-slate-600"}>
          {record.options[0]}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Option 2</span>,
      render: (_, record) => (
        <span className={record.correctOption === 1 ? "font-semibold text-[#9a2119]" : "text-slate-600"}>
          {record.options[1]}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Option 3</span>,
      render: (_, record) => (
        <span className={record.correctOption === 2 ? "font-semibold text-[#9a2119]" : "text-slate-600"}>
          {record.options[2]}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Option 4</span>,
      render: (_, record) => (
        <span className={record.correctOption === 3 ? "font-semibold text-[#9a2119]" : "text-slate-600"}>
          {record.options[3]}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Correct</span>,
      render: (_, record) => `Option ${record.correctOption + 1}`,
      width: 120,
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
            title="Edit question"
          >
            <EditOutlined />
          </button>
          <Popconfirm
            title="Delete this question?"
            description="This quiz question will be removed."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record.id)}
          >
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ff4d4f] bg-white text-[#ff4d4f] transition hover:bg-[#fff1f0]"
              title="Delete question"
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
      <div className="flex items-center gap-3">
      
        <div>
          <h2 className="text-xl font-bold text-[#9a2119]"> <ArrowLeftOutlined className="mr-2"  onClick={() => navigate("/quiz")}/>
      Add Question for the Quiz</h2>
          <p className="text-sm text-slate-500">{quiz.title}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialQuestionValues}
          className="space-y-1"
        >
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: "Please write the question." }]}
          >
            <Input.TextArea rows={4} placeholder="Write question here" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Option 1"
              name="option1"
              rules={[{ required: true, message: "Please enter option 1." }]}
            >
              <Input placeholder="Option 1" />
            </Form.Item>
            <Form.Item
              label="Option 2"
              name="option2"
              rules={[{ required: true, message: "Please enter option 2." }]}
            >
              <Input placeholder="Option 2" />
            </Form.Item>
            <Form.Item
              label="Option 3"
              name="option3"
              rules={[{ required: true, message: "Please enter option 3." }]}
            >
              <Input placeholder="Option 3" />
            </Form.Item>
            <Form.Item
              label="Option 4"
              name="option4"
              rules={[{ required: true, message: "Please enter option 4." }]}
            >
              <Input placeholder="Option 4" />
            </Form.Item>
          </div>

          <Form.Item
            label="Correct Option"
            name="correctOption"
            rules={[{ required: true, message: "Please select correct option." }]}
          >
            <Select
              options={[
                { label: "Option 1", value: 0 },
                { label: "Option 2", value: 1 },
                { label: "Option 3", value: 2 },
                { label: "Option 4", value: 3 },
              ]}
            />
          </Form.Item>
        </Form>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSubmit}
            className="rounded-xl bg-[#9a2119] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b62b21]"
          >
            <PlusOutlined className="mr-2" />
            Add Question
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
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#9a2119]">Question List</h3>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={quiz.questions}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 1300 }}
          rowClassName="hover:bg-[#fff8f7]"
        />
      </div>

      <Modal
        title={<span className="text-[#9a2119] font-semibold">Edit Question</span>}
        open={Boolean(editingQuestion)}
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
            label="Question"
            name="question"
            rules={[{ required: true, message: "Please write the question." }]}
          >
            <Input.TextArea rows={4} placeholder="Write question here" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Option 1"
              name="option1"
              rules={[{ required: true, message: "Please enter option 1." }]}
            >
              <Input placeholder="Option 1" />
            </Form.Item>
            <Form.Item
              label="Option 2"
              name="option2"
              rules={[{ required: true, message: "Please enter option 2." }]}
            >
              <Input placeholder="Option 2" />
            </Form.Item>
            <Form.Item
              label="Option 3"
              name="option3"
              rules={[{ required: true, message: "Please enter option 3." }]}
            >
              <Input placeholder="Option 3" />
            </Form.Item>
            <Form.Item
              label="Option 4"
              name="option4"
              rules={[{ required: true, message: "Please enter option 4." }]}
            >
              <Input placeholder="Option 4" />
            </Form.Item>
          </div>

          <Form.Item
            label="Correct Option"
            name="correctOption"
            rules={[{ required: true, message: "Please select correct option." }]}
          >
            <Select
              options={[
                { label: "Option 1", value: 0 },
                { label: "Option 2", value: 1 },
                { label: "Option 3", value: 2 },
                { label: "Option 4", value: 3 },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
