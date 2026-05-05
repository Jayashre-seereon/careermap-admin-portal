import React from "react";
import { Table, Button, Popconfirm, Input } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

function SubCategoryTable({ data, onAdd, onView, onEdit, onDelete, search, setSearch }) {
  const filtered = (data || []).filter((item) =>
    (item.title || "").toLowerCase().includes((search || "").toLowerCase())
  );
  const handleReset = () => setSearch("");

  const columns = [
    { title: "SL", render: (_, __, i) => i + 1, width: 70 },

    { title: "Category Name", dataIndex: "category", width: 180, ellipsis: true },

    { title: "2nd Category Name", dataIndex: "secondCategory", width: 260, ellipsis: true },

    { title: "Title", dataIndex: "title", width: 180, ellipsis: true },

    {
      title: "Institutions",
      dataIndex: "institutions",
      width: 320,
      ellipsis: true,
      render: (text) => <span>{text ? text.slice(0, 80) + "..." : ""}</span>,
    },

    {
      title: "File",
      dataIndex: "file",
      render: () => "File",
      width: 100,
    },

    {
      title: "Description",
      dataIndex: "description",
      width: 340,
      ellipsis: true,
      render: (text) => <span>{text ? text.slice(0, 80) + "..." : ""}</span>,
    },

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
            description="Are you sure you want to delete this item?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl shadow-md">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Sub Category</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search sub category..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
            value={search}
            onChange={(e) => setSearch(e.target.value || "")}
          />
          <Button
            onClick={handleReset}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>
          <Button
            onClick={onAdd}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add SubCategory
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export default SubCategoryTable;
