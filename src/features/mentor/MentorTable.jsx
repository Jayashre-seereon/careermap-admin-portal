import React from "react";
import { Table, Button, Tag, Avatar, Space, Popconfirm, Input } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

function MentorTable({
  data,
  loading,
  onAddClick,
  onView,
  onEdit,
  onDelete,
  search,
  onSearch,
}) {
  const columns = [
    {
      title: "SL No.",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (img) => <Avatar src={img} size={40} />,
      width: 100,
    },
    { title: "Name", dataIndex: "name", width: 100 },
    { title: "Email", dataIndex: "email", width: 100, ellipsis: true },
    { title: "Phone", dataIndex: "phone_number", width: 100 },
    { title: "Date of Birth", dataIndex: "dob", width: 100 },
    {
      title: "Availability",
      dataIndex: "availabilityDisplay",
      width: 100,
      render: (value, record) => {
        const entries = Array.isArray(value) && value.length > 0 ? value : [];

        if (entries.length === 0) {
          return record.availabilitySummary || "-";
        }

        return (
          <div className="space-y-2 whitespace-normal">
            {entries.map((entry, index) => (
              <div
                key={`${entry.date}-${index}`}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-[#9a2119]">
                  {entry.date}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {entry.timeSlots.length > 0 ? (
                    entry.timeSlots.map((slot) => (
                      <Tag key={`${entry.date}-${slot}`} color="red" className="mr-0">
                        {slot}
                      </Tag>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    { title: "Education", dataIndex: "education", width: 100, ellipsis: true },
    { title: "Designation", dataIndex: "designation", width: 100, ellipsis: true },
    { title: "Rank", dataIndex: "rank", width: 100, ellipsis: true },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === false ? "default" : "red"}>
          {status === false ? "Inactive" : "Active"}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            className="border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          />
          <Button
            className="border border-[#9a2119] text-[#9a2119] hover:border-[#e57373] hover:text-[#e57373]"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this mentor?"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl shadow-md border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[#9a2119]">Mentor</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search mentor..."
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
            + Add Mentor
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

export default MentorTable;
