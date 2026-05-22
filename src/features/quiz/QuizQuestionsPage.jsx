import { useEffect, useMemo, useState } from "react";
import { Form, Input, Modal, Popconfirm, Select, Table, message, Button } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { validationRules } from "../../utils/formValidation";
import {
  createQuizQuestion,
  deleteQuizQuestion,
  getQuizById,
  getQuizQuestions,
  updateQuizQuestion,
} from "../../api/quiz";
import { useLocation } from "react-router-dom";

const initialQuestionValues = {
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correctOption: 0,
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

const mapQuiz = (item = {}) => ({
  ...item,
  id: item.id,
  title: item.title || "",
});

const mapQuestion = (item = {}) => {
  const options = Array.isArray(item.options) ? item.options : [];
  const correctOption = options.findIndex((option) => option?.isCorrect);

  return {
    ...item,
    id: item.id,
    question: item.question || "",
    quizId: item.quizId,
    options,
    optionTexts: [
      options[0]?.text || "",
      options[1]?.text || "",
      options[2]?.text || "",
      options[3]?.text || "",
    ],
    correctOption: correctOption >= 0 ? correctOption : 0,
  };
};

const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

const sanitizeText = (value) => `${value || ""}`.trim();

export default function QuizQuestionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [quiz, setQuiz] = useState(() =>
    location.state?.quiz ? mapQuiz(location.state.quiz) : null
  );
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadQuiz = async () => {
    try {
      const response = await getQuizById(quizId);
      const nextQuiz = response?.data || response;
      setQuiz(nextQuiz ? mapQuiz(nextQuiz) : null);
    } catch (error) {
      setQuiz(null);
      messageApi.error(getApiErrorMessage(error, "Failed to load quiz."));
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await getQuizQuestions(quizId);
      const questionList = Array.isArray(response?.data?.questions)
        ? response.data.questions
        : Array.isArray(response?.questions)
          ? response.questions
          : [];
      const nextQuestions = questionList.map(mapQuestion);
      setQuestions(nextQuestions);
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load questions."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
    loadQuestions();
  }, [quizId]);

  const filteredQuestions = useMemo(
    () =>
      questions.filter((question) =>
        `${question.question} ${question.optionTexts.join(" ")} Option ${question.correctOption + 1}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [questions, search]
  );

  const resetForm = () => {
    form.resetFields();
    form.setFieldsValue(initialQuestionValues);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    resetForm();
  };

  const closeEditModal = () => {
    setEditingQuestion(null);
    editForm.resetFields();
  };

  const buildQuestionPayload = (values) => {
    const resolvedQuizId = Number(quiz?.id ?? quizId);
    const correctOption = Number(values.correctOption);

    return {
      quizId: resolvedQuizId,
      question: sanitizeText(values.question),
      options: [
        sanitizeText(values.option1),
        sanitizeText(values.option2),
        sanitizeText(values.option3),
        sanitizeText(values.option4),
      ],
      correctOption,
    };
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!quiz) {
        return;
      }

      const payload = buildQuestionPayload(values);

      if (!Number.isInteger(payload.quizId)) {
        messageApi.error("Invalid quiz id.");
        return;
      }

      await createQuizQuestion(payload);
      messageApi.success("Question added successfully.");
      closeAddModal();
      await loadQuestions();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }

      messageApi.error(getApiErrorMessage(error, "Failed to add question."));
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    editForm.setFieldsValue({
      question: question.question,
      option1: question.optionTexts[0],
      option2: question.optionTexts[1],
      option3: question.optionTexts[2],
      option4: question.optionTexts[3],
      correctOption: question.correctOption,
    });
  };

  const handleUpdate = async () => {
    if (!editingQuestion) {
      return;
    }

    try {
      const values = await editForm.validateFields();
      const payload = buildQuestionPayload(values);

      if (!Number.isInteger(payload.quizId)) {
        messageApi.error("Invalid quiz id.");
        return;
      }

      await updateQuizQuestion(editingQuestion.id, payload);
      messageApi.success("Question updated successfully.");
      closeEditModal();
      await loadQuestions();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }

      messageApi.error(getApiErrorMessage(error, "Failed to update question."));
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await deleteQuizQuestion(questionId);
      messageApi.success("Question deleted successfully.");
      await loadQuestions();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete question."));
    }
  };

  if (!quiz) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {contextHolder}
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
          {record.optionTexts[0]}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Option 2</span>,
      render: (_, record) => (
        <span className={record.correctOption === 1 ? "font-semibold text-[#9a2119]" : "text-slate-600"}>
          {record.optionTexts[1]}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Option 3</span>,
      render: (_, record) => (
        <span className={record.correctOption === 2 ? "font-semibold text-[#9a2119]" : "text-slate-600"}>
          {record.optionTexts[2]}
        </span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Option 4</span>,
      render: (_, record) => (
        <span className={record.correctOption === 3 ? "font-semibold text-[#9a2119]" : "text-slate-600"}>
          {record.optionTexts[3]}
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
          <Button
            type="button"
            onClick={() => handleEdit(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
            title="Edit question"
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete this question?"
            description="This quiz question will be removed."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              danger
              type="button"
              className="w-8 h-8 border border-red-500 text-red-500 hover:bg-red-50"
              title="Delete question"
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
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#9a2119]">
            <ArrowLeftOutlined className="mr-2" onClick={() => navigate("/quiz")} />
            Add Question for the Quiz
          </h2>
          <p className="text-sm text-slate-500">{quiz.title}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[#9a2119]">Question List</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              placeholder="Search question..."
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
              + Add Questions
            </Button>
          </div>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredQuestions}
          loading={loading}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 1300 }}
          rowClassName="hover:bg-[#fff8f7]"
        />
      </div>

      <Modal
        title={<span className="text-[#9a2119] font-semibold">Add Question</span>}
        open={isAddModalOpen}
        onCancel={closeAddModal}
        destroyOnHidden
        footer={[
          <Button
            key="reset"
            onClick={closeAddModal}
            className=" border border-[#9a2119]  px-5 py-2 text-sm font-semibold text-[#9a2119] "
          >
            Cancel
          </Button>,
          <Button
            key="add"
            onClick={handleSubmit}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add Question
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialQuestionValues}
          validateTrigger={["onChange", "onBlur"]}
          className="mt-4 space-y-1"
        >
          <Form.Item
            label="Question"
            name="question"
            rules={[validationRules.required("Question")]}
          >
            <Input.TextArea rows={4} placeholder="Write question here" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Option 1"
              name="option1"
              rules={[validationRules.required("Option 1")]}
            >
              <Input placeholder="Option 1" />
            </Form.Item>
            <Form.Item
              label="Option 2"
              name="option2"
              rules={[validationRules.required("Option 2")]}
            >
              <Input placeholder="Option 2" />
            </Form.Item>
            <Form.Item
              label="Option 3"
              name="option3"
              rules={[validationRules.required("Option 3")]}
            >
              <Input placeholder="Option 3" />
            </Form.Item>
            <Form.Item
              label="Option 4"
              name="option4"
              rules={[validationRules.required("Option 4")]}
            >
              <Input placeholder="Option 4" />
            </Form.Item>
          </div>

          <Form.Item
            label="Correct Option"
            name="correctOption"
            rules={[validationRules.required("Correct option")]}
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

      <Modal
        title={<span className="text-[#9a2119] font-semibold">Edit Question</span>}
        open={Boolean(editingQuestion)}
        onCancel={closeEditModal}
        destroyOnHidden
        footer={[
          <Button
            key="cancel"
            onClick={closeEditModal}
            className=" border border-[#9a2119]  px-5 py-2 text-sm font-semibold text-[#9a2119] "
          >
            Cancel
          </Button>,
          <Button
            key="update"
            onClick={handleUpdate}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            Update
          </Button>,
        ]}
      >
        <Form form={editForm} layout="vertical" validateTrigger={["onChange", "onBlur"]} className="mt-4">
          <Form.Item
            label="Question"
            name="question"
            rules={[validationRules.required("Question")]}
          >
            <Input.TextArea rows={4} placeholder="Write question here" />
          </Form.Item>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Option 1"
              name="option1"
              rules={[validationRules.required("Option 1")]}
            >
              <Input placeholder="Option 1" />
            </Form.Item>
            <Form.Item
              label="Option 2"
              name="option2"
              rules={[validationRules.required("Option 2")]}
            >
              <Input placeholder="Option 2" />
            </Form.Item>
            <Form.Item
              label="Option 3"
              name="option3"
              rules={[validationRules.required("Option 3")]}
            >
              <Input placeholder="Option 3" />
            </Form.Item>
            <Form.Item
              label="Option 4"
              name="option4"
              rules={[validationRules.required("Option 4")]}
            >
              <Input placeholder="Option 4" />
            </Form.Item>
          </div>

          <Form.Item
            label="Correct Option"
            name="correctOption"
            rules={[validationRules.required("Correct option")]}
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
