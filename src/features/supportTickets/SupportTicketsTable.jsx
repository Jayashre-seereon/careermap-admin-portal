import { useMemo, useState } from "react";
import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import { EditOutlined, EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate, useOutletContext } from "react-router-dom";
import { formatStatusClasses, formatStatusLabel, normalizeStatus } from "./supportTicketsUtils";
import { getSerialNumber } from "../../utils/slNo";
const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Answered", value: "answered" },
  { label: "Closed", value: "closed" },
];
const STATUS_FILTER_OPTIONS = [
  { label: "All statuses", value: "all" },
  ...STATUS_OPTIONS,
  { label: "Other", value: "other" },
];

export default function SupportTicketsTable({ title, data, loading, onUpdateStatus, showStatusFilter = false }) {
  const navigate = useNavigate();
  // Search / page / status filter are lifted into the SupportTickets parent
  // (via Outlet context) so they survive switching between status tabs.
  const shared = useOutletContext();
  const [localSearch, setLocalSearch] = useState("");
  const [localPagination, setLocalPagination] = useState({ current: 1, pageSize: 10 });
  const [localStatus, setLocalStatus] = useState("all");
  const search = shared?.search ?? localSearch;
  const setSearch = shared?.setSearch ?? setLocalSearch;
  const pagination = shared?.pagination ?? localPagination;
  const setPagination = shared?.setPagination ?? setLocalPagination;
  const statusFilter = shared?.statusFilter ?? localStatus;
  const setStatusFilter = shared?.setStatusFilter ?? setLocalStatus;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const filteredData = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const activeStatus = showStatusFilter ? statusFilter : "all";

    return (Array.isArray(data) ? data : []).filter((item) => {
      if (activeStatus !== "all" && normalizeStatus(item.status) !== activeStatus) return false;
      if (!normalizedSearch) return true;
      return [item.id, item.subject, item.email, item.openedBy].some((field) =>
        String(field ?? "").toLowerCase().includes(normalizedSearch)
      );
    });
  }, [data, search, statusFilter, showStatusFilter]);

  const resetPage = () => setPagination((prev) => ({ ...prev, current: 1 }));

  const openStatusModal = (record) => {
    setSelectedTicket(record);
    const current = normalizeStatus(record.status);
    form.setFieldsValue({ status: STATUS_OPTIONS.some((option) => option.value === current) ? current : undefined });
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
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => getSerialNumber(index, pagination),
      width: 70,
    },
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
      render: (status, record) => (
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${formatStatusClasses(status)}`}>
          {normalizeStatus(status) === "other" && record?.rawStatus ? record.rawStatus : formatStatusLabel(status)}
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
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          />

          {showStatusFilter && (
            <Select
              value={statusFilter}
              onChange={(value) => { setStatusFilter(value); resetPage(); }}
              options={STATUS_FILTER_OPTIONS}
              style={{ minWidth: 140 }}
            />
          )}

          <Button
            onClick={() => { setSearch(""); setStatusFilter("all"); resetPage(); }}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(filteredData) ? filteredData : []}
        loading={loading}
        pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100] }}
        onChange={(pag) => setPagination(pag)}
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

