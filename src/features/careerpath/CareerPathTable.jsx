import { Table, Input, Button, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export default function CareerPathTable({
  data,
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.module.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Module</span>,
      dataIndex: "module",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Category</span>,
      dataIndex: "category",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">2nd Category</span>,
      dataIndex: "secondCategory",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Subcategory</span>,
      dataIndex: "subcategory",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Path Type</span>,
      dataIndex: "pathType",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Stream</span>,
      dataIndex: "stream",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Graduation</span>,
      dataIndex: "graduation",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">
        After Graduation
      </span>,
      dataIndex: "afterGraduation",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">
        After Post Graduation
      </span>,
      dataIndex: "afterPostGraduation",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Any Other</span>,
      dataIndex: "anyOther",
    },
    {
      title: (
        <span className="text-[#9a2119] font-semibold">Action</span>
      ),
      key: "action",
      align: "right", // ✅ FIX: right align column
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          {/* View */}
          <Button
            onClick={() => onView(record)}
           className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                      "
          >
            <EyeOutlined />
          </Button>

          {/* Edit */}
          <Button
            onClick={() => onEdit(record)}
           className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                      "
          >
            <EditOutlined />
          </Button>

          {/* Delete */}
          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this career path?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete && onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 w-full">

      {/* HEADER */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#9a2119]">
          Career Path
        </h2>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <Input
            placeholder="Search module..."
            value={search}
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            className="h-9 w-full rounded-md border-[#9a2119] sm:w-64"
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={handleReset}
            className="flex h-9 items-center justify-center gap-2 rounded-md
                       bg-[#9a2119]
                       text-white
                       hover:bg-[#c4392e]
                       px-4 transition"
          >
            <ReloadOutlined />
            Reset
          </button>

          <button
            onClick={onAdd}
            className="h-9 rounded-md
                       bg-[#9a2119]
                       text-white
                       hover:bg-[#c4392e]
                       px-4 transition"
          >
            + Add
          </button>
        </div>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowClassName="hover:bg-gray-50"
        scroll={{ x: true }} // ✅ important for large tables
      />
    </div>
  );
}
