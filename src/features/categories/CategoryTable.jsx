import React, { useState } from "react";
import { Table, Button, Input, Space, Popconfirm, Tag } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

export default function CategoryTable({ data, onAddClick, onView, onEdit, onDelete, loading }) {
  const [search, setSearch] = useState("");

  const filtered = (data || []).filter((item) =>
  (item.title || "").toLowerCase().includes((search || "").toLowerCase())
);

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 360,
      ellipsis: true,
      render: (text) => (text ? text.slice(0, 80) + "..." : ""),
    },
    {
      title: "Is Upgrade",
      dataIndex: "isUpgrade",
      render: (val) => (
        <Tag color={val === "Free" ? "green" : "red"}>
          {val}
        </Tag>
      ),
      width: 130,
    },
    {
      title: "Action",
      fixed: "right",
      width: 150,
      render: (_, record, index) => (
        <Space>
          <Button className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                      " icon={<EyeOutlined />} onClick={() => onView(record)} />
          <Button className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                      " icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm title="Are you sure you want to delete this category?" onConfirm={() => onDelete(record)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow border">

      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Category</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search category..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            onClick={() => setSearch("")}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>
          <Button
            onClick={onAddClick}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add Category
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
