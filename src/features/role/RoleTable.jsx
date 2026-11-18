import React, { useState } from "react";
import { Button, Input, Popconfirm, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getSerialNumber } from "../../utils/slNo";

function RoleTable({ data, loading, onAddClick, onView, onEdit, onDelete, search, onSearch }) {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const rowCount = Array.isArray(data) ? data.length : 0;
  const lastPage = Math.max(1, Math.ceil(rowCount / pagination.pageSize));
  const activePagination = { ...pagination, current: Math.min(pagination.current, lastPage) };

  const columns = [
    {
      title: "S.No",
      width: 70,
      render: (_, __, index) => getSerialNumber(index, activePagination),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Action",
      align: "right",
      width: 150,
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            onClick={() => onView(record)}
          >
            <EyeOutlined />
          </Button>
          <Button
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            onClick={() => onEdit(record)}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this role?"
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
      <h1 className="mb-4 text-xl font-semibold text-[#9a2119]">Role Management</h1>
      <div className="rounded-2xl border bg-white p-5 shadow-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Roles</h2>

          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search roles..."
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              value={search}
              onChange={(event) => { onSearch(event.target.value); setPagination((prev) => ({ ...prev, current: 1 })); }}
              className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
            />
            <Button
              onClick={() => { onSearch(""); setPagination((prev) => ({ ...prev, current: 1 })); }}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              <ReloadOutlined />
              Reset
            </Button>
            <Button
              onClick={onAddClick}
              style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}
            >
              + Add Role
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={Array.isArray(data) ? [...data].reverse() : []}
          rowKey={(record) => record.id}
          loading={loading}
          pagination={{ ...activePagination, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100] }}
          locale={{ emptyText: String(search || "").trim() ? `No results for "${String(search).trim()}"` : "No data" }}
          onChange={(pag) => setPagination(pag)}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}

export default RoleTable;
