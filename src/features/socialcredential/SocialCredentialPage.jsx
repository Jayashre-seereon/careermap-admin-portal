import { useMemo, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Table, Tag, message } from "antd";
import {
  EditOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";

const BRAND = "#9a2119";

const initialCredentials = [
  {
    key: "1",
    title: "Google",
    clientId: "103948572934-demo.apps.googleusercontent.com",
    clientSecret: "google-client-secret",
    callbackUrl: "https://admin.careermap.io/auth/google/callback",
    status: "Enabled",
  },
];

const helpSteps = [
  "Step 1: Go to google developer console",
  "Step 2: Click on Select a project than click on New Project and create a project providing the project name",
  "Step 3: Click on credentials",
  "Step 4: Click on create credentials and select OAuth client ID",
  "Step 5: Click on Configure Consent Screen",
  "Step 6: Choose External option and press the create button",
  "Step 7: Please fill up the required informations for app configuration",
  "Step 8: Again click on credentials and select type as web application and fill up the required informations. Also don't forget to add redirect url and press create button",
  "Step 9: Finally you've got the credentials. Please copy the Client ID and Client Secret and paste it in admin panel google configuration.",
];

export default function SocialCredentialPage() {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [search, setSearch] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);
  const [helpRecord, setHelpRecord] = useState(null);
  const [form] = Form.useForm();

  const filteredCredentials = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return credentials;
    return credentials.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.clientId.toLowerCase().includes(query)
    );
  }, [credentials, search]);

  const openEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      title: record.title,
      clientId: record.clientId,
      clientSecret: record.clientSecret,
      callbackUrl: record.callbackUrl,
    });
  };

  const closeEditModal = () => {
    setEditingRecord(null);
    form.resetFields();
  };

  const handleUpdateCredential = async () => {
    const values = await form.validateFields();
    setCredentials((current) =>
      current.map((item) =>
        item.key === editingRecord.key
          ? {
              ...item,
              title: values.title,
              clientId: values.clientId,
              clientSecret: values.clientSecret,
            }
          : item
      )
    );
    message.success("Credential updated successfully.");
    closeEditModal();
  };

  const handleToggleStatus = (record) => {
    const nextStatus = record.status === "Enabled" ? "Disabled" : "Enabled";
    setCredentials((current) =>
      current.map((item) =>
        item.key === record.key ? { ...item, status: nextStatus } : item
      )
    );
    message.success(`${record.title} is now ${nextStatus.toLowerCase()}.`);
  };

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Title</span>,
      dataIndex: "title",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Client ID</span>,
      dataIndex: "clientId",
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Enabled" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => {
        const nextStatus = record.status === "Enabled" ? "Disable" : "Enable";

        return (
          <div className="flex justify-end gap-2">
            <button onClick={() => openEditModal(record)} className="btn-action">
              <EditOutlined />
            </button>
            <Popconfirm
              title={`${nextStatus} credential?`}
              description={`Are you sure you want to ${nextStatus.toLowerCase()} ${record.title}?`}
              onConfirm={() => handleToggleStatus(record)}
              okText={nextStatus}
              cancelText="Cancel"
            >
              <button className="btn-action">
                <StopOutlined />
              </button>
            </Popconfirm>
            <button onClick={() => setHelpRecord(record)} className="btn-action">
              <QuestionCircleOutlined />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="w-full">
        <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
          Social Credential Management
        </h1>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex justify-between gap-3 mb-5">
            <h2 className="text-lg font-semibold text-[#9a2119]">
              Social Credential
            </h2>

            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="w-72 h-10 border-[#9a2119]"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredCredentials}
            pagination={{ pageSize: 5 }}
            rowClassName="hover:bg-gray-50"
            scroll={{ x: true }}
          />
        </div>
      </div>

      <Modal
        open={Boolean(editingRecord)}
        title={
          <span className="text-[#9a2119] font-semibold">
            Update Credential: {editingRecord?.title?.toLowerCase()}
          </span>
        }
        onCancel={closeEditModal}
        footer={[
          <Button key="cancel" onClick={closeEditModal}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleUpdateCredential}
            style={{ background: BRAND, borderColor: BRAND }}
          >
            Update
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="clientId"
            label="Client ID"
            rules={[{ required: true, message: "Client ID is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="clientSecret"
            label="Client Secret"
            rules={[{ required: true, message: "Client Secret is required" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="callbackUrl" label="Callback URL">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={Boolean(helpRecord)}
        title={
          <span className="text-[#9a2119] font-semibold">
            How to get credentials?
          </span>
        }
        onCancel={() => setHelpRecord(null)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setHelpRecord(null)}
            style={{ background: BRAND, borderColor: BRAND }}
          >
            Close
          </Button>,
        ]}
      >
        <div className="space-y-3 text-sm text-gray-700">
          {helpSteps.map((step) => (
            <p key={step} className="leading-6">
              {step}
            </p>
          ))}
        </div>
      </Modal>

      <style jsx>{`
        .btn-action {
          width: 36px;
          height: 36px;
          border: 1px solid #9a2119;
          color: #9a2119;
          border-radius: 6px;
          background: white;
        }
      `}</style>
    </>
  );
}
