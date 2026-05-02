import React from "react";
import { Table, Button, Tag, Avatar, Space, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

function MentorTable({ data, onAddClick, onView, onEdit, onDelete }) {
  const columns = [
    {
      title: "SL No.",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => (
        <Avatar src={img} size={40} />
      ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Category",
      dataIndex: "category",
      render: (cat) => <Tag color="red">{cat}</Tag>,
    },
    { title: "Designation", dataIndex: "designation" },
    {
      title: "Action",
      render: (_, record, index) => (
        <Space>
          <Button className="
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]" icon={<EyeOutlined />} onClick={() => onView(record)} />
          <Button className=" 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]" icon={<EditOutlined />} onClick={() => onEdit(record, index)} />
          <Popconfirm
            title="Are you sure you want to delete this mentor?"
            onConfirm={() => onDelete(index)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="responsive-page-card">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[#9a2119] font-semibold">Mentor List</h2>

        <Button
          type="primary"
          onClick={onAddClick}
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
        >
          + Add Mentor
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(r, i) => i}
        scroll={{ x: true }}
      />
    </div>
  );
}

export default MentorTable;
