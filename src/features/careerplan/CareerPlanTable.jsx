import { Table, Input, Tooltip, Button, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export default function CareerPlanTable({
  data = [],
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  const ellipsis = (text) => (
    <Tooltip title={text}>
      <span className="truncate block max-w-[220px]">{text}</span>
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
      title: "Title",
      dataIndex: "title",
      width: 220,
      render: ellipsis,
    },
    {
      title: "Image",
      dataIndex: "image",
      width: 100,
      render: (img) =>
        img ? (
          <img
            src={img}
            alt="img"
            className="w-10 h-10 rounded-md object-cover border"
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 260,
      render: ellipsis,
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 140,
      render: (url) => (
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-600">
          Visit
        </a>
      ),
    },
    {
      title: "Action",
      align: "right",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onView?.(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EyeOutlined />
          </Button>

          <Button
            onClick={() => onEdit?.(record)}
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
        Career Plan Management
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Career Plans
          </h2>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined />}
              className="w-full sm:w-64"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleReset}
              className="h-10 rounded-md bg-[#9a2119] px-4 text-white"
            >
              <ReloadOutlined /> Reset
            </button>

            <button
              onClick={onAdd}
              className="h-10 rounded-md bg-[#9a2119] px-4 text-white"
            >
              + Add
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1100 }}
        />
      </div>
    </div>
  );
}
