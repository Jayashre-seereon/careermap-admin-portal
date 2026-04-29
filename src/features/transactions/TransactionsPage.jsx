import { useState } from "react";
import { Modal } from "antd";
import TransactionsTable from "./TransactionsTable";

export default function TransactionsPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleView = (record) => {
    setSelected(record);
    setOpen(true);
  };

  return (
    <>
      <TransactionsTable onView={handleView} />

      {/* VIEW MODAL */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
      >
        <h2 className="text-lg font-semibold text-[#9a2119] mb-4">
          Transaction Details
        </h2>

        {selected && (
          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <p className="text-gray-500">Transaction ID</p>
              <p className="font-medium">{selected.txnId}</p>
            </div>

            <div>
              <p className="text-gray-500">User</p>
              <p className="font-medium">{selected.user}</p>
            </div>

            <div>
              <p className="text-gray-500">Module</p>
              <p className="font-medium">{selected.module}</p>
            </div>

            <div>
              <p className="text-gray-500">Amount</p>
              <p className="font-medium">{selected.amount}</p>
            </div>

            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium">{selected.method}</p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium">{selected.status}</p>
            </div>

            <div className="col-span-2">
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{selected.date}</p>
            </div>

          </div>
        )}
      </Modal>
    </>
  );
}