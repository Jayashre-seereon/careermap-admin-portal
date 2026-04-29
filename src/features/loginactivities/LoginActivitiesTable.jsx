import { Table, Input, Tag } from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const initialData = [
  {
    key: "1",
    user: "Rahul Sharma",
    email: "rahul@gmail.com",
    time: "12 Mar 2025, 10:30 AM",
    ip: "192.168.1.1",
    device: "Chrome / Windows",
    location: "Bhubaneswar, India",
    status: "Success",
  },
  {
    key: "2",
    user: "Priya Das",
    email: "priya@gmail.com",
    time: "13 Mar 2025, 01:15 PM",
    ip: "192.168.1.5",
    device: "Safari / iPhone",
    location: "Delhi, India",
    status: "Failed",
  },
  {
    key: "3",
    user: "Amit Kumar",
    email: "amit@gmail.com",
    time: "14 Mar 2025, 08:45 PM",
    ip: "192.168.1.9",
    device: "Edge / Windows",
    location: "Mumbai, India",
    status: "Success",
  },
];

export default function LoginActivitiesTable({ onView }) {
  const [search, setSearch] = useState("");
  const [data] = useState(initialData);

  const filteredData = data.filter((item) =>
    item.user.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => index + 1,
      width: 60,
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
      title: <span className="text-[#9a2119] font-semibold">Login Time</span>,
      dataIndex: "time",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">IP</span>,
      dataIndex: "ip",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Device</span>,
      dataIndex: "device",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Location</span>,
      dataIndex: "location",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      dataIndex: "status",
      render: (status) => {
        let color = status === "Success" ? "green" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end">
          <button
            onClick={() => onView(record)}
            className="w-10 h-10 flex items-center justify-center rounded-lg
                       border border-[#9a2119]
                       text-[#9a2119]
                       hover:bg-[#9a2119]
                       hover:text-white"
          >
            <EyeOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Login Activities Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">

        {/* HEADER */}
        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Login Activities
          </h2>

          <div className="flex gap-3">
            <Input
              placeholder="Search user..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="w-64 h-10 border-[#9a2119]"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 h-10 rounded-lg
                         bg-[#9a2119]
                         text-white
                         hover:bg-[#c0392b]"
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
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}