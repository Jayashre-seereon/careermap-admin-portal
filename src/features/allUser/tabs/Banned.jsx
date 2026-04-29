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
    id: "USR001",
    user: "Rahul Sharma",
    email: "rahul@gmail.com",
    joined: "2024-01-12",
    balance: "$120",
    mobile: "+91 9876543210",
    address: "12 MG Road",
    city: "Bhubaneswar",
    state: "Odisha",
    zip: "751001",
    country: "India",
    emailVerified: true,
    mobileVerified: true,
    twoFA: false,
  },
  {
    key: "2",
    id: "USR002",
    user: "Priya Das",
    email: "priya@gmail.com",
    joined: "2024-02-05",
    balance: "$80",
    mobile: "+91 8765432109",
    address: "45 Saheed Nagar",
    city: "Bhubaneswar",
    state: "Odisha",
    zip: "751007",
    country: "India",
    emailVerified: true,
    mobileVerified: false,
    twoFA: true,
  },
];

export default function Banned({ setSelectedUser }) {
  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.user.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">User</span>,
      dataIndex: "user",
     
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Email</span>,
      dataIndex: "email",
      
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Joined At</span>,
      dataIndex: "joined",
     
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Balance</span>,
      dataIndex: "balance",
      
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
    render: (_, record) => (
  <div className="flex gap-2">
    <button
      onClick={() => setSelectedUser(record)}
      className="w-9 h-9 flex items-center justify-center rounded-md 
                 border border-[#9a2119] 
                 text-[#9a2119]
                 hover:border-[#e57373]
                 hover:text-[#e57373]
                 transition duration-200"
    >
      <EyeOutlined />
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
          Banned Users
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
