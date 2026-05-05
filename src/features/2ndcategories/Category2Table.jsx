import React from "react";
import { Table, Button, Space, Input, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

export default function Category2Table({
  data,
  onAdd,
  onEdit,
  onView,
  onDelete,
  search,
  setSearch,
}) {
  const handleReset = () => setSearch("");

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 240,
      ellipsis: true,
    },
    {
      title: "Institutes",
      dataIndex: "institutions",
      ellipsis: true,
      width: 280,
    },
    {
      title: "Path ways",
      dataIndex: "howToBecome",
      ellipsis: true,
      width: 260,
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => (
        <img
          src={img}
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />
      ),
      width: 90,
    },
    {
      title: "Action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          />
          <Button
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this item?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Second Category</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search second category..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
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
            + Add Category
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
