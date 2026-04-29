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
    category: "Medical",
    path: "Path 1",
    stream: "12th [PCB, PCMB, PCB(M), PCM(B)]",
    graduation: "MBBS",
    afterGrad: "M.D / M.S",
    postGrad: "DM-MCH : SS",
    other: "POST DOC",
  },
  {
    key: "2",
    module: "Career Library",
    category: "Lecturer/Professor",
    path: "Path 1",
    stream: "12th",
    graduation: "Graduation in any stream",
    afterGrad: "Post graduation in any discipline",
    postGrad: "Ph.D",
    other: "N/A",
  },
  {
    key: "3",
    module: "Career Library",
    category: "Journalism & Mass communication",
    path: "Path 1",
    stream: "12th pass in any stream",
    graduation: "UG(J/JMC) / PG Diploma",
    afterGrad: "Ph.D",
    postGrad: "N/A",
    other: "N/A",
  },
];

export default function CareerPathTable({
  onView,
  onEdit,
  onDelete,
  onAdd,
}) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(initialData);

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
      title: <span className="text-[#9a2119] font-semibold">Path Type</span>,
      dataIndex: "path",
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
      dataIndex: "afterGrad",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">
        After Post Graduation
      </span>,
      dataIndex: "postGrad",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Any Other</span>,
      dataIndex: "other",
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 w-full">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">
          Career Path
        </h2>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search module..."
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
        scroll={{ x: true }} // ✅ important for large tables
      />
    </div>
  );
}