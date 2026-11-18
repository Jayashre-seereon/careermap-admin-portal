import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Select, Table, Tag } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "../../api/axios";
import { getSerialNumber } from "../../utils/slNo";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
};

const getStatus = (record) =>
  String(record.isExpired ? "expired" : record.status || "unknown").toLowerCase();

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/admin/subscribers");
      const payload = response.data;
      const rows = Array.isArray(payload) ? payload : payload?.data;
      setSubscriptions(Array.isArray(rows) ? rows : []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Could not load subscriptions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    return subscriptions.filter((item) => {
      const matchesSearch =
        !query ||
        [item.userName, item.userEmail, item.userMobile, item.planName, item.planType]
          .some((value) => String(value ?? "").toLowerCase().includes(query));
      const matchesStatus = status === "All" || getStatus(item) === status;
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, search, status]);

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => getSerialNumber(index, pagination),
      width: 70,
    },
    { title: "User", dataIndex: "userName", width: 220, ellipsis: true, render: (v) => v || "-" },
    { title: "Email", dataIndex: "userEmail", width: 260, ellipsis: true, render: (v) => v || "-" },
    { title: "Plan Name", dataIndex: "planName", width: 260, ellipsis: true, render: (v) => v || "-" },
    { title: "Start Date", dataIndex: "startDate", width: 140, render: formatDate },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const value = getStatus(record);
        return (
          <Tag color={value === "active" ? "green" : value === "expired" ? "red" : "default"}>
            {value}
          </Tag>
        );
      },
      width: 130,
    },
    { title: "Expiry Date", dataIndex: "endDate", width: 160, render: formatDate },
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
              onChange={(event) => {
                setSearch(event.target.value);
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
              className="w-full sm:w-64"
            />
            <Select
              value={status}
              onChange={(value) => {
                setStatus(value);
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
              className="w-36"
              options={[
                { label: "All", value: "All" },
                { label: "Active", value: "active" },
                { label: "Expired", value: "expired" },
                { label: "Cancelled", value: "cancelled" },
              ]}
            />
          </div>

          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearch("");
              setStatus("All");
              setPagination((prev) => ({ ...prev, current: 1 }));
              loadSubscriptions();
            }}
            style={{ color: "#9a2119", borderColor: "#9a2119" }}
          >
            Reset
          </Button>
        </div>

        {error && (
          <Alert
            className="mb-4"
            type="error"
            showIcon
            message="Unable to load subscriptions"
            description={error}
          />
        )}

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey={(record) => record.id ?? `${record.userId}-${record.planId}-${record.createdAt}`}
          pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: [10, 20, 50] }}
          onChange={(pag) => setPagination({ current: pag.current, pageSize: pag.pageSize })}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}
