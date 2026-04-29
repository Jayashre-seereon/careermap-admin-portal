import { useState } from "react";
import { Input, Select, Modal } from "antd";

const { Option } = Select;

export default function EmailConfigPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Email Configuration
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

        {/* EMAIL METHOD */}
        <div>
          <label className="block mb-2 font-medium">
            Email Send Method
          </label>

          <Select defaultValue="SMTP" className="w-60">
            <Option value="SMTP">SMTP</Option>
            <Option value="MAIL">PHP Mail</Option>
          </Select>
        </div>

        {/* SMTP CONFIG */}
        <div>
          <h2 className="text-lg font-semibold text-[#9a2119] mb-4">
            SMTP Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* HOST */}
            <div>
              <label className="block mb-1 font-medium">Host</label>
              <Input placeholder="smtp.gmail.com" />
            </div>

            {/* PORT */}
            <div>
              <label className="block mb-1 font-medium">Port</label>
              <Input placeholder="587" />
            </div>

            {/* ENCRYPTION */}
            <div>
              <label className="block mb-1 font-medium">
                Encryption
              </label>
              <Select defaultValue="TLS" className="w-full">
                <Option value="TLS">TLS</Option>
                <Option value="SSL">SSL</Option>
                <Option value="NONE">None</Option>
              </Select>
            </div>

            {/* USERNAME */}
            <div>
              <label className="block mb-1 font-medium">
                Username
              </label>
              <Input placeholder="your@email.com" />
            </div>

            {/* PASSWORD */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">
                Password
              </label>
              <Input.Password placeholder="Enter password" />
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between items-center pt-4">

          {/* TEST BUTTON */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 rounded-md border border-[#9a2119]
                       text-[#9a2119]
                       hover:bg-[#9a2119] hover:text-white transition"
          >
            Send Test Email
          </button>

          {/* SAVE BUTTON */}
          <button
            className="px-6 py-2 rounded-md
                       bg-[#9a2119]
                       text-white
                       hover:bg-[#c0392b]
                       transition"
          >
            Save
          </button>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <Modal
        title="Send Test Email"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="space-y-4">

          <div>
            <label className="block mb-1 font-medium">
              Send To
            </label>
            <Input
              placeholder="Enter email address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              console.log("Sending test email to:", testEmail);
              setIsModalOpen(false);
            }}
            className="w-full py-2 rounded-md
                       bg-[#9a2119]
                       text-white
                       hover:bg-[#c0392b]"
          >
            Send Email
          </button>
        </div>
      </Modal>
    </div>
  );
}