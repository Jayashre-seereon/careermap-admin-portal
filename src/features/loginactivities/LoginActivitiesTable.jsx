import { Table, Input, Tag, Button } from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
};

const getDeviceLabel = (record = {}) => {
  const device = record.device || "-";
  const browser = record.browser || "-";
  const os = record.os || "-";

  return `${device} / ${browser} / ${os}`;
};

export default function LoginActivitiesTable({
  data = [],
  loading,
  search,
  onSearch,
  onReset,
  onView,
}) {
  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">User ID</span>,
      dataIndex: "userId",
      width: 100,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Login Time</span>,
      dataIndex: "loginAt",
      width: 190,
      render: (value) => formatDateTime(value),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">IP Address</span>,
      dataIndex: "ipAddress",
      width: 150,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Location</span>,
      dataIndex: "location",
      width: 220,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Device</span>,
      width: 220,
      render: (_, record) => (
        <span className="text-sm text-slate-700">{getDeviceLabel(record)}</span>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      width: 120,
      render: () => <Tag color="green">Success</Tag>,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      width: 100,
      render: (_, record) => (
        <div className="flex justify-end">
          <Button
            onClick={() => onView(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
            title="View login details"
          >
            <EyeOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h1 className="mb-6 text-xl font-semibold text-[#9a2119]">
        Login Activities Management
      </h1>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Login Activities</h2>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Input
              placeholder="Search user id, ip, location..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
              onChange={(e) => onSearch(e.target.value)}
            />

            <Button
              onClick={onReset}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <ReloadOutlined />
              Reset
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 5 }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: "max-content" }}
          rowKey={(record) => record.id}
        />
      </div>
    </div>
  );
}
