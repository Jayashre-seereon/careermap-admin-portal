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
    name: "Free",
    features: "Career Library, Entrance Exam, Institute, Quiz",
    module: "Career Library, Entrance Exam, Institute, Quiz",
    price: "0",
  },
  {
    key: "2",
    name: "Gold",
    features: "Mock Test, Live Test, Practice Questions",
    module: "Career Library, Career Assessment",
    price: "1",
  },
  {
    key: "3",
    name: "Platinum",
    features: "All Features Included",
    module: "All Modules",
    price: "50000",
  },
];

export default function PlansTable({
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
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Plan Name</span>,
      dataIndex: "name",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Features</span>,
      dataIndex: "features",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Module</span>,
      dataIndex: "module",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Price</span>,
      dataIndex: "price",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-3">

          {/* VIEW */}
          <button
            onClick={() => onView(record)}
            className="w-10 h-10 flex items-center justify-center rounded-lg
                       border border-[#9a2119]
                       text-[#9a2119]
                       hover:bg-[#9a2119]
                       hover:text-white
                       transition duration-200"
          >
            <EyeOutlined />
          </button>

          {/* EDIT */}
          <button
            onClick={() => onEdit(record)}
            className="w-10 h-10 flex items-center justify-center rounded-lg
                       border border-[#9a2119]
                       text-[#9a2119]
                       hover:bg-[#9a2119]
                       hover:text-white
                       transition duration-200"
          >
            <EditOutlined />
          </button>

          {/* DELETE */}
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
                       transition duration-200"
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
        Plans Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Plans
          </h2>

          <div className="flex items-center gap-4">

            <Input
              placeholder="Search plan..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="w-64 h-10 rounded-md border-[#9a2119]"
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* RESET */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 h-10 rounded-lg
                         bg-[#9a2119]
                         text-white
                         hover:bg-[#c0392b]
                         transition duration-200"
            >
              <ReloadOutlined />
              Reset
            </button>

            {/* ADD */}
            <button
              onClick={onAdd}
              className="px-5 h-10 rounded-lg
                         bg-[#9a2119]
                         text-white
                         hover:bg-[#c0392b]
                         transition duration-200"
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