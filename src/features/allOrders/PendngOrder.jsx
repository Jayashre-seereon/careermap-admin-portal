import { Table, Input } from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const data = [
  {
    key: "1",
   OrderDate:"2024-01-12",
   OrderNo:"ORD001",
   User:"Rahul Sharma",
   ServiceName:"Career Plan",
   Price:"$120",
  Status:"Pending",
  },
  {
    key: "2",
   OrderDate:"2024-02-05",
   OrderNo:"ORD002",
   User:"Priya Das",
   ServiceName:"Career Guidance",
   Price:"$150",
  Status:"Pending",
  },
   
];

export default function PendingOrder({ setSelectedUser }) {
  const [search, setSearch] = useState("");

 const filteredData = data.filter((item) =>
  (item.User || "").toLowerCase().includes(search.toLowerCase())
);

  const handleReset = () => setSearch("");

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Order Date</span>,
      dataIndex: "OrderDate",
     
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Order No</span>,
      dataIndex: "OrderNo",
      
    },
    {
      title: <span className="text-[#9a2119] font-semibold">User</span>,
      dataIndex: "User",
     
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Service Name</span>,
      dataIndex: "ServiceName",
      
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Price</span>,
      dataIndex: "Price",
      
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      dataIndex: "Status",
      render: (text) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${text === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
        >
          {text}    
        </span>
      ),
    },
   
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">
          Pending Orders
        </h2>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search user..."
            value={search}
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            className="w-64 h-9 rounded-md border-[#9a2119] focus:border-[#9a2119]"
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
  );
}
