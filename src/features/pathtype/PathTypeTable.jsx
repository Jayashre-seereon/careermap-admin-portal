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
  { key: "1", title: "Path 1" },
  { key: "2", title: "Path 2" },
  { key: "3", title: "Path 3" },
  { key: "4", title: "Path 4" },
  { key: "5", title: "Path 5" },
  { key: "6", title: "Path 6" },
  { key: "7", title: "Path 7" },
];

export default function PathTypeTable({
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialData);

  // Search Filter
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">ID</span>,
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Title</span>,
      dataIndex: "title",
    },
    {
      title: (
        <span className="text-[#9a2119] font-semibold text-right block">
          Action
        </span>
      ),
      key: "action",
      align: "right", // ✅ Important
      width: 180,
      render: (_, record) => (
        <div className="flex justify-end gap-2 pr-2">
          {/* View */}
          <button
            onClick={() => onView(record)}
            className="w-9 h-9 flex items-center justify-center rounded-md
                       border border-[#9a2119]
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                       transition"
          >
            <EyeOutlined />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(record)}
            className="w-9 h-9 flex items-center justify-center rounded-md
                       border border-[#9a2119]
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                       transition"
          >
            <EditOutlined />
          </button>

          {/* Delete */}
          <button
            onClick={() => {
              const updated = data.filter((d) => d.key !== record.key);
              setData(updated);
              onDelete && onDelete(record);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-md
                       border border-red-500
                       text-red-500
                       hover:bg-red-50
                       transition"
          >
            <DeleteOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">
          Path Type
        </h2>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search path..."
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
                       hover:bg-[#c4392e]
                       transition"
          >
            <ReloadOutlined />
            Reset
          </button>

          {/* Add Button */}
          <button
            onClick={onAdd}
            className="px-4 h-9 rounded-md
                       bg-[#9a2119]
                       text-white
                       hover:bg-[#c4392e]
                       transition"
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
        className="[&_.ant-table-cell]:align-middle"
      />
    </div>
  );
}