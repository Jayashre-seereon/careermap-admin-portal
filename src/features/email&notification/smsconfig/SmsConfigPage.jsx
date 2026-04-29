import { useState } from "react";
import { Input, Select, Modal } from "antd";

const { Option } = Select;

export default function SmsConfigPage() {
  const [method, setMethod] = useState("Nexmo");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testNumber, setTestNumber] = useState("");

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        SMS Configuration
      </h1>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

        {/* SMS METHOD */}
        <div>
          <label className="block mb-2 font-medium">
            SMS Send Method
          </label>

          <Select
            value={method}
            onChange={setMethod}
            className="w-64"
          >
            <Option value="Nexmo">Nexmo</Option>
            <Option value="Twilio">Twilio</Option>
            <Option value="Custom">Custom API</Option>
          </Select>
        </div>

        {/* ================= DYNAMIC CONFIG ================= */}
        <div>
          <h2 className="text-lg font-semibold text-[#9a2119] mb-4">
            {method} Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* NEXMO */}
            {method === "Nexmo" && (
              <>
                <div>
                  <label className="block mb-1 font-medium">
                    API Key
                  </label>
                  <Input placeholder="Enter API Key" />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    API Secret
                  </label>
                  <Input.Password placeholder="Enter API Secret" />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    From
                  </label>
                  <Input placeholder="Sender Name" />
                </div>
              </>
            )}

            {/* TWILIO */}
            {method === "Twilio" && (
              <>
                <div>
                  <label className="block mb-1 font-medium">
                    Account SID
                  </label>
                  <Input placeholder="Enter SID" />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Auth Token
                  </label>
                  <Input.Password placeholder="Enter Token" />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    From Number
                  </label>
                  <Input placeholder="+1234567890" />
                </div>
              </>
            )}

            {/* CUSTOM API */}
            {method === "Custom" && (
              <>
                <div>
                  <label className="block mb-1 font-medium">
                    API URL
                  </label>
                  <Input placeholder="https://api.example.com/send" />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    API Key
                  </label>
                  <Input placeholder="Enter API Key" />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">
                    Payload Format
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border rounded-md p-3"
                    placeholder='{"to":"{number}","message":"{message}"}'
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between items-center pt-4">

          {/* TEST SMS */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 rounded-md border border-[#9a2119]
                       text-[#9a2119]
                       hover:bg-[#9a2119] hover:text-white transition"
          >
            Send Test SMS
          </button>

          {/* SAVE */}
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
        title="Send Test SMS"
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
              placeholder="Enter mobile number"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              console.log("Sending SMS to:", testNumber);
              setIsModalOpen(false);
            }}
            className="w-full py-2 rounded-md
                       bg-[#9a2119]
                       text-white
                       hover:bg-[#c0392b]"
          >
            Send SMS
          </button>
        </div>
      </Modal>
    </div>
  );
}