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
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
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
    },
    {
      title: "Action",
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
  <div className="bg-white p-6 rounded-2xl shadow border">

      {/* Top Bar */}
      <div className="flex justify-between mb-4">  
          {/* 🔍 SEARCH */}
          <Input
            placeholder="Search category..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
             className="border px-3 py-2 rounded-md w-[250px]"
       
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

      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}
