import React, { useMemo, useState } from "react";
import { Table, Button, Input, Select, Space, Popconfirm, Tag,Switch  } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { getSerialNumber } from "../../utils/slNo";
const getPlainText = (value) => {
  if (!value) {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export default function CategoryTable({ data, onAddClick, onView, onEdit, onDelete, loading, onTogglePreview, }) {
  const [search, setSearch] = useState("");
const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [streamFilter, setStreamFilter] = useState("all");
  const resetPage = () => setPagination((prev) => ({ ...prev, current: 1 }));
  const getStreamKey = (item) => String(item.streamObj?.id ?? item.streamId ?? "");
  const streamOptions = useMemo(() => {
    const seen = new Map();
    (data || []).forEach((item) => {
      const key = getStreamKey(item);
      const name = item.streamObj?.name;
      if (key && name && !seen.has(key)) seen.set(key, name);
    });
    return [...seen.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);
  const query = (search || "").trim().toLowerCase();
  const filtered = (data || []).filter((item) => {
    if (streamFilter !== "all" && getStreamKey(item) !== streamFilter) return false;
    if (!query) return true;
    return [item.title, item.streamObj?.name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
  const lastPage = Math.max(1, Math.ceil(filtered.length / pagination.pageSize));
  const activePagination = { ...pagination, current: Math.min(pagination.current, lastPage) };

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => getSerialNumber(index, activePagination),
      width: 70,
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 120,
      ellipsis: true,
    },
    {
  title: "Stream",
  width: 150,
  render: (_, record) => record.streamObj?.name || "-"
},
    {
      title:"Cover Image",
      dataIndex:"coverImage",
      width:150,
      render:(coverImage)=><img src={coverImage} alt="Cover" className="w-16 h-16 object-cover rounded" />
    },
   
  {
  title: "Preview",
  dataIndex: "isUpgrade",
  width: 120,
  render: (_, record) => (
    <Switch
      checked={record.isUpgrade === "Free"}
      checkedChildren="ON"
      unCheckedChildren="OFF"
      onChange={(checked) =>
        onTogglePreview(record, checked)
      }
    />
  ),
},
    {
      title: "Action",
      fixed: "right",
      width: 150,
      render: (_, record, index) => (
        <Space>
          <Button className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                      " icon={<EyeOutlined />} onClick={() => onView(record)} />
          <Button className="w-8 h-8 flex items-center justify-center rounded-md 
                       border border-[#9a2119] 
                       text-[#9a2119]
                       hover:border-[#e57373]
                       hover:text-[#e57373]
                      " icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm title="Are you sure you want to delete this category?" onConfirm={() => onDelete(record)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow border">

      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Category</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search category..."
            prefix={<SearchOutlined className="text-[#9a2119]" />}
            className="w-full sm:w-64 h-8 rounded-md border-[#9a2119]"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          />
          <Select
            value={streamFilter}
            onChange={(value) => { setStreamFilter(value); resetPage(); }}
            style={{ width: 180 }}
            showSearch
            optionFilterProp="label"
            options={[{ value: "all", label: "All Streams" }, ...streamOptions]}
          />
          <Button
            onClick={() => { setSearch(""); setStreamFilter("all"); resetPage(); }}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            <ReloadOutlined />
            Reset
          </Button>
          <Button
            onClick={onAddClick}
            style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
          >
            + Add Category
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
