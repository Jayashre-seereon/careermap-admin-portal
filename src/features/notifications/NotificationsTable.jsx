import { Button, Input, Popconfirm, Table, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const stripHtml = (text = "") =>
  String(text || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getTagColor = (value = "") => {
  const normalized = value.toLowerCase();

  if (normalized === "sent" || normalized === "active") return "green";
  if (normalized === "pending") return "gold";
  if (normalized === "failed" || normalized === "inactive") return "red";
  return "blue";
};

export default function NotificationsTable({
  data = [],
  loading,
  search,
  onSearch,
  onAdd,
  onView,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Title</span>,
      dataIndex: "title",
      width: 220,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Message</span>,
      dataIndex: "message",
      width: 320,
      ellipsis: true,
      render: (value) => stripHtml(value) || "-",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Target</span>,
      dataIndex: "target",
      width: 160,
      ellipsis: true,
    },
   
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            className="border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          />
          <Button
            className="border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this notification?"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl shadow-md border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Notifications</h2>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search notification..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="w-full sm:w-72 h-8 rounded-md border-[#9a2119]"
          />

          <Button
            onClick={() => onSearch("")}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>

          <Button
            onClick={onAdd}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add Notification
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
