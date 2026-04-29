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
    txnId: "TXN12345",
    user: "Rahul Sharma",
    module: "Plan",
    amount: "₹50000",
    method: "UPI",
    status: "Paid",
    date: "12 Mar 2025, 10:30 AM",
  },
  {
    key: "2",
    txnId: "TXN12346",
    user: "Priya Das",
    module: "Booking",
    amount: "₹1000",
    method: "Card",
    status: "Pending",
    date: "13 Mar 2025, 01:15 PM",
  },
  {
    key: "3",
    txnId: "TXN12347",
    user: "Amit Kumar",
    module: "Service",
    amount: "₹1.00",
    method: "Net Banking",
    status: "Failed",
    date: "14 Mar 2025, 08:45 PM",
  },
];

export default function TransactionsTable({ onView }) {
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
      title: <span className="text-[#9a2119] font-semibold">Transaction ID</span>,
      dataIndex: "txnId",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">User</span>,
      dataIndex: "user",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Module</span>,
      dataIndex: "module",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Amount</span>,
      dataIndex: "amount",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Method</span>,
      dataIndex: "method",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>,
      dataIndex: "status",
      render: (status) => {
        let color = "default";
        if (status === "Paid") color = "green";
        else if (status === "Pending") color = "orange";
        else if (status === "Failed") color = "red";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Date</span>,
      dataIndex: "date",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onView && onView(record)}
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
        Transactions Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">

        {/* HEADER */}
        <div className="flex justify-between mb-5">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Transactions
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