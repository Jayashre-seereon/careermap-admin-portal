import React from "react";
import { Button, Input, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

function SectionTable({ data, onAddClick, onView, onEdit, onDelete, search, onSearch, loading }) {
  const columns = [
    { title: "#", render: (_, __, index) => index + 1, width: 70 },
    { title: "Title", dataIndex: "title", width: 220, ellipsis: true },
    { title: "Code", dataIndex: "code", width: 150, render: (value) => <Tag color="volcano">{value || "-"}</Tag> },
    { title: "Order", dataIndex: "order", width: 100 },
    { title: "Description", dataIndex: "description", ellipsis: true },
    { title: "Actions", fixed: "right", width: 150, render: (_, record) => <Space><Button className="border-[#9a2119] text-[#9a2119]" icon={<EyeOutlined />} onClick={() => onView(record)} /><Button className="border-[#9a2119] text-[#9a2119]" icon={<EditOutlined />} onClick={() => onEdit(record)} /><Popconfirm title="Delete this section?" onConfirm={() => onDelete(record)}><Button danger icon={<DeleteOutlined />} /></Popconfirm></Space> },
  ];

  return <div className="w-full rounded-2xl border bg-white p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold text-[#9a2119]">Sections</h2><div className="flex w-full flex-wrap items-center gap-3 sm:w-auto"><Input placeholder="Search sections..." prefix={<SearchOutlined className="text-[#9a2119]" />} value={search} onChange={(event) => onSearch(event.target.value)} className="h-8 w-full rounded-md border-[#9a2119] sm:w-64" /><Button onClick={() => onSearch("")} icon={<ReloadOutlined />}>Reset</Button><Button type="primary" onClick={onAddClick} style={{ background: "#9a2119", borderColor: "#9a2119" }}>Add Section</Button></div></div><Table columns={columns} dataSource={Array.isArray(data) ? data : []} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} scroll={{ x: "max-content" }} /></div>;
}

export default SectionTable;
