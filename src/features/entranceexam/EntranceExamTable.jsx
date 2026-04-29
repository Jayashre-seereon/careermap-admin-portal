import { Table, Input } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const initialData = [
  {
    key: "1",
    module: "Career Library",
    category: "Railways",
    exam: "RRC Level 1 Exam (Group D posts)",
    issueDate: "February 2025",
    lastDate: "March 2025",
    url: "https://www.rrbcdg.gov.in/",
  },
  {
    key: "2",
    module: "Career Library",
    category: "Railways",
    exam: "RRB Assistant Station Master Exam",
    issueDate: "July 2025",
    lastDate: "August 2025",
    url: "https://www.rrbcdg.gov.in/",
  },
  {
    key: "3",
    module: "Career Library",
    category: "Railways",
    exam: "RRB Ministerial & Isolated Categories Exam",
    issueDate: "April 2025",
    lastDate: "May 2025",
    url: "https://www.rrbcdg.gov.in/",
  },
];

export default function EntranceExamTable({
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialData);

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
          <button
            onClick={() => onView(record)}
            className="w-9 h-9 flex items-center justify-center rounded-md
                       border border-[#9a2119]
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]"
          >
            <EyeOutlined />
          </button>

          <button
            onClick={() => onEdit(record)}
            className="w-9 h-9 flex items-center justify-center rounded-md
                       border border-[#9a2119]
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]"
          >
            <EditOutlined />
          </button>

          <button
            onClick={() => {
              const updated = data.filter((d) => d.key !== record.key);
              setData(updated);
              onDelete && onDelete(record);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-md
                       border border-red-500
                       text-red-500
                       hover:bg-red-50"
          >
            <DeleteOutlined />
          </button>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Entrance Exams
          </h2>

          <div className="flex items-center gap-3">
            <Input
              placeholder="Search exam..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="w-64 h-9 rounded-md border-[#9a2119]"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 h-9 rounded-md
                         bg-[#9a2119]
                         text-white
                         hover:bg-[#c4392e]"
            >
              <ReloadOutlined />
              Reset
            </button>

            <button
              onClick={onAdd}
              className="px-4 h-9 rounded-md
                         bg-[#9a2119]
                         text-white
                         hover:bg-[#c4392e]"
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
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}