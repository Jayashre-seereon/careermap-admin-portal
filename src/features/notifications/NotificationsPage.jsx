import { message } from "antd";
import NotificationsTable from "./NotificationsTable";

export default function NotificationsPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const handleMarkAsRead = () => {
    messageApi.success("All notifications marked as read successfully.");
  };

  return (
    <>
      {contextHolder}
      <NotificationsTable onMarkAsRead={handleMarkAsRead} />
    </>
  );
}
