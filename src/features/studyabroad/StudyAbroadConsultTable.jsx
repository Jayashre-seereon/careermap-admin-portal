import React, { useState } from "react";
import { Table, Input, Tag, Button, Space, Tooltip, message } from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { getSerialNumber } from "../../utils/slNo";

const stripHtml = (text = "") => {
  const normalizedText = typeof text === "string" ? text : text == null ? "" : String(text);
  return normalizedText
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export default function StudyAbroadConsultTable({
  data,
  loading,
  search,
  onSearch,
  onView,
}) {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  const handleExportExcel = () => {
    if (!data || data.length === 0) {
      message.warning("No data available to export.");
      return;
    }

    const headers = [
      "SL",
      "User Name",
      "Email",
      "Mobile",
      "Preferred Country",
      "Course Interest",
      "Budget Range",
      "Preferred Intake",
      "Message",
      "Status",
      "Date",
    ];

    const csvRows = [];
    csvRows.push(headers.join(","));

    data.forEach((item, index) => {
      const sl = index + 1;
      const userName = item.user
        ? [item.user.firstName, item.user.lastName].filter(Boolean).join(" ")
        : item.userId
        ? `ID: ${item.userId}`
        : "-";
      const email = item.user?.email || "-";
      const mobile = item.user?.mobile || "-";
      const country = item.preferredCountry || "-";
      const course = item.courseInterest || "-";
      const budget = item.budgetRange || "-";
      const intake = item.preferredIntake || "-";
      
      const messageText = item.message
        ? item.message.replace(/"/g, '""').replace(/\r?\n|\r/g, " ")
        : "-";
      const status = item.status || "pending";
      const date = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "-";

      const row = [
        sl,
        `"${userName.replace(/"/g, '""')}"`,
        `"${email.replace(/"/g, '""')}"`,
        `"${mobile.replace(/"/g, '""')}"`,
        `"${country.replace(/"/g, '""')}"`,
        `"${course.replace(/"/g, '""')}"`,
        `"${budget.replace(/"/g, '""')}"`,
        `"${intake.replace(/"/g, '""')}"`,
        `"${messageText}"`,
        `"${status.replace(/"/g, '""')}"`,
        `"${date.replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "\ufeff" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Study_Abroad_Consultations_${new Date().toISOString().slice(0, 10)}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Excel export completed successfully!");
  };

  const ellipsis = (text) => (
    <Tooltip title={stripHtml(text) || "-"}>
      <span className="block max-w-[200px] truncate">{stripHtml(text) || "-"}</span>
    </Tooltip>
  );

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case "pending":
        return "gold";
      case "approved":
      case "completed":
      case "success":
        return "green";
      case "rejected":
      case "cancelled":
        return "red";
      case "in-progress":
      case "processing":
        return "blue";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => getSerialNumber(index, pagination),
      width: 60,
      fixed: "left",
    },
    {
      title: "User",
      key: "user",
      width: 180,
      render: (_, record) => {
        if (record.user) {
          const name = [record.user.firstName, record.user.lastName].filter(Boolean).join(" ");
          return (
            <div>
              <div className="font-semibold text-gray-800">{name || "Unnamed"}</div>
              <div className="text-xs text-gray-500">{record.user.email || ""}</div>
            </div>
          );
        }
        return <span className="text-gray-500">ID: {record.userId || "-"}</span>;
      },
    },
    {
      title: "Preferred Country",
      dataIndex: "preferredCountry",
      width: 150,
      render: ellipsis,
    },
    {
      title: "Course Interest",
      dataIndex: "courseInterest",
      width: 160,
      render: ellipsis,
    },
    {
      title: "Budget Range",
      dataIndex: "budgetRange",
      width: 140,
      render: ellipsis,
    },
    {
      title: "Preferred Intake",
      dataIndex: "preferredIntake",
      width: 150,
      render: ellipsis,
    },
    {
      title: "Message",
      dataIndex: "message",
      width: 200,
      render: ellipsis,
    },
    
    {
      title: "Date",
      dataIndex: "createdAt",
      width: 150,
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Action",
      align: "right",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => onView(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
            icon={<EyeOutlined />}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full">
    

      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Consultations</h2>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined />}
              className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Button
              onClick={() => onSearch("")}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <ReloadOutlined /> Reset
            </Button>
            <Button
              onClick={handleExportExcel}
              style={{ background: "#217346", borderColor: "#217346", color: "white" }}
              icon={<FileExcelOutlined />}
            >
              Export Excel
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={(pag) => setPagination(pag)}
          scroll={{ x: 1300 }}
        />
      </div>
    </div>
  );
}
