import React from "react";
import { Table, Button, Avatar, Space, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

function StreamTable({ data, onAddClick, onView, onEdit, onDelete }) {
  const columns = [
    {
      title: "ID",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => (
        <Avatar src={img} size={45} shape="square" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
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
          <Popconfirm title="Delete?" onConfirm={() => onDelete(index)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border">

      <div className="flex justify-between mb-4">
        <h2 className="text-[#9a2119] font-semibold">
          Stream List
        </h2>

        <Button
          type="primary"
          onClick={onAddClick}
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
        >
          + Add Stream
        </Button>
      </div>

      <Table columns={columns} dataSource={data} rowKey={(r, i) => i} />
    </div>
  );
}

export default StreamTable;