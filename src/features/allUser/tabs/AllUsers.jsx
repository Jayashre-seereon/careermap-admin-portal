import React from "react";
import { Table, Input ,Button} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getSerialNumber } from "../../../utils/slNo";
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

export default function AllUsers() {
  const [search, setSearch] = useState("");
  const { setSelectedUser } = useOutletContext();
const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const filteredData = data.filter((item) =>
    item.user.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">No.</span>,
      dataIndex: "id",
      render: (_, __, index) => getSerialNumber(index, pagination),
    },
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
          <Button
            onClick={() => setSelectedUser(record)} // ✅ pass full user object
            className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                      "
          >
            <EyeOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">All Users</h2>
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

      <Table
        columns={columns}
        dataSource={Array.isArray(filteredData) ? [...filteredData].reverse() : []}
        pagination={pagination}
        onChange={(pag) => setPagination(pag)}
        rowClassName="hover:bg-gray-50"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}



