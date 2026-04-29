import React from "react";
import { Table, Button } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

function SubCategoryTable({ data, onAdd, onView, onEdit, onDelete, search, setSearch }) {
  
  const filtered = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: "SL", render: (_, __, i) => i + 1 },

    { title: "Category Name", dataIndex: "category" },

    { title: "2nd Category Name", dataIndex: "secondCategory" },

    { title: "Title", dataIndex: "title" },

    {
      title: "Institutions",
      dataIndex: "institutions",
      render: (text) => <span>{text.slice(0, 40)}...</span>,
    },

    {
      title: "File",
      dataIndex: "file",
      render: () => "File",
    },

    {
      title: "Description",
      dataIndex: "description",
      render: (text) => <span>{text.slice(0, 40)}...</span>,
    },

    {
      title: "Action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button icon={<EyeOutlined />} onClick={() => onView(record)} />
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Search..."
          className="border px-3 py-2 rounded-md w-[250px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          type="primary"
          onClick={onAdd}
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
        >
          + Add SubCategory
        </Button>
      </div>

      <Table columns={columns} dataSource={filtered} rowKey="id" />
    </div>
  );
}

export default SubCategoryTable;