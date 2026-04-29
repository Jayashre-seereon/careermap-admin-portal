import { Table, Input, Tooltip } from "antd";
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
    type: "State",
    class: "11th-12th",
    name: "Test Scholarship",
    desc: "Description",
    url: "#",
  },
  {
    key: "2",
    type: "Private",
    class: "N/A",
    name: "Tata Capital Pankh Scholarship",
    desc: "About The Program The Tata Capital Pankh Scholarship aims to support...",
    url: "https://www.buddy4study.com/page/",
  },
  {
    key: "3",
    type: "Private",
    class: "N/A",
    name: "SOF International Hindi Olympiad",
    desc: "About The Program SOF International Hindi Olympiad encourages students...",
    url: "https://www.hindiolympiad.com/",
  },
];

export default function ScholarshipTable({
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialData);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  const ellipsis = (text) => (
    <Tooltip title={text}>
      <span className="truncate block max-w-[200px]">{text}</span>
    </Tooltip>
  );

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
      width: 60,
      fixed: "left",
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 120,
    },
    {
      title: "Class",
      dataIndex: "class",
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 220,
      render: ellipsis,
    },
    {
      title: "Short Description",
      dataIndex: "desc",
      width: 250,
      render: ellipsis,
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 140,
      render: (url) => (
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-600">
          Visit
        </a>
      ),
    },
    {
      title: "Action",
      align: "right",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onView && onView(record)}
            className="w-9 h-9 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EyeOutlined />
          </button>

          <button
            onClick={() => onEdit && onEdit(record)}
            className="w-9 h-9 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EditOutlined />
          </button>

          <button
            onClick={() => {
              const updated = data.filter((d) => d.key !== record.key);
              setData(updated);
              onDelete && onDelete(record);
            }}
            className="w-9 h-9 border border-red-500 text-red-500 rounded-md"
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Scholarship Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">

        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Scholarships
          </h2>

          <div className="flex gap-3">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined />}
              className="w-64"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleReset}
              className="px-4 bg-[#9a2119] text-white rounded-md"
            >
              <ReloadOutlined /> Reset
            </button>

            <button
              onClick={onAdd}
              className="px-4 bg-[#9a2119] text-white rounded-md"
            >
              + Add
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1200 }}
        />
      </div>
    </div>
  );
}