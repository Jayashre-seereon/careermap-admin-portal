import { Table, Input,Button } from "antd";
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
  Status:"Approved",
  },
  {
    key: "2",
   OrderDate:"2024-02-05",
   OrderNo:"ORD002",
   User:"Priya Das",
   ServiceName:"Career Guidance",
   Price:"$150",
  Status:"Approved",
  },
   
];

export default function ApprovedOrder({ setSelectedUser }) {
  const [search, setSearch] = useState("");

 const filteredData = data.filter((item) =>
  (item.User || "").toLowerCase().includes(search.toLowerCase())
);

  const handleReset = () => setSearch("");

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">Order Date</span>,
      dataIndex: "OrderDate",
      width: 150,
     
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Order No</span>,
      dataIndex: "OrderNo",
      width: 140,
      
    },
    {
      title: <span className="text-[#9a2119] font-semibold">User</span>,
      dataIndex: "User",
      width: 200,
      ellipsis: true,
     
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Service Name</span>,
      dataIndex: "ServiceName",
      width: 240,
      ellipsis: true,
      
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Price</span>,
      dataIndex: "Price",
      width: 120,
      
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      dataIndex: "Status",
      render: (text) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${text === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
        >
          {text}    
        </span>
      ),
      width: 140,
    },
   
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">
          Approved Orders
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search user..."
            value={search}
            prefix={<SearchOutlined className="text-[#9a2119]" />}
          className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
                onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            onClick={handleReset}
            style={{ background: "#9a2119", borderColor: "#9a2119" ,color:"white"}}  >
            <ReloadOutlined />
            Reset
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={Array.isArray(filteredData) ? [...filteredData].reverse() : []}
        pagination={{ pageSize: 5 }}
        rowClassName="hover:bg-gray-50"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
