import { Avatar, Button, Input, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

export default function MasterClassTable({
  data,
  loading,
  search,
  onSearch,
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const ellipsis = (text) => (
    <Tooltip title={text || "-"}>
      <span className="block max-w-[220px] truncate">{text || "-"}</span>
    </Tooltip>
  );

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
      width: 60,
      fixed: "left",
    },
    {
      title: "Image",
      dataIndex: "image",
      width: 90,
      render: (image) => (
        <Avatar
          src={image}
          size={44}
          shape="square"
          className="border border-[#9a2119]"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 200,
      render: ellipsis,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 180,
      render: ellipsis,
    },
    {
      title: "Time",
      dataIndex: "timeLabel",
      width: 120,
      render: (value) =>
        value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "-",
    },
    {
      title: "Views",
      dataIndex: "views",
      width: 100,
      render: (value) => value || "0",
    },
    {
      title: "Video URL",
      dataIndex: "videoUrl",
      width: 140,
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer" className="text-[#9a2119]">
            Visit
          </a>
        ) : (
          "-"
        ),
    },
   
    {
      title: "Category",
      dataIndex: "categoryLabel",
      width: 180,
      render: ellipsis,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      width: 120,
      render: (value) => (
        <Tag color={value ? "green" : "default"}>{value ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Action",
      align: "right",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
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
            description="Are you sure you want to delete this master class?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Master Class Management
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Master Classes</h2>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined />}
              className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Button
              onClick={() => onSearch("")}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <ReloadOutlined /> Reset
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
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1200 }}
        />
      </div>
    </div>
  );
}
