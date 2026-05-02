import React from "react";
import { Table, Button, Avatar, Space, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

function ModuleTable({ data, onAddClick, onView, onEdit, onDelete }) {
  const columns = [
    {
      title: "SL No.",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => (
        <Avatar
          src={img}
          size={45}
          shape="square"
          className="border border-[#9a2119]"
        />
      ),
      width: 90,
    },
    { title: "Title", dataIndex: "title", width: 220, ellipsis: true },
    { title: "Btn Text", dataIndex: "btnText", width: 180, ellipsis: true },
    {
      title: "URL",
      dataIndex: "url",
      render: (url) => (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-[#9a2119]"
        >
          Visit
        </a>
      ),
      width: 120,
    },
    {
      title: "Action",
      fixed: "right",
      width: 150,
      render: (_, record, index) => (
        <Space>
          <Button  className="w-8 h-8 flex items-center justify-center rounded-md 
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
          <Popconfirm title="Are you sure you want to delete this module?" onConfirm={() => onDelete(index)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl shadow-md border">

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-[#9a2119] font-semibold">Module List</h2>

        <Button
          type="primary"
          onClick={onAddClick}
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
        >
          + Add Module
        </Button>
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

export default ModuleTable;
