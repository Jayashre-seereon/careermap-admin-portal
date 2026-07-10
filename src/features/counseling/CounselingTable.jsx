import React from "react";
import { Button, Input, Popconfirm, Space, Table, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const stripHtml = (value = "") =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getPreviewText = (value = "", maxLength = 34) => {
  const text = stripHtml(String(value));
  if (!text) return "-";
  return text.length > maxLength ? `${text.slice(0, maxLength)}.....` : text;
};

// Keep this in sync with CounselingForm.jsx's CATEGORY_OPTIONS.
// Consider moving both to a shared constants file to avoid duplication.
const CATEGORY_LABELS = {
  A: "Absolutely clear about future career options",
  B: "Confused between two/three career options",
  C: "Parents and student differ on career options",
  D: "Changing career options frequently",
  E: "Vague knowledge about career options",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMarks = (marks) => {
  if (!marks || typeof marks !== "object") return "-";
  const entries = Object.entries(marks).filter(([, value]) => value !== null && value !== undefined && value !== "");
  if (entries.length === 0) return "-";
  const preview = entries.map(([subject, value]) => `${subject}: ${value}`).join(", ");
  return getPreviewText(preview, 40);
};

function CounselingTable({
  data,
  loading,
  onAddClick,
  onView,
  onEdit,
  onDelete,
  search,
  onSearch,
  onDownload,
}) {
  const columns = [
    { title: "#", render: (_, __, index) => index + 1, width: 60 },
    { title: "Student Name", dataIndex: "studentName", width: 160, ellipsis: true },
    { title: "Class", dataIndex: "class", width: 90 },
    { title: "Stream", dataIndex: "stream", width: 110, render: (value) => value || "-" },
    { title: "School", dataIndex: "school", width: 160, ellipsis: true },
    { title: "Phone", dataIndex: "phoneNumber", width: 130, ellipsis: true },
    { title: "Email", dataIndex: "email", width: 200, ellipsis: true },
    {
      title: "Date",
      dataIndex: "counselingDate",
      width: 120,
      render: (value) => formatDate(value),
    },
    {
      title: "Marks",
      dataIndex: "marks",
      width: 220,
      ellipsis: true,
      render: (value) => formatMarks(value),
    },
    {
      title: "Dream Career",
      width: 220,
      ellipsis: true,
      render: (_, record) =>
        getPreviewText(
          [record.dreamCareerOption1, record.dreamCareerOption2, record.dreamCareerOption3]
            .filter(Boolean)
            .join(", "),
          40
        ),
    },
   {
  title: "Category",
  dataIndex: "category",
  width: 260,
  ellipsis: true,
  render: (value) => (value ? <span title={value}>{getPreviewText(value, 40)}</span> : "-"),
},
    {
      title: "Counselor",
      dataIndex: "counselorName",
      width: 140,
      ellipsis: true,
    },
    {
      title: "Psychometric",
      dataIndex: "psychometricRecommended",
      width: 130,
      render: (value) => (value ? "Recommended" : "Not Recommended"),
    },
    {
      title: "Actions",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          />

          <Button
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />

          <Button
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<DownloadOutlined />}
            onClick={() => onDownload(record)}
          />

          <Popconfirm
            title="Are you sure you want to delete this counseling?"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Counseling</h2>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <Input
            placeholder="Search counseling..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
          />
          <Button
            onClick={() => onSearch("")}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>
          <Button
            onClick={onAddClick}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? [...data].reverse() : []}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export default CounselingTable;