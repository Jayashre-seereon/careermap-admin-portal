import { Table, Input, Button, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const initialData = [
  { key: "1", name: "Adilabad", state: "Telangana" },
  { key: "2", name: "Agar Malwa", state: "Madhya Pradesh" },
  { key: "3", name: "Agatti", state: "Lakshadweep" },
  { key: "4", name: "Agra", state: "Uttar Pradesh" },
  { key: "5", name: "Ahmedabad", state: "Gujarat" },
];

export default function DistrictsTable({
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
      title: <span className="text-[#9a2119] font-semibold">State</span>,
      dataIndex: "state",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-3">

          <Button
            onClick={() => onView(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"  
           >
            <EyeOutlined />
          </Button>

          <Button
            onClick={() => onEdit(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"  
             >
             
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this item?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              const updated = data.filter((d) => d.key !== record.key);
              setData(updated);
              onDelete && onDelete(record);
            }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>

        </div>
      ),
    },
  ];

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Districts Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">

        {/* HEADER */}
        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Districts
          </h2>

          <div className="flex gap-3">
            <Input
              placeholder="Search district..."
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
