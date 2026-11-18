import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Select, Spin, Table, Tag } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import api from "../../api/axios";
import { formatCurrency } from "../../utils/format";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
};

const formatAmount = (value) => formatCurrency(value);

export default function Subscribers() {
  const [search, setSearch] = useState("");
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const loadSubscribers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/admin/subscribers");
      const payload = response.data;
      const rows = Array.isArray(payload) ? payload : payload?.data;
      setSubscribers(Array.isArray(rows) ? rows : []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Could not load subscribers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscribers();
  }, [loadSubscribers]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    return subscribers.filter((item) => {
      if (statusFilter !== "all") {
        const isExpired = Boolean(item.isExpired) || String(item.status ?? "").toLowerCase() === "expired";
        if (statusFilter === "expired" ? !isExpired : isExpired) return false;
      }
      if (!query) return true;
      return [item.userName, item.userEmail, item.userMobile, item.planName, item.planType, item.status]
        .some((value) => String(value ?? "").toLowerCase().includes(query));
    });
  }, [search, statusFilter, subscribers]);

  const columns = [
    { title: "Subscriber", dataIndex: "userName", key: "userName", render: (value) => value || "—" },
    { title: "Email", dataIndex: "userEmail", key: "userEmail", render: (value) => value || "—" },
    { title: "Mobile", dataIndex: "userMobile", key: "userMobile", render: (value) => value || "—" },
    { title: "Plan", dataIndex: "planName", key: "planName", render: (value) => value || "—" },
    { title: "Type", dataIndex: "planType", key: "planType", render: (value) => value || "—" },
    { title: "Amount", key: "amount", render: (_, record) => formatAmount(record.amount ?? record.planPrice) },
    { title: "Start Date", dataIndex: "startDate", key: "startDate", render: formatDate },
    { title: "End Date", dataIndex: "endDate", key: "endDate", render: formatDate },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const status = record.isExpired ? "expired" : record.status || "unknown";
        return <Tag color={status.toLowerCase() === "active" ? "green" : status.toLowerCase() === "expired" ? "red" : "default"}>{status}</Tag>;
      },
    },
    { title: "Subscribed At", dataIndex: "createdAt", key: "createdAt", render: formatDate },
  ];

  return (
    <div className="w-full">
      <h1 className="mb-6 text-xl font-semibold text-[#9a2119]">Subscribers List</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Subscribed Users ({subscribers.length})</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search subscribers..."
              value={search}
              prefix={<SearchOutlined className="text-[#9a2119]" />}
              className="h-8 w-full rounded-md border-[#9a2119] sm:w-64"
              onChange={(event) => { setSearch(event.target.value); setPagination((prev) => ({ ...prev, current: 1 })); }}
            />
            <Select
              value={statusFilter}
              onChange={(value) => { setStatusFilter(value); setPagination((prev) => ({ ...prev, current: 1 })); }}
              className="w-36"
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "expired", label: "Expired" },
              ]}
            />
            <Button onClick={() => { setSearch(""); setStatusFilter("all"); setPagination((prev) => ({ ...prev, current: 1 })); }} style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}>
              <ReloadOutlined /> Reset
            </Button>
          </div>
        </div>
        {error && <Alert className="mb-4" type="error" showIcon message="Unable to load subscribers" description={error} />}
        <Table
          rowKey={(record) => record.id ?? `${record.userId}-${record.planId}-${record.createdAt}`}
          columns={columns}
          dataSource={filteredData}
          loading={{ spinning: loading, indicator: <Spin /> }}
          locale={{ emptyText: loading ? "Loading subscribers..." : "No subscribers found" }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            onChange: (current, pageSize) => setPagination({ current, pageSize }),
          }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}
