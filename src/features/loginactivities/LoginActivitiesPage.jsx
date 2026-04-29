import { useState } from "react";
import { Modal } from "antd";
import LoginActivitiesTable from "./LoginActivitiesTable";

export default function LoginActivitiesPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleView = (record) => {
    setSelected(record);
    setOpen(true);
  };

  return (
    <>
      <LoginActivitiesTable onView={handleView} />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
      >
        <h2 className="text-lg font-semibold text-[#9a2119] mb-4">
          Login Details
        </h2>

        {selected && (
          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <p className="text-gray-500">User</p>
              <p className="font-medium">{selected.user}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{selected.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Login Time</p>
              <p className="font-medium">{selected.time}</p>
            </div>

            <div>
              <p className="text-gray-500">IP Address</p>
              <p className="font-medium">{selected.ip}</p>
            </div>

            <div>
              <p className="text-gray-500">Device</p>
              <p className="font-medium">{selected.device}</p>
            </div>

            <div>
              <p className="text-gray-500">Location</p>
              <p className="font-medium">{selected.location}</p>
            </div>

            <div className="col-span-2">
              <p className="text-gray-500">Status</p>
              <p className="font-medium">{selected.status}</p>
            </div>

          </div>
        )}
      </Modal>
    </>
  );
}