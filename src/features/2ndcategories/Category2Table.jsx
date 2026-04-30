import React from "react";
import { Table, Button, Space, Input, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
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
      title: "How to Become",
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

      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">  
          {/* 🔍 SEARCH */}
          <Input
            placeholder="Search category..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
             className="border px-3 py-2 rounded-md w-full sm:w-[250px]"
       
          />

          {/* ➕ ADD BUTTON */}
          <Button
            type="primary"
            onClick={onAdd}
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
          >
            + Add Category
          </Button>
       
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
