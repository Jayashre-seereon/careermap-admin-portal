import React from "react";
import { Table, Button, Avatar, Space, Popconfirm, Input } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

function StreamTable({ data, onAddClick, onView, onEdit, onDelete, search, onSearch }) {
  const handleReset = () => onSearch("");
  const columns = [
    {
      title: "ID",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => (
        <Avatar src={img} size={45} shape="square" />
      ),
      width: 90,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 260,
      ellipsis: true,
    },
    {
      title: "Action",
      align: "right",
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
                      " icon={<EditOutlined />} onClick={() => onEdit(record, index)} />
          <Popconfirm title="Are you sure you want to delete this stream?" onConfirm={() => onDelete(index)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl shadow-md border">

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Stream</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search stream..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
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
            onClick={onAddClick}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add Stream
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(r, i) => i}
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export default StreamTable;
