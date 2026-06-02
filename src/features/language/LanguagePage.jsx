import { useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createLanguageId, getLanguages, saveLanguages } from "./languageStore";
import { validationRules } from "../../utils/formValidation";

const initialFormValues = {
  name: "",
  code: "",
  type: "Not Default",
};

export default function LanguagePage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [languages, setLanguages] = useState(() => getLanguages());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);

  const filteredLanguages = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return languages;
    }

    return languages.filter((language) =>
      [language.name, language.code, language.type].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [languages, search]);

  const persistLanguages = (nextLanguages) => {
    setLanguages(nextLanguages);
    saveLanguages(nextLanguages);
  };

  const handleAdd = () => {
    setEditingLanguage(null);
    form.setFieldsValue(initialFormValues);
    setModalOpen(true);
  };

  const handleEdit = (language) => {
    setEditingLanguage(language);
    form.setFieldsValue({
      name: language.name,
      code: language.code,
      type: language.type,
    });
    setModalOpen(true);
  };

  const handleDelete = (record) => {
    const nextLanguages = languages.filter((language) => language.key !== record.key);
    persistLanguages(nextLanguages);
    messageApi.success(`${record.name} deleted successfully.`);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const trimmedName = values.name.trim();
    const trimmedCode = values.code.trim().toLowerCase();
    const nextType = values.type;

    const duplicate = languages.find((language) => {
      if (editingLanguage && language.key === editingLanguage.key) {
        return false;
      }

      return (
        language.name.toLowerCase() === trimmedName.toLowerCase() ||
        language.code.toLowerCase() === trimmedCode
      );
    });

    if (duplicate) {
      messageApi.error("Language name or code already exists.");
      return;
    }

    const normalizedLanguages = languages.map((language) => {
      if (nextType === "Default" && language.key !== editingLanguage?.key) {
        return { ...language, type: "Not Default" };
      }

      return language;
    });

    if (editingLanguage) {
      const nextLanguages = normalizedLanguages.map((language) =>
        language.key === editingLanguage.key
          ? {
              ...language,
              name: trimmedName,
              code: trimmedCode,
              type: nextType,
              id: createLanguageId(trimmedName, trimmedCode),
            }
          : language
      );

      persistLanguages(nextLanguages);
      messageApi.success("Language updated successfully.");
    } else {
      const nextLanguages = [
        ...normalizedLanguages,
        {
          key: `lang-${Date.now()}`,
          id: createLanguageId(trimmedName, trimmedCode),
          name: trimmedName,
          code: trimmedCode,
          type: nextType,
          keywords: [
            { key: "welcome_title", value: `${trimmedName} welcome text` },
            { key: "login_button", value: "Login" },
          ],
        },
      ];

      persistLanguages(nextLanguages);
      messageApi.success("Language added successfully.");
    }

    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: <span className="font-semibold text-[#9a2119]">SL</span>,
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: <span className="font-semibold text-[#9a2119]">Language Name</span>,
      dataIndex: "name",
      render: (name) => <span className="font-semibold text-slate-700">{name}</span>,
    },
    {
      title: <span className="font-semibold text-[#9a2119]">Language Code</span>,
      dataIndex: "code",
      render: (code) => (
        <code className="rounded-full bg-[#fdf2f1] px-3 py-1 text-[#9a2119]">{code}</code>
      ),
    },
    {
      title: <span className="font-semibold text-[#9a2119]">Language Type</span>,
      dataIndex: "type",
      render: (type) => (
        <Tag
          color={type === "Default" ? "green" : "default"}
          className="rounded-full px-3 py-1"
        >
          {type}
        </Tag>
      ),
    },
    {
      title: <span className="font-semibold text-[#9a2119]">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={() => navigate(`/language/${record.id}/keywords`)}
             className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md" 
          title="Language keywords"
          >
            <KeyOutlined />
          </Button>
          <Button
            type="button"
            onClick={() => handleEdit(record)}
             className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md" 
          title="Edit language"
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Delete this language?"
            description="Its mock keywords will also be removed."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} title="Delete language" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <section className="space-y-5">
       
     <h2 className="text-xl font-bold text-[#9a2119]">
     Manage Languages
      </h2>
      <div className="bg-white p-5 rounded-2xl shadow-md border">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-[#9a2119] font-semibold">Language List</h2>

            <div className="flex w-full flex-wrap gap-3 sm:w-auto">
              <Input
                placeholder="Search language..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="h-9 w-full rounded-md border-[#9a2119] sm:w-64"
            />
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setSearch("")}
                 className="flex h-9 items-center justify-center gap-2 rounded-md bg-[#9a2119] px-4 text-white transition hover:bg-[#c4392e]"
         >
                Reset
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{ background: "#9a2119", borderColor: "#9a2119" }}
                className="h-9"
         >
                Add Language
              </Button>
            </div>
          </div>

          <Table
            rowKey="key"
            columns={columns}
            dataSource={Array.isArray(filteredLanguages) ? [...filteredLanguages].reverse() : []}
            pagination={{ pageSize: 6 }}
            scroll={{ x: 760 }}
            
          />
        </div>
      </section>

      <Modal
        title={editingLanguage ? "Edit Language" : "Add Language"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText={editingLanguage ? "Update" : "Create"}
        destroyOnClose
        okButtonProps={{ className: "!bg-[#9a2119] !shadow-none hover:!bg-[#c4392e]" }}
      >
        <Form form={form} layout="vertical" initialValues={initialFormValues} className="mt-4">
          <Form.Item
            label="Language Name"
            name="name"
            rules={[{ required: true, message: "Please enter the language name." }]}
          >
            <Input placeholder="Enter language name" />
          </Form.Item>

          <Form.Item
            label="Language Code"
            name="code"
            rules={[
              validationRules.charactersOnly("Language Code")
            ]}
          >
            <Input placeholder="Example: en" />
          </Form.Item>

          <Form.Item
            label="Language Type"
            name="type"
            rules={[{ required: true, message: "Please select language type." }]}
          >
            <Select
              options={[
                { label: "Default", value: "Default" },
                { label: "Not Default", value: "Not Default" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

