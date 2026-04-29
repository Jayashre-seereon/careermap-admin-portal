import React, { useState } from "react";
import { Table, Button, Input, Space, Popconfirm, Tag } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function CategoryTable({ data, onAddClick, onView, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
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
      render: (text) => text.slice(0, 50) + "...",
    },
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
          <Button icon={<EyeOutlined />} onClick={() => onView(record)} />
          <Button icon={<EditOutlined />} onClick={() => onEdit(record, index)} />
          <Popconfirm title="Delete?" onConfirm={() => onDelete(index)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow border">

      {/* Top Bar */}
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search..."
          className="w-60"
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
      />
    </div>
  );
}