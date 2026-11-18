import { useEffect, useMemo, useState } from "react";
import { Modal, message } from "antd";
import NotificationsForm from "./NotificationsForm";
import NotificationsTable from "./NotificationsTable";
import {
  createNotification,
  deleteNotification,
  getAdminNotification,
  getNotifications,
  updateNotification,
} from "../../api/notification";

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

const getSortScore = (item = {}, index = 0) => {
  const candidates = [
    item.createdAt,
    item.updatedAt,
    item.created_at,
    item.updated_at,
    item.id,
  ];

  for (const value of candidates) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    const dateScore = Date.parse(value);
    if (!Number.isNaN(dateScore)) {
      return dateScore;
    }

    const numericScore = Number(value);
    if (Number.isFinite(numericScore)) {
      return numericScore;
    }
  }

  return -index;
};

const sortNewestFirst = (items = []) =>
  [...items]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => getSortScore(b.item, b.index) - getSortScore(a.item, a.index))
    .map(({ item }) => item);

const mapNotification = (item = {}) => ({
  id: item.id,
  title: item.title || "",
  message: item.message || "",
  target: item.target || (typeof item.id === "string" ? "Admin" : ""),
  status: item.status || "",
  type: item.type || "",
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  isComputed: typeof item.id === "string" && !/^\d+$/.test(item.id),
});

const buildNotificationPayload = (values = {}) => ({
  title: values.title || "",
  message: values.message || "",
  target: values.target || "",
});

export default function NotificationsPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [manualResult, adminResult] = await Promise.allSettled([getNotifications(), getAdminNotification()]);
      if (manualResult.status === "rejected" && adminResult.status === "rejected") throw manualResult.reason;
      const manualItems = manualResult.status === "fulfilled" ? normalizeList(manualResult.value) : [];
      const adminItems = adminResult.status === "fulfilled" ? normalizeList(adminResult.value) : [];
      setData(sortNewestFirst([...adminItems, ...manualItems].map(mapNotification)));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load notifications."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const typeOptions = useMemo(
    () => [...new Set(data.map((item) => String(item.type || "").trim()).filter(Boolean))].sort(),
    [data]
  );
  const statusOptions = useMemo(
    () => [...new Set(data.map((item) => String(item.status || "").trim()).filter(Boolean))].sort(),
    [data]
  );

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    const from = dateRange?.[0] ? dateRange[0].startOf("day").valueOf() : null;
    const to = dateRange?.[1] ? dateRange[1].endOf("day").valueOf() : null;
    return data.filter((item) => {
      if (query && !`${item.title} ${item.target}`.toLowerCase().includes(query)) return false;
      if (typeFilter !== "all" && String(item.type || "").trim() !== typeFilter) return false;
      if (statusFilter !== "all" && String(item.status || "").trim() !== statusFilter) return false;
      if (from !== null || to !== null) {
        const created = item.createdAt ? new Date(item.createdAt).getTime() : NaN;
        if (Number.isNaN(created)) return false;
        if (from !== null && created < from) return false;
        if (to !== null && created > to) return false;
      }
      return true;
    });
  }, [data, search, typeFilter, statusFilter, dateRange]);

  const handleSubmit = async (values) => {
    try {
      const payload = buildNotificationPayload(values);

      if (mode === "edit" && selected) {
        await updateNotification(selected.id, payload);
        messageApi.success("Notification updated successfully.");
      } else {
        await createNotification(payload);
        messageApi.success("Notification created successfully.");
      }

      setOpen(false);
      setSelected(null);
      await loadNotifications();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(
          error,
          mode === "edit"
            ? "Failed to update notification."
            : "Failed to create notification."
        )
      );
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteNotification(record.id);
      messageApi.success("Notification deleted successfully.");
      await loadNotifications();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to delete notification."));
    }
  };

  return (
    <>
      {contextHolder}
      <NotificationsTable
        data={filteredData}
        loading={loading}
        search={search}
        onSearch={setSearch}
        typeFilter={typeFilter}
        onTypeFilter={setTypeFilter}
        typeOptions={typeOptions}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        statusOptions={statusOptions}
        dateRange={dateRange}
        onDateRange={setDateRange}
        onAdd={() => {
          setSelected(null);
          setMode("add");
          setOpen(true);
        }}
        onView={(item) => {
          setSelected(item);
          setMode("view");
          setOpen(true);
        }}
        onEdit={(item) => {
          setSelected(item);
          setMode("edit");
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelected(null);
        }}
        footer={null}
        width={900}
        destroyOnClose
        title={
          mode === "add"
            ? "Add Notification"
            : mode === "edit"
              ? "Edit Notification"
              : "View Notification"
        }
      >
        <NotificationsForm
          onSubmit={handleSubmit}
          initialValues={selected}
          disabled={mode === "view"}
        />
      </Modal>
    </>
  );
}
