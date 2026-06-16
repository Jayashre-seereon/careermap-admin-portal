import React from "react";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

function StaffTable({
  data,
  roles = [],
  loading,
  onAddClick,
  onView,
  onEdit,
  onDelete,
  search,
  onSearch,
}) {
  const getRoleName = (roleId) => roles.find((role) => role.id === roleId)?.name || "-";

  const columns = [
    { title: "#", render: (_, __, index) => index + 1, width: 60 },
    { title: "Name", dataIndex: "name", width: 180, ellipsis: true },
    { title: "Email", dataIndex: "email", width: 220, ellipsis: true },
    {
      title: "Role",
      dataIndex: "roleId",
      width: 160,
      render: (roleId) => getRoleName(roleId),
    },
    {
      title: "Actions",
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
          <Popconfirm
            title="Are you sure you want to delete this staff member?"
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
        <h2 className="text-lg font-semibold text-[#9a2119]">Staff</h2>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <Input
            placeholder="Search staff..."
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

export default StaffTable;