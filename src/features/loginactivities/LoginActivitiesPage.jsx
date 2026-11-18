import { useEffect, useRef, useState } from "react";
import { message, Modal } from "antd";
import LoginActivitiesTable from "./LoginActivitiesTable";
import { getUserHistory } from "../../api/userhistory";
import { formatDateTimeDisplay } from "../../utils/date";

const getApiErrorMessage = (error, fallbackMessage) =>
  error.response?.data?.message || error.message || fallbackMessage;

const normalizeList = (response) => {
  const list = response?.data;

  if (Array.isArray(list)) {
    return list;
  }

  if (list && typeof list === "object") {
    return [list];
  }

  return [];
};

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  return formatDateTimeDisplay(value, String(value));
};

const mapHistory = (item = {}) => ({
  id: item.id,
  userId: item.userId ?? "",
  userName: [item.user?.firstName, item.user?.lastName].filter(Boolean).join(" ").trim(),
  userEmail: item.user?.email || "",
  userMobile: item.user?.mobile || "",
  ipAddress: item.ipAddress || "",
  location: item.location || "",
  device: item.device || "",
  browser: item.browser || "",
  os: item.os || "",
  loginAt: item.loginAt || "",
  createdAt: item.createdAt || "",
  updatedAt: item.updatedAt || "",
});

export default function LoginActivitiesPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState({ key: "", data: [], total: 0 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState(null);
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
  const queryParams = { page: pagination.current, limit: pagination.pageSize };
  if (debouncedSearch) queryParams.search = debouncedSearch;
  if (dateFrom) queryParams.dateFrom = dateFrom;
  if (dateTo) queryParams.dateTo = dateTo;
  const queryKey = JSON.stringify(queryParams);
  const loading = result.key !== queryKey;

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    getUserHistory(JSON.parse(queryKey))
      .then((response) => {
        if (requestId !== requestIdRef.current) return;
        const rows = normalizeList(response).map(mapHistory);
        setResult({ key: queryKey, data: rows, total: response?.pagination?.total ?? rows.length });
      })
      .catch((error) => {
        if (requestId !== requestIdRef.current) return;
        setResult({ key: queryKey, data: [], total: 0 });
        messageApi.error(getApiErrorMessage(error, "Failed to load login activities."));
      });
  }, [queryKey, messageApi]);

  const handleReset = () => {
    setSearch("");
    setDebouncedSearch("");
    setDateRange(null);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleView = (record) => {
    setSelected(record);
    setOpen(true);
  };

  return (
    <>
      {contextHolder}
      <LoginActivitiesTable
        data={result.data}
        loading={loading}
        search={search}
        onSearch={setSearch}
        onReset={handleReset}
        onView={handleView}
        dateRange={dateRange}
        onDateRangeChange={(value) => {
          setDateRange(value);
          setPagination((prev) => ({ ...prev, current: 1 }));
        }}
        pagination={pagination}
        total={result.total}
        onPaginationChange={(pag) => setPagination({ current: pag.current, pageSize: pag.pageSize })}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={700}
        destroyOnClose
        title={<span className="text-[#9a2119] font-semibold">Login Details</span>}
      >
        {selected && (
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <p className="text-gray-500">User</p>
              <p className="font-medium">
                {selected.userName || selected.userEmail || "-"}
                {selected.userId ? ` (ID ${selected.userId})` : ""}
              </p>
              {selected.userEmail && <p className="text-xs text-gray-500">{selected.userEmail}{selected.userMobile ? ` | ${selected.userMobile}` : ""}</p>}
            </div>

            <div>
              <p className="text-gray-500">Login Time</p>
              <p className="font-medium">{formatDateTime(selected.loginAt)}</p>
            </div>

            <div>
              <p className="text-gray-500">IP Address</p>
              <p className="font-medium">{selected.ipAddress || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">{selected.location || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500">Device</p>
              <p className="font-medium">{selected.device || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500">Browser</p>
              <p className="font-medium">{selected.browser || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500">OS</p>
              <p className="font-medium">{selected.os || "-"}</p>
            </div>

            <div>
              <p className="text-gray-500">Created At</p>
              <p className="font-medium">{formatDateTime(selected.createdAt)}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
