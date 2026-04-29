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
  { key: "1", name: "India" },
  { key: "2", name: "Others" },
];

export default function CountriesTable({
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

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">ID</span>,
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Name</span>,
      dataIndex: "name",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-3">
          {/* View */}
          <button
            onClick={() => onView(record)}
            className="w-10 h-10 flex items-center justify-center rounded-lg
                       border border-[#9a2119]
                       text-[#9a2119]
                       hover:bg-[#9a2119]
                       hover:text-white
                       transition"
          >
            <EyeOutlined />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(record)}
            className="w-10 h-10 flex items-center justify-center rounded-lg
                       border border-[#9a2119]
                       text-[#9a2119]
                       hover:bg-[#9a2119]
                       hover:text-white
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
            className="w-10 h-10 flex items-center justify-center rounded-lg
                       border border-red-500
                       text-red-500
                       hover:bg-red-500
                       hover:text-white
                       transition"
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
        Countries Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Countries
          </h2>

          <div className="flex items-center gap-3">
            <Input
              placeholder="Search country..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="w-64 h-10 rounded-md border-[#9a2119]"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 h-10 rounded-lg
                         bg-[#9a2119]
                         text-white
                         hover:bg-[#c0392b]
                         transition"
            >
              <ReloadOutlined />
              Reset
            </button>

            <button
              onClick={onAdd}
              className="px-5 h-10 rounded-lg
                         bg-[#9a2119]
                         text-white
                         hover:bg-[#c0392b]
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
        />
      </div>
    </div>
  );
}