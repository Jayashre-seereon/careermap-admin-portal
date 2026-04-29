import { Switch, Input } from "antd";

export default function AllTemplatesEditor() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* EMAIL TEMPLATE */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="text-[#9a2119] font-semibold mb-4">
          Email Template
        </h3>

        <div className="mb-4 flex items-center gap-3">
          <span>Status</span>
          <Switch defaultChecked />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Subject</label>
          <Input placeholder="Your Account has been Credited" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            rows={6}
            className="w-full border rounded-md p-3"
            defaultValue={`{{amount}} {{site_currency}} has been added to your account.
Transaction Number : {{trx}}
Your Current Balance is : {{post_balance}} {{site_currency}}

Admin note: {{remark}}`}
          />
        </div>
      </div>

      {/* SMS TEMPLATE */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="text-[#9a2119] font-semibold mb-4">
          SMS Template
        </h3>

        <div className="mb-4 flex items-center gap-3">
          <span>Status</span>
          <Switch />
        </div>

        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            rows={8}
            className="w-full border rounded-md p-3"
            defaultValue={`{{amount}} {{site_currency}} credited in your account.
Balance: {{post_balance}}
Transaction: {{trx}}
Admin note: {{remark}}`}
          />
        </div>
      </div>
    </div>
  );
}