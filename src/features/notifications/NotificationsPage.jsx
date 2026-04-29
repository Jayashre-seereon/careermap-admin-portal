import { useState } from "react";
import { Modal } from "antd";
import NotificationsTable from "./NotificationsTable";
import NotificationsForm from "./NotificationsForm";

export default function NotificationsPage() {
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    setOpen(true);
  };

  return (
    <>
      <NotificationsTable onAdd={handleAdd} />

      {/* ADD MODAL */}
      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <NotificationsForm onSubmit={() => setOpen(false)} />
      </Modal>
    </>
  );
}
