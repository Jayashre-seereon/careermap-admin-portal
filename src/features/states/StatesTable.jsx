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
  { key: "1", name: "ANDAMAN & NICOBAR", country: "India" },
  { key: "2", name: "ANDHRA PRADESH", country: "India" },
  { key: "3", name: "ARUNACHAL PRADESH", country: "India" },
  { key: "4", name: "ASSAM", country: "India" },
  { key: "5", name: "BIHAR", country: "India" },
];

export default function StatesTable({
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
      title: <span className="text-[#9a2119] font-semibold">Country</span>,
      dataIndex: "country",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-3">

          <button
            onClick={() => onView(record)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#9a2119] text-[#9a2119] hover:bg-[#9a2119] hover:text-white"
          >
            <EyeOutlined />
          </button>

          <button
            onClick={() => onEdit(record)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#9a2119] text-[#9a2119] hover:bg-[#9a2119] hover:text-white"
          >
            <EditOutlined />
          </button>

          <button
            onClick={() => {
              setData(data.filter((d) => d.key !== record.key));
              onDelete && onDelete(record);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
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
        States Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">

        {/* HEADER */}
        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            States
          </h2>

          <div className="flex gap-3">
            <Input
              placeholder="Search state..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="w-64 h-10 border-[#9a2119]"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 h-10 rounded-lg bg-[#9a2119] text-white hover:bg-[#c0392b]"
            >
              <ReloadOutlined />
              Reset
            </button>

            <button
              onClick={onAdd}
              className="px-5 h-10 rounded-lg bg-[#9a2119] text-white hover:bg-[#c0392b]"
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