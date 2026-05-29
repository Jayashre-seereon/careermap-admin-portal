import { useEffect, useState } from "react";
import { message, Modal } from "antd";
import LoginActivitiesTable from "./LoginActivitiesTable";
import { getUserHistory } from "../../api/userhistory";

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

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
};

const mapHistory = (item = {}) => ({
  id: item.id,
  userId: item.userId ?? "",
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
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await getUserHistory();
      setHistory(normalizeList(response).map(mapHistory));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load login activities."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleView = (record) => {
    setSelected(record);
    setOpen(true);
  };

  const filteredHistory = history.filter((item) =>
    `${item.userId} ${item.ipAddress} ${item.location} ${item.device} ${item.browser} ${item.os}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      {contextHolder}
      <LoginActivitiesTable
        data={filteredHistory}
        loading={loading}
        search={search}
        onSearch={setSearch}
        onReset={() => setSearch("")}
        onView={handleView}
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
              <p className="text-gray-500">User ID</p>
              <p className="font-medium">{selected.userId || "-"}</p>
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
