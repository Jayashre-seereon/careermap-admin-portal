import React from "react";
import { Table, Button, Tag, Avatar, Space, Popconfirm, Input } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

function MentorTable({ data, onAddClick, onView, onEdit, onDelete, search, onSearch }) {
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
        <Avatar src={img} size={40} />
      ),
      width: 90,
    },
    { title: "Name", dataIndex: "name", width: 170 },
    { title: "Email", dataIndex: "email", width: 220, ellipsis: true },
    { title: "Phone", dataIndex: "phone", width: 150 },
    { title: "Date of Birth", dataIndex: "dob", width: 150 },
    { title: "Education", dataIndex: "education", width: 220, ellipsis: true },
    {
      title: "Category",
      dataIndex: "category",
      render: (cat) => <Tag color="red">{cat}</Tag>,
      width: 160,
    },
    { title: "Designation", dataIndex: "designation", width: 180, ellipsis: true },
    { title: "Rank", dataIndex: "rank", width: 120 ,ellipsis: true},
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === false ? "default" : "red"}>
          {status === false ? "Inactive" : "Active"}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Action",
      fixed: "right",
      width: 150,
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
    <div className="w-full bg-white p-5 rounded-2xl shadow-md border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Mentor</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search mentor..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
          />
          <Button
            onClick={() => onSearch("")}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>
          <Button
            onClick={onAddClick}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add Mentor
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

export default MentorTable;
