import { Table, Input, Button, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export default function EntranceExamTable({
  data,
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.exam.toLowerCase().includes(search.toLowerCase())
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
      title: <span className="text-[#9a2119] font-semibold">Exam Name</span>,
      dataIndex: "exam",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Issue Date</span>,
      dataIndex: "issueDate",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Last Date</span>,
      dataIndex: "lastDate",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">URL</span>,
      dataIndex: "url",
      render: (url) => (
        <a href={url} target="_blank" className="text-blue-600">
          Visit
        </a>
      ),
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      key: "action",
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-2">
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

          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this entrance exam?"
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
    <div className="w-full">
      
      {/* 🔴 TOP MANAGEMENT HEADING (LIKE CAREER PATH MANAGEMENT) */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-4">
        Entrance Exam Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

        {/* INNER HEADER */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Entrance Exams
          </h2>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <Input
              placeholder="Search exam..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button
              onClick={handleReset}
               style={{ background: "#9a2119", borderColor: "#9a2119" ,color:"white"}}
            >
              <ReloadOutlined />
              Reset
            </Button>

            <Button
              onClick={onAdd}
               style={{ background: "#9a2119", borderColor: "#9a2119" ,color:"white"}}
            >
              + Add
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}
