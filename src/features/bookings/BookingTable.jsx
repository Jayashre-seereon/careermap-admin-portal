import React from "react";
import { Table, Input, Tag, Modal,Button } from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { getSerialNumber } from "../../utils/slNo";


const initialData = [
  {
    key: "1",
    user: "Subhankar Sahu",
    member: "Macaulay Jackson",
    date: "2025-12-12",
    time: "12:10",
    receivedPayment: "NA",
    transactionId: "NA",
    paymentConfirmationId: "NA",
    status: "Unpaid",
  },
  {
    key: "2",
    user: "Subhankar Sahu",
    member: "Macaulay Jackson",
    date: "2025-12-12",
    time: "12:10",
    receivedPayment: "NA",
    transactionId: "NA",
    paymentConfirmationId: "NA",
    status: "Unpaid",
  },
  {
    key: "3",
    user: "Satyam123 Routray",
    member: "Macaulay Jackson",
    date: "2025-07-31",
    time: "18:59",
    receivedPayment: "8000",
    transactionId: "1234567890",
    paymentConfirmationId: "0987654321",
    status: "Paid",
  },
];

export default function BookingTable() {
  const [search, setSearch] = useState("");
  const [data] = useState(initialData);
 const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
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
      render: (_, __, index) => getSerialNumber(index, pagination),
      width: 60,
    },
    {
      title: "User Name",
      dataIndex: "user",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Member Name",
      dataIndex: "member",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      width: 140,
    },
    {
      title: "Time",
      dataIndex: "time",
      width: 120,
    },
      {
      title: "Received Payment",
      dataIndex: "receivedPayment",
      width: 160,
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Payment Confirmation ID",
      dataIndex: "paymentConfirmationId",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Paid" ? "green" : "red"}>
          {status}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Action",
      align: "right",
      width: 120,
      render: (_, record) => (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setSelected(record);
              setOpen(true);
            }}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
       
          >
            <EyeOutlined />
          </Button>
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Bookings
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
          pagination={pagination}
          onChange={(pag) => setPagination(pag)}
          scroll={{ x: "max-content" }}
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
            <p><b>Received Payment:</b> {selected.receivedPayment}</p>
            <p><b>Transaction ID:</b> {selected.transactionId}</p>
            <p><b>Payment Confirmation ID:</b> {selected.paymentConfirmationId}</p>
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
