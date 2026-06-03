import { useMemo, useState } from "react";
import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import { EditOutlined, EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { formatStatusClasses, formatStatusLabel, normalizeStatus } from "./supportTicketsUtils";

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Answered", value: "answered" },
  { label: "Closed", value: "closed" },
];

export default function SupportTicketsTable({ title, data, loading, onUpdateStatus }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredData = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return (Array.isArray(data) ? data : []).filter(
      (item) =>
        `${item.subject} ${item.email} ${item.openedBy} ${item.status}`
          .toLowerCase()
          .includes(normalizedSearch)
    );
  }, [data, search]);

  const openStatusModal = (record) => {
    setSelectedTicket(record);
    form.setFieldsValue({ status: normalizeStatus(record.status) });
    setEditOpen(true);
  };

  const handleStatusUpdate = async (values) => {
    if (!selectedTicket) {
      return;
    }

    try {
      setSubmitting(true);
      await onUpdateStatus?.(selectedTicket.id, values.status);
      setEditOpen(false);
      setSelectedTicket(null);
      form.resetFields();
    } catch (error) {
      messageApi.error(error.response?.data?.message || error.message || "Failed to update ticket status.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Subject</span>,
      dataIndex: "subject",
      width: 320,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Opened By</span>,
      dataIndex: "openedBy",
      width: 180,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      dataIndex: "status",
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${formatStatusClasses(status)}`}>
          {formatStatusLabel(status)}
        </span>
      ),
      width: 130,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      width: 160,
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => navigate(`/support_tickets/${record.id}`)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EyeOutlined />
          </Button>
          <Button
            onClick={() => openStatusModal(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EditOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      {contextHolder}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">{title}</h2>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search ticket..."
            value={search}
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            onClick={() => setSearch("")}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(filteredData) ? [...filteredData].reverse() : []}
        loading={loading}
        pagination={{ pageSize: 5 }}
        rowClassName="hover:bg-gray-50"
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Update Ticket Status"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setSelectedTicket(null);
          form.resetFields();
        }}
        destroyOnClose
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setEditOpen(false);
              setSelectedTicket(null);
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            loading={submitting}
            onClick={() => form.submit()}
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
          >
            Update
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form} onFinish={handleStatusUpdate}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status." }]}
          >
            <Select
              placeholder="Select status"
              options={STATUS_OPTIONS}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

