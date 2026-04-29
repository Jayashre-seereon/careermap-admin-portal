import { useState } from "react";
import { Modal } from "antd";
import AllTemplatesTable from "./AllTemplatesTable";
import AllTemplatesEditor from "./AllTemplatesEditor";

const initialData = [
  {
    key: "1",
    name: "Balance - Added",
    subject: "Your Account has been Credited",
    emailStatus: true,
    emailMessage: `{{amount}} {{site_currency}} has been added to your account.
Transaction Number : {{trx}}
Your Current Balance is : {{post_balance}} {{site_currency}}

Admin note: {{remark}}`,
    smsStatus: false,
    smsMessage: `{{amount}} {{site_currency}} credited in your account.
Balance: {{post_balance}}
Transaction: {{trx}}
Admin note: {{remark}}`,
  },
  {
    key: "2",
    name: "Balance - Subtracted",
    subject: "Your Account has been Debited",
    emailStatus: true,
    emailMessage: `{{amount}} {{site_currency}} has been subtracted from your account.
Transaction Number : {{trx}}
Your Current Balance is : {{post_balance}} {{site_currency}}

Admin note: {{remark}}`,
    smsStatus: false,
    smsMessage: `{{amount}} {{site_currency}} debited from your account.
Balance: {{post_balance}}
Transaction: {{trx}}
Admin note: {{remark}}`,
  },
  {
    key: "3",
    name: "Default Template",
    subject: "{{subject}}",
    emailStatus: true,
    emailMessage: "{{message}}",
    smsStatus: false,
    smsMessage: "{{message}}",
  },
  {
    key: "4",
    name: "Deposit - Automated - Successful",
    subject: "Deposit Completed Successfully",
    emailStatus: true,
    emailMessage: "Your automated deposit has been completed successfully.",
    smsStatus: false,
    smsMessage: "Deposit completed successfully.",
  },
  {
    key: "5",
    name: "Deposit - Manual - Approved",
    subject: "Your Deposit is Approved",
    emailStatus: true,
    emailMessage: "Your manual deposit request has been approved.",
    smsStatus: false,
    smsMessage: "Your deposit request is approved.",
  },
  {
    key: "6",
    name: "Deposit - Manual - Rejected",
    subject: "Your Deposit Request is Rejected",
    emailStatus: true,
    emailMessage: "Your manual deposit request has been rejected.",
    smsStatus: false,
    smsMessage: "Your deposit request is rejected.",
  },
];

export default function AllTemplatesPage() {
  const [data, setData] = useState(initialData);
  const [selected, setSelected] = useState(null);

  const handleSave = (values) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === selected.key ? { ...item, ...values } : item
      )
    );
    setSelected(null);
  };

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        All Templates Management
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">

        {/* TABLE TITLE */}
        <h2 className="text-lg font-semibold text-[#9a2119] mb-4">
          Templates List
        </h2>

        <AllTemplatesTable data={data} onEdit={setSelected} />
      </div>

      <Modal
        open={Boolean(selected)}
        onCancel={() => setSelected(null)}
        footer={null}
        width={1000}
        title={selected ? `Edit Template - ${selected.name}` : "Edit Template"}
      >
        <AllTemplatesEditor
          initialValues={selected}
          onSubmit={handleSave}
        />
      </Modal>
    </div>
  );
}
