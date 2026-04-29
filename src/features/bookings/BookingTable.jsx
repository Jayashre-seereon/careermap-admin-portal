import { Table, Input, Tag, Modal } from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const initialData = [
  {
    key: "1",
    user: "Subhankar Sahu",
    member: "Macaulay Jackson",
    date: "2025-12-12",
    time: "12:10",
    status: "Unpaid",
  },
  {
    key: "2",
    user: "Subhankar Sahu",
    member: "Macaulay Jackson",
    date: "2025-12-12",
    time: "12:10",
    status: "Unpaid",
  },
  {
    key: "3",
    user: "Satyam123 Routray",
    member: "Macaulay Jackson",
    date: "2025-07-31",
    time: "18:59",
    status: "Paid",
  },
];

export default function BookingTable() {
  const [search, setSearch] = useState("");
  const [data] = useState(initialData);

  // Modal state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const filteredData = data.filter((item) =>
    item.user.toLowerCase().includes(search.toLowerCase())
  );

  const handleReset = () => setSearch("");

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "User Name",
      dataIndex: "user",
    },
    {
      title: "Member Name",
      dataIndex: "member",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Paid" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      align: "right",
      render: (_, record) => (
        <div className="flex justify-end">
          <button
            onClick={() => {
              setSelected(record);
              setOpen(true);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-md
                       border border-[#9a2119]
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]"
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
        Booking Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Bookings
          </h2>

          <div className="flex items-center gap-3">
            <Input
              placeholder="Search user..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="w-64 h-9"
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 h-9 rounded-md
                         bg-[#9a2119]
                         text-white"
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
        />
      </div>

      {/* VIEW MODAL */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title="Booking Details"
      >
        {selected && (
          <div className="space-y-2">
            <p><b>User:</b> {selected.user}</p>
            <p><b>Member:</b> {selected.member}</p>
            <p><b>Date:</b> {selected.date}</p>
            <p><b>Time:</b> {selected.time}</p>
            <p>
              <b>Status:</b>{" "}
              <Tag color={selected.status === "Paid" ? "green" : "red"}>
                {selected.status}
              </Tag>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}