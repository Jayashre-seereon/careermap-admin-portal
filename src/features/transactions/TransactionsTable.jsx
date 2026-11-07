import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Table, Tag } from "antd";
import { EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { getSerialNumber } from "../../utils/slNo";
import { getAdminTransactions } from "../../api/adminRecords";

const rowsFrom = (response) => {
  const rows = Array.isArray(response) ? response : response?.data ?? response?.transactions ?? response?.payments ?? [];
  return Array.isArray(rows) ? rows : [];
};
const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");
const mapTransaction = (item, index) => {
  const user = firstValue(item.user, item.student, item.customer, item.userName, item.email);
  const dateValue = firstValue(item.date, item.createdAt, item.created_at, item.paymentDate, item.paidAt);
  const date = dateValue ? new Date(dateValue) : null;
  const rawStatus = String(firstValue(item.status, item.paymentStatus, "Unknown"));
  const status = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
  const amount = firstValue(item.amount, item.totalAmount, item.price, item.paidAmount, item.plan?.price);
  return {
    ...item,
    key: item.id ?? item._id ?? index,
    txnId: firstValue(item.txnId, item.transactionId, item.razorpayPaymentId, item.paymentId, item.id, "—"),
    user: typeof user === "object" ? firstValue(user.name, user.fullName, user.email, "—") : user ?? "—",
    module: firstValue(item.module, item.plan?.name, item.planName, item.plan?.title, "Plan"),
    amount: amount === undefined ? "—" : `₹${amount}`,
    method: firstValue(item.method, item.paymentMethod, item.paymentGateway, item.gateway, "—"),
    status,
    date: date && !Number.isNaN(date.getTime()) ? date.toLocaleString("en-IN") : dateValue ?? "—",
  };
};

export default function TransactionsTable({ onView }) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });

  useEffect(() => {
    getAdminTransactions()
      .then((response) => setData(rowsFrom(response).map(mapTransaction)))
      .catch((err) => setError(err?.response?.data?.message || err?.message || "Could not load transactions."))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = useMemo(() => data.filter((item) =>
    [item.txnId, item.user, item.module, item.status].join(" ").toLowerCase().includes(search.toLowerCase())
  ), [data, search]);

  const columns = [
    { title: <span className="text-[#9a2119] font-semibold">SL</span>, render: (_, __, index) => getSerialNumber(index, pagination), width: 60 },
    { title: <span className="text-[#9a2119] font-semibold">Transaction ID</span>, dataIndex: "txnId" },
    { title: <span className="text-[#9a2119] font-semibold">User</span>, dataIndex: "user" },
    { title: <span className="text-[#9a2119] font-semibold">Module</span>, dataIndex: "module" },
    { title: <span className="text-[#9a2119] font-semibold">Amount</span>, dataIndex: "amount" },
    { title: <span className="text-[#9a2119] font-semibold">Method</span>, dataIndex: "method" },
    {
      title: <span className="text-[#9a2119] font-semibold">Status</span>, dataIndex: "status",
      render: (status) => <Tag color={status === "Paid" || status === "Success" ? "green" : status === "Pending" ? "orange" : status === "Failed" ? "red" : "default"}>{status}</Tag>,
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
            <Input placeholder="Search transactions..." value={search} prefix={<SearchOutlined className="text-[#9a2119]" />} className="h-8 w-full rounded-md border-[#9a2119] sm:w-64" onChange={(e) => setSearch(e.target.value)} />
            <Button onClick={() => setSearch("")} style={{ background: "#9a2119", borderColor: "#9a2119", color: "white" }}><ReloadOutlined />Reset</Button>
          </div>
        </div>
        {error && <Alert className="mb-4" type="error" showIcon message={error} />}
        <Table columns={columns} dataSource={[...filteredData].reverse()} loading={loading} pagination={pagination} onChange={setPagination} rowClassName="hover:bg-gray-50" scroll={{ x: true }} />
      </div>
    </div>
  );
}
