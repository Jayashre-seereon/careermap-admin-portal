import { useEffect, useState } from "react";
import { Modal, message } from "antd";
import NotificationsForm from "./NotificationsForm";
import NotificationsTable from "./NotificationsTable";
import {
  createNotification,
  deleteNotification,
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

const mapNotification = (item = {}) => ({
  id: item.id,
  title: item.title || "",
  message: item.message || "",
  target: item.target || "",
  status: item.status || "",
  type: item.type || "",
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const buildNotificationPayload = (values = {}) => ({
  title: values.title || "",
  message: values.message || "",
  target: values.target || "",
  status: values.status || "",
  type: values.type || "",
});

export default function NotificationsPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      setData(normalizeList(response).map(mapNotification));
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, "Failed to load notifications."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filteredData = data.filter((item) =>
    `${item.title} ${item.message} ${item.target} ${item.status} ${item.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
