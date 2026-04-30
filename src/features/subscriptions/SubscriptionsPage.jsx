import React, { useState } from "react";
import { Button, Input, Select, Table, Tag } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const initialSubscriptions = [
  {
    id: 1,
    user: "Rahul Sharma",
    planName: "Premium Career Plan",
    time: "12 Months",
    status: "Active",
    expiryDate: "2026-12-31",
  },
  {
    id: 2,
    user: "Priya Das",
    planName: "Mentor Plus",
    time: "6 Months",
    status: "Inactive",
    expiryDate: "2026-08-15",
  },
  {
    id: 3,
    user: "Amit Kumar",
    planName: "Scholarship Access",
    time: "3 Months",
    status: "Active",
    expiryDate: "2026-06-30",
  },
];

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredData = initialSubscriptions.filter((item) => {
    const matchesSearch = `${item.user} ${item.planName}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status === "All" || item.status === status;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
      width: 70,
    },
    { title: "User", dataIndex: "user" },
    { title: "Plan Name", dataIndex: "planName" },
    { title: "Time", dataIndex: "time" },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <Tag color={value === "Active" ? "red" : "default"}>{value}</Tag>
      ),
    },
    { title: "Expiry Date", dataIndex: "expiryDate" },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#9a2119]">Subscription Management</h2>

      <div className="bg-white p-5 rounded-2xl shadow-md border">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search user or plan..."
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-64"
            />
            <Select
              value={status}
              onChange={setStatus}
              className="w-36"
              options={[
                { label: "All", value: "All" },
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </div>

          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearch("");
              setStatus("All");
            }}
            style={{ color: "#9a2119", borderColor: "#9a2119" }}
          >
            Reset
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}
