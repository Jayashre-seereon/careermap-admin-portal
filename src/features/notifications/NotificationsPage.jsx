import { useState } from "react";
import { Modal } from "antd";
import NotificationsTable from "./NotificationsTable";
import NotificationsForm from "./NotificationsForm";

export default function NotificationsPage() {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleAdd = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleView = (record) => {
    setSelected(record);
    setViewOpen(true);
  };

  return (
    <>
      <NotificationsTable
        onAdd={handleAdd}
        onView={handleView}
      />

      {/* ADD MODAL */}
      <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
        <NotificationsForm onSubmit={() => setOpen(false)} />
      </Modal>

      {/* VIEW MODAL */}
      <Modal open={viewOpen} onCancel={() => setViewOpen(false)} footer={null}>
        {selected && (
          <div>
            <h2 className="text-lg font-semibold text-[#9a2119] mb-3">
              {selected.title}
            </h2>
            <p>{selected.message}</p>
          </div>
        )}
      </Modal>
    </>
  );
}