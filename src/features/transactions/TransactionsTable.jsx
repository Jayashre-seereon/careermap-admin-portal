import { useEffect, useRef, useState } from "react";
import { Alert, Button, DatePicker, Input, Select, Table, Tag } from "antd";
import { EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { getSerialNumber } from "../../utils/slNo";
import { getAdminTransactions } from "../../api/adminRecords";
import { formatCurrency, formatDate } from "../../utils/format";
import { PAYMENT_STATUS_LABELS, normalizePaymentStatus } from "../../utils/paymentStatus";

const { RangePicker } = DatePicker;
const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const rowsFrom = (response) => {
  const rows = Array.isArray(response) ? response : response?.data ?? response?.transactions ?? response?.payments ?? [];
  return Array.isArray(rows) ? rows : [];
};
const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");
const mapTransaction = (item, index) => {
  const user = firstValue(item.user, item.student, item.customer, item.userName, item.email);
  const dateValue = firstValue(item.date, item.createdAt, item.created_at, item.paymentDate, item.paidAt);
  const date = dateValue ? new Date(dateValue) : null;
  const status = PAYMENT_STATUS_LABELS[normalizePaymentStatus(firstValue(item.status, item.paymentStatus, "Unknown"))];
  const amount = firstValue(item.amount, item.totalAmount, item.price, item.paidAmount, item.plan?.price);
  return {
    ...item,
    key: item.id ?? item._id ?? index,
    txnId: firstValue(item.txnId, item.transactionId, item.razorpayPaymentId, item.paymentId, item.id, "—"),
    user: typeof user === "object" ? firstValue(user.name, user.fullName, user.email, "—") : user ?? "—",
    module: firstValue(item.module, item.plan?.name, item.planName, item.plan?.title, "Plan"),
    amount: formatCurrency(amount),
    method: firstValue(item.method, item.paymentMethod, item.paymentGateway, item.gateway, "—"),
    status,
    date: date ? formatDate(dateValue, dateValue ?? "—", true) : "—",
  };
};

export default function TransactionsTable({ onView }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [result, setResult] = useState({ key: "", data: [], total: 0, error: "" });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const dateFrom = dateRange?.[0] ? dateRange[0].format("YYYY-MM-DD") : "";
  const dateTo = dateRange?.[1] ? dateRange[1].format("YYYY-MM-DD") : "";
  const params = { page: pagination.current, limit: pagination.pageSize };
  if (debouncedSearch) params.search = debouncedSearch;
  if (statusFilter !== "all") params.status = statusFilter;
  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;
  const queryKey = JSON.stringify(params);
  const loading = result.key !== queryKey;
  const data = result.data;
  const total = result.total;
  const error = result.error;

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const query = JSON.parse(queryKey);
    getAdminTransactions(query)
      .then((response) => {
        if (requestId !== requestIdRef.current) return;
        const rows = rowsFrom(response);
        setResult({ key: queryKey, data: rows.map(mapTransaction), total: response?.pagination?.total ?? rows.length, error: "" });
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setResult({ key: queryKey, data: [], total: 0, error: err?.response?.data?.message || err?.message || "Could not load transactions." });
      });
  }, [queryKey]);

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setDateRange(null);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const columns = [
    { title: <span className="text-[#9a2119] font-semibold">SL</span>, render: (_, __, index) => getSerialNumber(index, pagination), width: 60 },
    { title: <span className="text-[#9a2119] font-semibold">Transaction ID</span>, dataIndex: "txnId" },
    { title: <span className="text-[#9a2119] font-semibold">User</span>, dataIndex: "user" },
    { title: <span className="text-[#9a2119] font-semibold">Module</span>, dataIndex: "module" },
    { title: <span className="text-[#9a2119] font-semibold">Amount</span>, dataIndex: "amount" },
    { title: <span className="text-[#9a2119] font-semibold">Method</span>, dataIndex: "method" },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>, dataIndex: "status",
      render: (status) => <Tag color={status === "Paid" ? "green" : status === "Pending" ? "orange" : status === "Failed" ? "red" : "default"}>{status}</Tag>,
    },
    { title: <span className="text-[#9a2119] font-semibold">Date</span>, dataIndex: "date" },
    {
      title: <span className="text-[#9a2119] font-semibold">Action</span>, align: "right",
      render: (_, record) => <div className="flex justify-end"><Button aria-label="View transaction" onClick={() => onView?.(record)} className="w-8 h-8 border border-[#9a2119] text-[#9a2119] rounded-md"><EyeOutlined /></Button></div>,
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">Transactions Management</h1>
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#9a2119]">Plan Transactions</h2>
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <Select value={statusFilter} options={STATUS_OPTIONS} className="w-full sm:w-36" onChange={(value) => { setStatusFilter(value); setPagination((prev) => ({ ...prev, current: 1 })); }} />
            <RangePicker value={dateRange} className="w-full sm:w-64" onChange={(value) => { setDateRange(value); setPagination((prev) => ({ ...prev, current: 1 })); }} />
            <Input placeholder="Search id, user, plan, amount, status..." value={search} prefix={<SearchOutlined className="text-[#9a2119]" />} className="h-8 w-full rounded-md border-[#9a2119] sm:w-64" onChange={(e) => setSearch(e.target.value)} />
            <Button onClick={resetFilters} style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}><ReloadOutlined />Reset</Button>
          </div>
        </div>
        {error && <Alert className="mb-4" type="error" showIcon message={error} />}
        <Table columns={columns} dataSource={data} loading={loading} pagination={{ ...pagination, total }} onChange={(pag) => setPagination({ current: pag.current, pageSize: pag.pageSize })} rowClassName="hover:bg-gray-50" scroll={{ x: true }} />
      </div>
    </div>
  );
}
