import { useMemo, useState } from "react";
import {
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
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getLanguages, saveLanguages } from "./languageStore";

const initialKeywordValues = {
  key: "",
  value: "",
};

export default function LanguageKeywordsPage() {
  const navigate = useNavigate();
  const { languageId } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [languages, setLanguages] = useState(() => getLanguages());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState(null);

  const language = useMemo(
    () => languages.find((item) => item.id === languageId),
    [languageId, languages]
  );

  const filteredKeywords = useMemo(() => {
    const query = search.trim().toLowerCase();
    const keywords = language?.keywords || [];

    if (!query) {
      return keywords;
    }

    return keywords.filter((item) =>
      [item.key, item.value].some((value) => value.toLowerCase().includes(query))
    );
  }, [language, search]);

  const persistLanguages = (nextLanguages) => {
    setLanguages(nextLanguages);
    saveLanguages(nextLanguages);
  };

  const handleAdd = () => {
    setEditingKeyword(null);
    form.setFieldsValue(initialKeywordValues);
    setModalOpen(true);
  };

  const handleEdit = (keyword) => {
    setEditingKeyword(keyword);
    form.setFieldsValue(keyword);
    setModalOpen(true);
  };

  const handleDelete = (keywordKey) => {
    const nextLanguages = languages.map((item) =>
      item.id === languageId
        ? {
            ...item,
            keywords: item.keywords.filter((keyword) => keyword.key !== keywordKey),
          }
        : item
    );

    persistLanguages(nextLanguages);
    messageApi.success("Keyword deleted successfully.");
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (!language) {
      return;
    }

    const trimmedKey = values.key.trim();
    const trimmedValue = values.value.trim();

    const existingKeyword = language.keywords.find((item) => {
      if (editingKeyword && item.key === editingKeyword.key) {
        return false;
      }

      return item.key.toLowerCase() === trimmedKey.toLowerCase();
    });

    if (existingKeyword) {
      messageApi.error("Keyword key already exists for this language.");
      return;
    }

    const nextLanguages = languages.map((item) => {
      if (item.id !== languageId) {
        return item;
      }

      if (editingKeyword) {
        return {
          ...item,
          keywords: item.keywords.map((keyword) =>
            keyword.key === editingKeyword.key
              ? { ...keyword, value: trimmedValue }
              : keyword
          ),
        };
      }

      return {
        ...item,
        keywords: [...item.keywords, { key: trimmedKey, value: trimmedValue }],
      };
    });

    persistLanguages(nextLanguages);
    setModalOpen(false);
    form.resetFields();
    messageApi.success(
      editingKeyword ? "Keyword updated successfully." : "Keyword added successfully."
    );
  };

  if (!language) {
    return (
      <div className="rounded-[24px] border border-[#f0d7d4] bg-white p-6 shadow-[0_18px_40px_rgba(154,33,25,0.06)]">
        {contextHolder}
        <h1 className="text-2xl font-bold text-[#9a2119]">Language not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The selected language could not be found in local storage.
        </p>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/language")}
          className="mt-5 border-none bg-[#9a2119] hover:!bg-[#c4392e]"
        >
          Back to Languages
        </Button>
      </div>
    );
  }

  const columns = [
    {
      title: <span className="font-semibold text-[#9a2119]">SL</span>,
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: <span className="font-semibold text-[#9a2119]">Key</span>,
      dataIndex: "key",
      render: (value) => <code className="text-sm font-semibold text-slate-700">{value}</code>,
    },
    {
      title: <span className="font-semibold text-[#9a2119]">Value</span>,
      dataIndex: "value",
      render: (value) => <span className="text-slate-600">{value}</span>,
    },
    {
      title: <span className="font-semibold text-[#9a2119]">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => handleEdit(record)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8a9a4] text-[#9a2119] transition hover:bg-[#fdf2f1]"
            title="Edit keyword"
          >
            <EditOutlined />
          </button>
          <Popconfirm
            title="Delete this keyword?"
            description="This translation value will be removed."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record.key)}
          >
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50"
              title="Delete keyword"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

     <section className="space-y-5">
       
     <h2 className="text-xl font-bold text-[#9a2119]">    <ArrowLeftOutlined  className="mr-2" onClick={() => navigate("/language")}/>
      
    Language Keywords
      </h2>
       <div className="bg-white p-5 rounded-2xl shadow-md border">
        
      <div className="flex justify-between mb-4">
             
        <h2 className="text-[#9a2119] font-semibold"> Language Keywords</h2>


            <div className="flex flex-wrap gap-3">
              <Input
                placeholder="Search keyword..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                prefix={<SearchOutlined className="text-[#9a2119]" />}
                className="h-10 w-64"
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setSearch("")}
                className="h-10 border-[#e8b9b4] text-[#9a2119] hover:!border-[#9a2119] hover:!text-[#9a2119]"
              >
                Reset
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                className="h-10 border-none bg-[#9a2119] px-4 hover:!bg-[#c4392e]"
              >
                Add Keyword
              </Button>
            </div>
          </div>

          <Table
            rowKey="key"
            columns={columns}
            dataSource={filteredKeywords}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 720 }}
            rowClassName="hover:bg-[#fff8f7]"
          />
        </div>
      </section>

      <Modal
        title={editingKeyword ? "Edit Keyword Value" : "Add Keyword"}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText={editingKeyword ? "Update" : "Create"}
        destroyOnClose
        okButtonProps={{ className: "!bg-[#9a2119] !shadow-none hover:!bg-[#c4392e]" }}
      >
        <Form form={form} layout="vertical" initialValues={initialKeywordValues} className="mt-4">
          <Form.Item
            label="Key"
            name="key"
            rules={[{ required: true, message: "Please enter the keyword key." }]}
          >
            <Input placeholder="Example: welcome_title" disabled={Boolean(editingKeyword)} />
          </Form.Item>

          <Form.Item
            label="Value"
            name="value"
            rules={[{ required: true, message: "Please enter the keyword value." }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter translation value"
              autoSize={{ minRows: 4, maxRows: 6 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
