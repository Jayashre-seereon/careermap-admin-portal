import React from "react";
import { useState } from "react";
import { Table, Input, Tooltip, Button, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { formatDateDisplay } from "../../utils/date";
import { getSerialNumber } from "../../utils/slNo";
import StatusSwitch from "../../components/ui/StatusSwitch";
export default function ScholarshipTable({
  data,
  loading,
  search,
  onSearch,
  onView,
  onEdit,
  onDelete,
  onAdd,
  onStatusChange,  
}) {
  const handleReset = () => onSearch("");

  const stripHtml = (text = "") => {
    const normalizedText = Array.isArray(text)
      ? text.join(", ")
      : typeof text === "string"
        ? text
        : text == null
          ? ""
          : String(text);

    return normalizedText
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };
const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const ellipsis = (text) => (
    <Tooltip title={stripHtml(text) || "-"}>
      <span className="truncate block max-w-[200px]">{stripHtml(text) || "-"}</span>
    </Tooltip>
  );

  const formatDate = (value) => {
    return formatDateDisplay(value);
  };

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => getSerialNumber(index, pagination),
      width: 60,
      fixed: "left",
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 220,
      render: ellipsis,
    },
    {
      title: "Amount",
      dataIndex: "price",
      width: 120,
      render: (text) => text || "-",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      width: 140,
      render: (text) => formatDate(text),
    },
    // {
    //   title: "Eligibility",
    //   dataIndex: "eligibility",
    //   width: 220,
    //   render: ellipsis,
    // },
    {
      title: "Description",
      dataIndex: "description",
      width: 250,
      render: ellipsis,
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 140,
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer" className="text-blue-600">
            Visit
          </a>
        ) : (
          "-"
        ),
    },
    {
  title: "Free Access",
  dataIndex: "is_free",
  width: 130,
  render: (_, record) => (
    <StatusSwitch
      checked={record.is_free}
      onChange={(checked) =>
        onStatusChange(record, checked)
      }
    />
  ),
},
    {
      title: "Action",
      align: "right",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onView && onView(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EyeOutlined />
          </Button>

          <Button
            onClick={() => onEdit && onEdit(record)}
            className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"
          >
            <EditOutlined />
          </Button>

          <Popconfirm
            title="Delete?"
            description="Are you sure you want to delete this scholarship?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete && onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Scholarship Management
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">
            Scholarships
          </h2>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Input
              placeholder="Search..."
              value={search}
              prefix={<SearchOutlined />}
              className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
              onChange={(e) => onSearch(e.target.value)}
            />

            <Button
              onClick={handleReset}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <ReloadOutlined /> Reset
            </Button>

            <Button
              onClick={onAdd}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              + Add
            </Button>
          </div>
        </div>

       <Table
          columns={columns}
          dataSource={Array.isArray(data) ? data : []}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={(pag) => setPagination(pag)}
          scroll={{ x: 1200 }}
        />
      </div>
    </div>
  );
}
