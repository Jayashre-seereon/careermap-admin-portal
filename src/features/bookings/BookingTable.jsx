import React, { useEffect, useMemo } from "react";
import { Table, Input, Tag, Modal, Button, Alert, message, DatePicker, TimePicker, Input as AntInput } from "antd";
import {
  SendOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { getSerialNumber } from "../../utils/slNo";
import { getAdminMentorBookings, saveAndEmailMentorMeetingLink, cancelAdminMentorBooking, rescheduleAdminMentorBooking } from "../../api/adminRecords";
import dayjs from "dayjs";

const rowsFrom = (response) => {
  const rows = Array.isArray(response) ? response : response?.data ?? response?.bookings ?? response?.mentorBookings ?? [];
  return Array.isArray(rows) ? rows : [];
};
const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");
const displayValue = (value, fallback = "NA") => value === undefined || value === null || value === "" ? fallback : value;
const getMeetingStart = (dateValue, timeSlot) => {
  const dateKey = dateValue instanceof Date ? dateValue.toISOString().slice(0, 10) : String(dateValue || "").trim().slice(0, 10);
  const match = String(timeSlot || "").trim().split("-")[0].trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();
  if (minutes > 59 || hours > 23 || (period && (hours < 1 || hours > 12))) return null;
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return new Date(`${dateKey}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+05:30`);
};
const meetingStatusAt = (booking, now) => {
  const startsAt = getMeetingStart(booking.bookingDateValue, booking.bookingTimeValue);
  if (!startsAt || Number.isNaN(startsAt.getTime())) return "Schedule invalid";
  if (startsAt <= now) return "Expired";
  return booking.meetingUrl ? "Link sent" : "Link required";
};
const mapBooking = (item, index) => {
  const user = firstValue(item.user, item.student, item.customer, item.userName, item.studentName);
  const mentor = firstValue(item.mentor, item.member, item.mentorName);
  const dateValue = firstValue(item.date, item.bookingDate, item.createdAt, item.created_at);
  const date = dateValue ? new Date(dateValue) : null;
  return {
    ...item,
    key: item.id ?? item._id ?? index,
    bookingDateValue: dateValue,
    bookingTimeValue: firstValue(item.timeSlot, item.time, item.bookingTime),
    user: typeof user === "object" ? firstValue(user.name, user.fullName, user.email) : displayValue(user),
    member: typeof mentor === "object" ? firstValue(mentor.name, mentor.fullName, mentor.email) : displayValue(mentor),
    date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("en-IN") : displayValue(dateValue),
    time: displayValue(item.time ?? item.timeSlot ?? item.bookingTime ?? (date && !Number.isNaN(date.getTime()) ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : null)),
    receivedPayment: displayValue(firstValue(item.receivedPayment, item.amount, item.paymentAmount)),
    transactionId: displayValue(firstValue(item.transactionId, item.txnId, item.paymentIntentId)),
    paymentConfirmationId: firstValue(item.paymentConfirmationId, item.confirmationId, item.razorpayPaymentId),
    meetingLinkStatus: item.meetingLinkStatus || (item.meetingUrl ? "Link sent" : "Link required"),
    status: firstValue(item.bookingStatus, "pending"),
    paymentStatus: firstValue(item.paymentStatus, item.payment?.status, "pending"),
    mentorId: item.mentorId ?? item.mentor?.id,
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
  const [meetingUrl, setMeetingUrl] = useState("");
  const [savingMeetingUrl, setSavingMeetingUrl] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [rescheduleStartTime, setRescheduleStartTime] = useState(null);
  const [rescheduleEndTime, setRescheduleEndTime] = useState(null);
  const [rescheduleMeetingUrl, setRescheduleMeetingUrl] = useState("");
  const [savingChange, setSavingChange] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    getAdminMentorBookings()
      .then((response) => setData(rowsFrom(response).map(mapBooking)))
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Could not load mentor bookings."))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => data.filter((item) =>
    [item.user, item.member, item.transactionId, item.status].join(" ").toLowerCase().includes(search.toLowerCase())
  ), [data, search]);

  const canRescheduleBooking = (record) => ["confirmed", "rescheduled"].includes(String(record.status).toLowerCase())
    && String(record.paymentStatus).toLowerCase() === "paid";
  const canCancelBooking = (record) => canRescheduleBooking(record)
    && !["Expired", "Schedule invalid"].includes(meetingStatusAt(record, now));

  const handleReset = () => setSearch("");

  const handleSaveMeetingUrl = async () => {
    const bookingId = selected?.id ?? selected?.key;
    if (!bookingId || !meetingUrl.trim()) {
      message.error("Enter the meeting URL first.");
      return;
    }
    setSavingMeetingUrl(true);
    try {
      const response = await saveAndEmailMentorMeetingLink(bookingId, meetingUrl.trim());
      const savedUrl = response?.data?.meetingUrl || meetingUrl.trim();
      setData((current) => current.map((item) => item.id === bookingId || item.key === bookingId ? { ...item, meetingUrl: savedUrl, meetingLinkStatus: "Link sent" } : item));
      message.success(response?.message || "Meeting link emailed to the student and mentor.");
      setOpen(false);
      setSelected(null);
      setMeetingUrl("");
    } catch (err) {
      message.error(err?.response?.data?.message || err?.message || "Could not save or email the meeting link.");
    } finally {
      setSavingMeetingUrl(false);
    }
  };

  const reloadBookings = async () => {
    const response = await getAdminMentorBookings();
    setData(rowsFrom(response).map(mapBooking));
  };

  const handleCancelBooking = async () => {
    if (!selected?.id || !cancelReason.trim()) { message.error("Enter a cancellation reason."); return; }
    setSavingChange(true);
    try {
      const response = await cancelAdminMentorBooking(selected.id, cancelReason.trim());
      message.success(response?.message || "Booking cancelled.");
      if (response?.data?.emailNotification && !response.data.emailNotification.sent) {
        message.error(`Email failed: ${response.data.emailNotification.failures.map((failure) => `${failure.role}${failure.email ? ` (${failure.email})` : ""}: ${failure.error}`).join("; ")}`, 10);
      }
      setCancelOpen(false); setOpen(false); setCancelReason(""); setSelected(null);
      await reloadBookings();
    } catch (err) { message.error(err?.response?.data?.message || "Could not cancel booking."); }
    finally { setSavingChange(false); }
  };

  const openReschedule = async (record) => {
    setSelected(record);
    setRescheduleDate(null);
    setRescheduleStartTime(null);
    setRescheduleEndTime(null);
    setRescheduleMeetingUrl("");
    setRescheduleOpen(true);
  };

  const handleReschedule = async () => {
    if (!selected?.id || !rescheduleDate || !rescheduleStartTime || !rescheduleEndTime) return;
    if (!rescheduleEndTime.isAfter(rescheduleStartTime)) {
      message.error("End time must be after start time.");
      return;
    }
    setSavingChange(true);
    try {
      const timeSlot = `${rescheduleStartTime.format("HH:mm")}-${rescheduleEndTime.format("HH:mm")}`;
      const response = await rescheduleAdminMentorBooking(selected.id, { date: rescheduleDate.format("YYYY-MM-DD"), timeSlot, meetingUrl: rescheduleMeetingUrl.trim() || undefined });
      message.success(response?.message || "Booking rescheduled.");
      if (response?.data?.emailNotification && !response.data.emailNotification.sent) {
        message.error(`Email failed: ${response.data.emailNotification.failures.map((failure) => `${failure.role}${failure.email ? ` (${failure.email})` : ""}: ${failure.error}`).join("; ")}`, 10);
      }
      setRescheduleOpen(false); setOpen(false); setSelected(null);
      await reloadBookings();
    } catch (err) { message.error(err?.response?.data?.message || "Could not reschedule booking."); }
    finally { setSavingChange(false); }
  };

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
      render: (_, record) => {
        const bookingStatus = String(record.status || "pending").toLowerCase();
        const linkStatus = meetingStatusAt(record, now);
        const expired = linkStatus === "Expired" || linkStatus === "Schedule invalid";
        const label = bookingStatus === "cancelled"
          ? "Cancelled"
          : bookingStatus === "rescheduled"
            ? `Rescheduled · ${linkStatus}`
            : linkStatus;
        const color = bookingStatus === "cancelled" || expired ? "red" : linkStatus === "Link sent" ? "green" : bookingStatus === "confirmed" ? "orange" : "default";
        return <Tag color={color}>{label}</Tag>;
      },
      width: 220,
    },
    {
      title: "Cancel",
      align: "center",
      width: 110,
      render: (_, record) => canCancelBooking(record)
        ? <Button size="small" type="primary" style={{ backgroundColor: "#dc2626", borderColor: "#dc2626", color: "#fff", opacity: 1, visibility: "visible", width: 84, fontWeight: 600 }} onClick={() => { setSelected(record); setCancelReason(""); setCancelOpen(true); }}>Cancel</Button>
        : null,
    },
    {
      title: "Reschedule",
      align: "center",
      width: 130,
      render: (_, record) => canRescheduleBooking(record)
        ? <Button size="small" type="primary" className="!border-[#9a2119] !bg-[#9a2119] !text-white hover:!border-[#7f1913] hover:!bg-[#7f1913] hover:!text-white" style={{ width: 112 }} onClick={() => openReschedule(record)}>Reschedule</Button>
        : null,
    },
    {
      title: "Send",
      align: "center",
      width: 80,
      render: (_, record) => String(record.status).toLowerCase() === "confirmed" && String(record.paymentStatus).toLowerCase() === "paid" && !record.meetingUrl && meetingStatusAt(record, now) !== "Expired" && meetingStatusAt(record, now) !== "Schedule invalid"
        ? <Button title="Send meeting link" onClick={() => { setSelected({ ...record, meetingLinkStatus: meetingStatusAt(record, new Date()) }); setMeetingUrl(record.meetingUrl || ""); setOpen(true); }} className="!flex !h-8 !w-8 !items-center !justify-center !border !border-[#9a2119] !text-[#9a2119] !opacity-100 !visible"><SendOutlined /></Button>
        : null,
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
        dataSource={filteredData}
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
            {(() => {
              const liveStatus = meetingStatusAt(selected, now);
              const isExpired = liveStatus === "Expired" || liveStatus === "Schedule invalid";
              return (
            <>
            {liveStatus === "Expired" && <Alert type="error" showIcon message="This booking time has expired. The meeting link must be sent before the session start time." />}
            {liveStatus === "Schedule invalid" && <Alert type="error" showIcon message="This booking has an invalid date or start time, so the meeting link cannot be sent." />}
            <p><b>User:</b> {selected.user}</p>
            <p><b>Member:</b> {selected.member}</p>
            <p><b>Date:</b> {selected.date}</p>
            <p><b>Time:</b> {selected.time}</p>
            <p><b>Received Payment:</b> {selected.receivedPayment}</p>
            <p><b>Transaction ID:</b> {selected.transactionId}</p>
            {selected.paymentConfirmationId && String(selected.paymentConfirmationId).toUpperCase() !== "NA" && (
              <p><b>Payment Confirmation ID:</b> {selected.paymentConfirmationId}</p>
            )}
            <p>
              <b>Status:</b>{" "}
              <Tag color={String(selected.status).toLowerCase() === "confirmed" ? "green" : String(selected.status).toLowerCase() === "cancelled" ? "red" : "orange"}>
                {selected.status}
              </Tag>
            </p>
            <div className="space-y-2 border-t pt-4">
              <label htmlFor="mentor-meeting-url" className="block text-sm font-semibold text-slate-700">Meeting URL</label>
              {isExpired ? null : (
              <>
              <Input
                id="mentor-meeting-url"
                type="url"
                placeholder="https://meet.google.com/..."
                value={meetingUrl}
                onChange={(event) => setMeetingUrl(event.target.value)}
              />
              <p className="m-0 text-xs text-slate-500">Saving sends the link and session details to both the student and mentor. Use an HTTPS meeting link.</p>
              <Button type="primary" loading={savingMeetingUrl} disabled={!meetingUrl.trim()} onClick={handleSaveMeetingUrl} className="!bg-[#9a2119]">
                Save & Email Meeting Link
              </Button>
              </>
              )}
            </div>
            </>
              );
            })()}
          </div>
        )}
      </Modal>

      <Modal open={cancelOpen} title="Cancel booking" onCancel={() => setCancelOpen(false)} footer={<div className="flex justify-end gap-2"><Button onClick={() => setCancelOpen(false)}>Keep booking</Button><Button type="primary" loading={savingChange} disabled={!cancelReason.trim()} onClick={handleCancelBooking} style={{ backgroundColor: "#dc2626", borderColor: "#dc2626", color: "#fff", opacity: 1, visibility: "visible", minWidth: 160 }}>Confirm cancellation</Button></div>}>
        <p>Please enter the cancellation reason. The booking status will change to cancelled and both parties will receive an email.</p>
        <AntInput.TextArea rows={4} value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} placeholder="Reason for cancellation" maxLength={1000} />
      </Modal>

      <Modal open={rescheduleOpen} title="Reschedule booking" onCancel={() => setRescheduleOpen(false)} footer={<div className="flex justify-end gap-2"><Button onClick={() => setRescheduleOpen(false)}>Cancel</Button><Button type="primary" loading={savingChange} disabled={!rescheduleDate || !rescheduleStartTime || !rescheduleEndTime || !rescheduleEndTime.isAfter(rescheduleStartTime)} onClick={handleReschedule} style={{ backgroundColor: "#9a2119", borderColor: "#9a2119", color: "#fff", opacity: 1, visibility: "visible", minWidth: 170 }}>Confirm reschedule</Button></div>}>
        <p>Choose today or any future date, then choose a start and end time.</p>
        <DatePicker
          className="w-full mb-4"
          placeholder="Select date"
          value={rescheduleDate}
          onChange={(value) => { setRescheduleDate(value); setRescheduleStartTime(null); setRescheduleEndTime(null); }}
          disabledDate={(date) => !date || date.isBefore(dayjs().startOf("day"), "day")}
        />
        <TimePicker
          popupClassName="reschedule-time-picker-popup"
          className="w-full"
          value={rescheduleStartTime}
          onChange={(value) => { setRescheduleStartTime(value); setRescheduleEndTime(null); }}
          placeholder="Start time"
          format="HH:mm"
          minuteStep={5}
          disabled={!rescheduleDate}
          disabledTime={(value) => {
            const now = dayjs();
            const isToday = rescheduleDate?.isSame(now, "day");
            return {
              disabledHours: () => isToday ? Array.from({ length: now.hour() }, (_, hour) => hour) : [],
              disabledMinutes: (hour) => isToday && hour === now.hour() ? Array.from({ length: Math.floor(now.minute() / 5) * 5 }, (_, index) => index * 5) : [],
              disabledSeconds: () => [],
            };
          }}
        />
        <TimePicker
          popupClassName="reschedule-time-picker-popup"
          className="w-full mt-3"
          placeholder="End time"
          value={rescheduleEndTime}
          onChange={setRescheduleEndTime}
          format="HH:mm"
          minuteStep={5}
          disabled={!rescheduleStartTime}
          disabledTime={() => ({
            disabledHours: () => rescheduleStartTime ? Array.from({ length: rescheduleStartTime.hour() }, (_, hour) => hour) : [],
            disabledMinutes: (hour) => rescheduleStartTime && hour === rescheduleStartTime.hour()
              ? Array.from({ length: Math.floor(rescheduleStartTime.minute() / 5) + 1 }, (_, index) => index * 5)
              : [],
          })}
        />
        <AntInput className="mt-3" type="url" value={rescheduleMeetingUrl} onChange={(event) => setRescheduleMeetingUrl(event.target.value)} placeholder="Meeting URL (optional, HTTPS)" />
      </Modal>
    </div>
  );
}
