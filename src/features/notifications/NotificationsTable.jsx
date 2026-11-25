import React,{useState} from "react";
import { Button, DatePicker, Input, Select, Table, Tag } from "antd";
import {
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getSerialNumber } from "../../utils/slNo";
const stripHtml = (text = "") =>
  String(text || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getTagColor = (value = "") => {
  const normalized = value.toLowerCase();

  if (normalized === "sent" || normalized === "active") return "green";
  if (normalized === "pending") return "gold";
  if (normalized === "failed" || normalized === "inactive") return "red";
  return "blue";
};

export default function NotificationsTable({
  data = [],
  loading,
  search,
  onSearch,
  typeFilter = "all",
  onTypeFilter,
  typeOptions = [],
  statusFilter = "all",
  onStatusFilter,
  statusOptions = [],
  dateRange = null,
  onDateRange,
  onAdd,
  onView,
})
{
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const resetPage = () => setPagination((prev) => ({ ...prev, current: 1 }));
  const columns = [
    {
      title: <span className="text-[#9a2119] font-semibold">SL</span>,
      render: (_, __, index) => getSerialNumber(index, pagination),   width: 70,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Title</span>,
      dataIndex: "title",
      width: 220,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Message</span>,
      dataIndex: "message",
      width: 320,
      ellipsis: true,
      render: (value) => stripHtml(value) || "-",
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Target</span>,
      dataIndex: "target",
      width: 160,
      ellipsis: true,
    },
    {
      title: <span className="text-[#9a2119] font-semibold">Type</span>,
      dataIndex: "type",
      width: 120,
      render: (value) => (value ? <Tag color="blue">{value}</Tag> : "-"),
    },
   
    {
      title: <span className="text-[#9a2119] font-semibold">Date</span>,
      dataIndex: "createdAt",
      width: 130,
      render: (value) => (value ? new Date(value).toLocaleDateString("en-IN") : "-"),
    },
   
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>,
      width: 90,
      fixed: "right",
      render: (_, record) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            className="border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          />
        </div>
      ),
    },
  ];

  return (

     <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Notifications Management
      </h1>
    <div className="w-full bg-white p-5 rounded-2xl shadow-md border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Notifications</h2>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search title or target..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(event) => { onSearch(event.target.value); resetPage(); }}
            className="w-full sm:w-72 h-8 rounded-md border-[#9a2119]"
          />

          <Select
            value={typeFilter}
            onChange={(value) => { onTypeFilter?.(value); resetPage(); }}
            style={{ width: 140 }}
            options={[{ value: "all", label: "All Types" }, ...typeOptions.map((v) => ({ value: v, label: v }))]}
          />

          <Select
            value={statusFilter}
            onChange={(value) => { onStatusFilter?.(value); resetPage(); }}
            style={{ width: 140 }}
            options={[{ value: "all", label: "All Status" }, ...statusOptions.map((v) => ({ value: v, label: v }))]}
          />

          <DatePicker.RangePicker value={dateRange} onChange={(value) => { onDateRange?.(value); resetPage(); }} allowClear />

          <Button
            onClick={() => { onSearch(""); onTypeFilter?.("all"); onStatusFilter?.("all"); onDateRange?.(null); resetPage(); }}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>

          <Button
            onClick={onAdd}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add Notification
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100] }}
        onChange={(pag) => setPagination(pag)}
        scroll={{ x: "max-content" }}
      />
    </div>
    </div>
  );
}

