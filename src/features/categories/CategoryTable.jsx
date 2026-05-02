import React, { useState } from "react";
import { Table, Button, Input, Space, Popconfirm, Tag } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function CategoryTable({ data, onAddClick, onView, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const filtered = (data || []).filter((item) =>
  (item.title || "").toLowerCase().includes((search || "").toLowerCase())
);

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
render: (text) => (text ? text.slice(0, 50) + "..." : ""), },
    {
      title: "Is Upgrade",
      dataIndex: "isUpgrade",
      render: (val) => (
        <Tag color={val === "Free" ? "green" : "red"}>
          {val}
        </Tag>
      ),
    },
    {
      title: "Action",
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
                      " icon={<EditOutlined />} onClick={() => onEdit(record, index)} />
          <Popconfirm title="Are you sure you want to delete this category?" onConfirm={() => onDelete(index)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="responsive-page-card">

      {/* Top Bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search..."
          className="w-full sm:w-60"
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          type="primary"
          onClick={onAddClick}
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
        >
          + Add Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey={(r, i) => i}
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />
    </div>
  );
}
