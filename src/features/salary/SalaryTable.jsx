import React from "react";
import { Table, Button, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

function SalaryTable({ data, onAdd, onView, onEdit, onDelete, onSearch, search }) {
  const columns = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    { title: "Stream", dataIndex: "stream", width: 140 },
    { title: "Category", dataIndex: "category", width: 160 },
    { title: "2nd Category", dataIndex: "secondCategory", width: 260, ellipsis: true },
    { title: "Subcategory", dataIndex: "subcategory", width: 180, ellipsis: true },
    { title: "Salary Range", dataIndex: "salary", width: 220, ellipsis: true },
    {
      title: "Action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
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
            description="Are you sure you want to delete this salary range?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow border w-full">
      
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full sm:w-64"
        />

        <Button
          type="primary"
          onClick={onAdd}
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
        >
          + Add Salary
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

export default SalaryTable;
