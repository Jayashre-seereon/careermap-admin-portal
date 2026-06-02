import { Table, Input, Button, Popconfirm, Tooltip } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const stripHtml = (text = "") => {
  const normalizedText = Array.isArray(text)
    ? text.join(", ")
    : typeof text === "string"
      ? text
      : text == null
        ? ""
        : String(text);

  return normalizedText
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export default function PlansTable({
  data = [],
  loading,
  onView,
  onEdit,
  onDelete,
  onAdd,
  search,
  onSearch,
}) {
  const handleReset = () => onSearch("");

  const ellipsis = (text) => (
    <Tooltip title={stripHtml(text) || "-"}>
      <span className="truncate block max-w-[220px]">{stripHtml(text) || "-"}</span>
    </Tooltip>
  );

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Plan Name</span>,
      dataIndex: "name",
      width: 180,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Features</span>,
      dataIndex: "features",
      width: 240,
      render: ellipsis,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Description</span>,
      dataIndex: "description",
      width: 240,
      render: ellipsis,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Validity</span>,
      dataIndex: "validity",
      width: 140,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Plan Type</span>,
      dataIndex: "plan_type",
      width: 150,
      render: (value) => value || "-",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Modules</span>,
      dataIndex: "modules",
      width: 240,
      render: (modules) =>
        Array.isArray(modules) && modules.length > 0
          ? modules.map((module) => module.title).join(", ")
          : "-",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Price</span>,
      dataIndex: "price",
      width: 120,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      width: 150,
      render: (_, record) => (
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => onView(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EyeOutlined />
          </Button>

          <Button
            onClick={() => onEdit(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this item?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete?.(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Plans Management
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Plans</h2>

          <div className="flex w-full flex-wrap items-center gap-4 sm:w-auto">
            <Input
              placeholder="Search plan..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
              onChange={(e) => onSearch(e.target.value)}
            />

            <Button
              onClick={handleReset}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <ReloadOutlined />
              Reset
            </Button>

            <Button
              onClick={onAdd}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              + Add
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={Array.isArray(data) ? [...data].reverse() : []}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}

