import React, { useEffect, useMemo } from "react";
import { Table, Input, Tag, Modal, Button, Alert } from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { getSerialNumber } from "../../utils/slNo";
import { getAdminMentorBookings } from "../../api/adminRecords";

const rowsFrom = (response) => {
  const rows = Array.isArray(response) ? response : response?.data ?? response?.bookings ?? response?.mentorBookings ?? [];
  return Array.isArray(rows) ? rows : [];
};
const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");
const displayValue = (value, fallback = "NA") => value === undefined || value === null || value === "" ? fallback : value;
const mapBooking = (item, index) => {
  const user = firstValue(item.user, item.student, item.customer, item.userName, item.studentName);
  const mentor = firstValue(item.mentor, item.member, item.mentorName);
  const dateValue = firstValue(item.date, item.bookingDate, item.createdAt, item.created_at);
  const date = dateValue ? new Date(dateValue) : null;
  return {
    ...item,
    key: item.id ?? item._id ?? index,
    user: typeof user === "object" ? firstValue(user.name, user.fullName, user.email) : displayValue(user),
    member: typeof mentor === "object" ? firstValue(mentor.name, mentor.fullName, mentor.email) : displayValue(mentor),
    date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("en-IN") : displayValue(dateValue),
    time: displayValue(item.time ?? item.bookingTime ?? (date && !Number.isNaN(date.getTime()) ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : null)),
    receivedPayment: displayValue(firstValue(item.receivedPayment, item.amount, item.paymentAmount)),
    transactionId: displayValue(firstValue(item.transactionId, item.txnId, item.paymentIntentId)),
    paymentConfirmationId: displayValue(firstValue(item.paymentConfirmationId, item.confirmationId, item.razorpayPaymentId)),
    status: firstValue(item.status, item.paymentStatus, item.bookingStatus, "Unpaid"),
  };
};

export default function BookingTable() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  // Modal state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAdminMentorBookings()
      .then((response) => setData(rowsFrom(response).map(mapBooking)))
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Could not load mentor bookings."))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => data.filter((item) =>
    [item.user, item.member, item.transactionId, item.status].join(" ").toLowerCase().includes(search.toLowerCase())
  ), [data, search]);

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
            Mentor Bookings
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
        {error && <Alert className="mb-4" type="error" showIcon message={error} />}
        <Table
          columns={columns}
        dataSource={Array.isArray(filteredData) ? [...filteredData].reverse() : []}
          loading={loading}
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
