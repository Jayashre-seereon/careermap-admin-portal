import React, { useMemo, useState } from "react";
import { Table, Button, Input, Select, Space, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";
import { getSerialNumber } from "../../utils/slNo";

export default function NewsletterTable({ data, onAddClick, onView, onEdit, onDelete, loading }) {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const [typeFilter, setTypeFilter] = useState("all");
  const resetPage = () => setPagination((prev) => ({ ...prev, current: 1 }));
  const typeOptions = useMemo(
    () => [...new Set((data || []).map((item) => String(item.type || "").trim()).filter(Boolean))].sort(),
    [data]
  );
  const query = (search || "").trim().toLowerCase();
  const filtered = (data || []).filter((item) => {
    if (typeFilter !== "all" && String(item.type || "").trim() !== typeFilter) return false;
    if (!query) return true;
    const description = String(item.description || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
    return [item.title, description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
  // Clamp the controlled page so serial numbers stay correct after a delete/filter shrinks the list.
  const lastPage = Math.max(1, Math.ceil(filtered.length / pagination.pageSize));
  const activePagination = { ...pagination, current: Math.min(pagination.current, lastPage) };

  const getFileMeta = (file) => {
    if (!file) return null;

    const fileName = decodeURIComponent(file.split("/").pop().split("?")[0]);
    const ext = fileName.split(".").pop().toLowerCase();

    const isImage = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext);
    const isPdf = ext === "pdf";
    const isDoc = ["doc", "docx"].includes(ext);

    let icon = <FileUnknownOutlined />;
    if (isImage) icon = <FileImageOutlined />;
    else if (isPdf) icon = <FilePdfOutlined />;
    else if (isDoc) icon = <FileWordOutlined />;

    return { fileName, ext, isImage, isPdf, isDoc, icon };
  };

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => getSerialNumber(index, activePagination),
      width: 70,
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 120,
    },
    {
      title: "File",
      dataIndex: "image",
      width: 160,
      render: (file) => {
        const meta = getFileMeta(file);
        if (!meta) return "-";

        return (
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-start gap-1 no-underline"
          >
            {meta.isImage ? (
              <img
                src={file}
                alt={meta.fileName}
                className="w-16 h-16 object-cover rounded border"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center rounded border bg-gray-50 text-2xl text-[#9a2119]">
                {meta.icon}
              </div>
            )}

            <span className="text-xs text-[#9a2119] underline break-all max-w-[140px]">
              {meta.fileName}
            </span>
          </a>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 250,
      ellipsis: true,
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 200,
      ellipsis: true,
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#9a2119] underline">
            {url}
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Action",
      fixed: "right",
      width: 150,
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
          <Popconfirm title="Are you sure you want to delete this newsletter?" onConfirm={() => onDelete(record)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">News letters</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search title or description..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          />
          <Select
            value={typeFilter}
            onChange={(value) => { setTypeFilter(value); resetPage(); }}
            style={{ width: 150 }}
            options={[{ value: "all", label: "All Types" }, ...typeOptions.map((v) => ({ value: v, label: v }))]}
          />
          <Button
            onClick={() => { setSearch(""); setTypeFilter("all"); resetPage(); }}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>
          <Button
            onClick={onAddClick}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add Newsletter
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(filtered) ? [...filtered].reverse() : []}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{ ...activePagination, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100] }}
        onChange={(pag) => setPagination(pag)}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}