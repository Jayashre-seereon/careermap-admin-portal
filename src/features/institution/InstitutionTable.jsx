import React from "react";
import { useState } from "react";
import { Table, Input, Tooltip, Button, Popconfirm, Avatar, Select } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { formatDateDisplay } from "../../utils/date";
import { getSerialNumber } from "../../utils/slNo";
// Explicit newest-first ordering: createdAt desc, then numeric id desc. Rows with
// no usable createdAt fall back to the previous behaviour (reverse of API order).
const sortNewestFirst = (rows) => {
  if (!Array.isArray(rows)) return [];
  const time = (row) => {
    const value = Date.parse(row?.createdAt);
    return Number.isNaN(value) ? null : value;
  };
  if (!rows.some((row) => time(row) !== null)) return [...rows].reverse();
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const ta = time(a.row);
      const tb = time(b.row);
      if (ta !== tb) return (tb ?? -Infinity) - (ta ?? -Infinity);
      const ia = Number(a.row?.id);
      const ib = Number(b.row?.id);
      if (Number.isFinite(ia) && Number.isFinite(ib) && ia !== ib) return ib - ia;
      return b.index - a.index;
    })
    .map(({ row }) => row);
};

export default function InstitutionTable({
  data,
  onView,
  onEdit,
  onDelete,
  onAddClick,
  onImportClick,
  search,
  onSearch,
  loading,
  typeFilter = "all",
  onTypeFilterChange,
  typeOptions = [],
  stateFilter = "all",
  onStateFilterChange,
  stateOptions = [],
}) {
  const [pageState, setPagination] = useState({ current: 1, pageSize: 10 });
  // Clamp the page so deleting/filtering the last rows never leaves a stale page (and wrong SL numbers).
  const rowCount = Array.isArray(data) ? data.length : 0;
  const pagination = {
    ...pageState,
    current: Math.min(pageState.current, Math.max(1, Math.ceil(rowCount / pageState.pageSize))),
  };
  const firstPage = () => setPagination((prev) => ({ ...prev, current: 1 }));

  const renderEllipsis = (text) => (
    <Tooltip title={text}>
      <span className="truncate block max-w-[200px]">{text || "-"}</span>
    </Tooltip>
  );

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

  const renderHtmlEllipsis = (text) => (
    <Tooltip title={stripHtml(text) || "-"}>
      <span className="truncate block max-w-[200px]">{stripHtml(text) || "-"}</span>
    </Tooltip>
  );

  const columns = [
    {
      title: "S.No",
      width: 60,
      render: (_, __, index) => getSerialNumber(index, pagination),
    },
    {
      title: "Logo",
      dataIndex: "logo",
      width: 90,
      render: (logo) => (
        <Avatar src={logo || undefined} size={45} shape="square" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 220,
      render: renderEllipsis,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 220,
      render: renderEllipsis,
    },
    // {
    //   title: "Admission Process",
    //   dataIndex: "admission_process",
    //   width: 180,
    //   render: renderEllipsis,
    // },
    // {
    //   title: "About",
    //   dataIndex: "about",
    //   width: 220,
    //   render: renderHtmlEllipsis,
    // },
    // {
    //   title: "Courses Offered",
    //   dataIndex: "courses_offered",
    //   width: 220,
    //   render: renderHtmlEllipsis,
    // },
    // {
    //   title: "Tentative Date",
    //   dataIndex: "tentative_date",
    //   width: 140,
    //   render: (value) => formatDateDisplay(value),
    // },
    {
      title: "Institution Type",
      dataIndex: "institute_type",
      width: 140,
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 120,
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer" className="text-[#9a2119]">
            Visit
          </a>
        ) : (
          "-"
        ),
    },
    // {
    //   title: "Country",
    //   dataIndex: "countruy",
    //   width: 120,
    // },
    // {
    //   title: "State",
    //   dataIndex: "state",
    //   width: 120,
    // },
    // {
    //   title: "City",
    //   dataIndex: "city",
    //   width: 120,
    // },
    // {
    //   title: "District",
    //   dataIndex: "district",
    //   width: 120,
    // },
    {
      title: "Action",
      align: "right",
      width: 150,
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Button
            className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]"
            onClick={() => onView(record)}
          >
            <EyeOutlined />
          </Button>
          <Button
            className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]"
            onClick={() => onEdit(record)}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this institute?"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
     <div className="w-full">
      <h1 className="text-xl font-semibold text-[#9a2119] mb-4">
        Institution Management
      </h1>
    <div className="w-full bg-white p-5 rounded-2xl shadow-md border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Institution</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search institution..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            value={search}
            onChange={(event) => { onSearch(event.target.value); firstPage(); }}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
          />
          <Select
            value={typeFilter}
            onChange={(value) => { onTypeFilterChange?.(value); firstPage(); }}
            style={{ minWidth: 160 }}
            options={[{ value: "all", label: "All types" }, ...typeOptions.map((value) => ({ value, label: value }))]}
          />
          <Select
            showSearch
            optionFilterProp="label"
            value={stateFilter}
            onChange={(value) => { onStateFilterChange?.(value); firstPage(); }}
            style={{ minWidth: 160 }}
            options={[{ value: "all", label: "All states" }, ...stateOptions.map((value) => ({ value, label: value }))]}
          />
          <Button
            onClick={() => { onSearch(""); onTypeFilterChange?.("all"); onStateFilterChange?.("all"); firstPage(); }}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>
          <Button
            onClick={onImportClick}
            icon={<UploadOutlined />}
            style={{ borderColor: "#9a2119", color: "#9a2119" }}
          >
            Upload from Excel
          </Button>
          <Button
            onClick={onAddClick}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add Institution
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={sortNewestFirst(data)}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100] }}
        locale={{ emptyText: String(search || "").trim() ? `No results for "${String(search).trim()}"` : "No data" }}
        onChange={(pag) => setPagination(pag)}
        scroll={{ x: "max-content" }}
      />
    </div>
    </div>
  );
}