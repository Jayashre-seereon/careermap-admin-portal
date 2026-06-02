import React, { useState } from "react";
import { Button, Input, Select, Table, Tag } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { initialSubscriptions } from "../plans/planData";

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredData = initialSubscriptions.filter((item) => {
    const matchesSearch = `${item.user} ${item.email} ${item.planName}`
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
    { title: "User", dataIndex: "user", width: 220, ellipsis: true },
    { title: "Email", dataIndex: "email", width: 260, ellipsis: true },
    { title: "Plan Name", dataIndex: "planName", width: 260, ellipsis: true },
    { title: "Time", dataIndex: "time", width: 140 },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <Tag color={value === "Active" ? "red" : "default"}>{value}</Tag>
      ),
      width: 130,
    },
    { title: "Expiry Date", dataIndex: "expiryDate", width: 160 },
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
              className="w-full sm:w-64"
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
          dataSource={Array.isArray(filteredData) ? [...filteredData].reverse() : []}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}

