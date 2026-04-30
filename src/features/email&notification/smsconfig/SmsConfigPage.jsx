import { useState } from "react";
import { Button, Form, Input, Select, Modal, message } from "antd";
import { getSmsConfig, saveSmsConfig } from "../notificationConfigStore";

const { Option } = Select;

export default function SmsConfigPage() {
  const [form] = Form.useForm();
  const initialValues = getSmsConfig();
  const [method, setMethod] = useState(initialValues.method);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testNumber, setTestNumber] = useState("");

  const handleSubmit = (values) => {
    saveSmsConfig({ ...values, method });
    message.success("SMS configuration saved successfully.");
  };

  const handleCancel = () => {
    const savedValues = getSmsConfig();
    setMethod(savedValues.method);
    form.setFieldsValue(savedValues);
    message.info("Changes cancelled.");
  };

  const handleMethodChange = (value) => {
    setMethod(value);
    form.setFieldsValue({ method: value });
  };

  const handleSendTestSms = () => {
    const cleanNumber = testNumber.trim();

    if (!/^\+?[0-9]{7,15}$/.test(cleanNumber)) {
      message.error("Enter a valid mobile number.");
      return;
    }

    message.success(`Test SMS sent to ${cleanNumber}.`);
    setTestNumber("");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        SMS Configuration
      </h1>

      {/* CARD */}
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border p-6 space-y-6"
      >

        {/* SMS METHOD */}
        <div>
          <label className="block mb-2 font-medium">
            SMS Send Method
          </label>

          <Form.Item name="method" className="mb-0">
            <Select value={method} onChange={handleMethodChange} className="w-64">
              <Option value="Nexmo">Nexmo</Option>
              <Option value="Twilio">Twilio</Option>
              <Option value="Custom">Custom API</Option>
            </Select>
          </Form.Item>
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
                  <Form.Item name="nexmoApiKey" className="mb-0" rules={[{ required: true, message: "API key is required" }]}>
                    <Input placeholder="Enter API Key" />
                  </Form.Item>
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    API Secret
                  </label>
                  <Form.Item name="nexmoApiSecret" className="mb-0" rules={[{ required: true, message: "API secret is required" }]}>
                    <Input.Password placeholder="Enter API Secret" />
                  </Form.Item>
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    From
                  </label>
                  <Form.Item name="nexmoFrom" className="mb-0" rules={[{ required: true, message: "Sender is required" }]}>
                    <Input placeholder="Sender Name" />
                  </Form.Item>
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
                  <Form.Item name="twilioAccountSid" className="mb-0" rules={[{ required: true, message: "Account SID is required" }]}>
                    <Input placeholder="Enter SID" />
                  </Form.Item>
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    Auth Token
                  </label>
                  <Form.Item name="twilioAuthToken" className="mb-0" rules={[{ required: true, message: "Auth token is required" }]}>
                    <Input.Password placeholder="Enter Token" />
                  </Form.Item>
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    From Number
                  </label>
                  <Form.Item name="twilioFromNumber" className="mb-0" rules={[{ required: true, message: "From number is required" }]}>
                    <Input placeholder="+1234567890" />
                  </Form.Item>
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
                  <Form.Item name="customApiUrl" className="mb-0" rules={[{ required: true, message: "API URL is required" }]}>
                    <Input placeholder="https://api.example.com/send" />
                  </Form.Item>
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    API Key
                  </label>
                  <Form.Item name="customApiKey" className="mb-0" rules={[{ required: true, message: "API key is required" }]}>
                    <Input placeholder="Enter API Key" />
                  </Form.Item>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">
                    Payload Format
                  </label>
                  <Form.Item name="customPayload" className="mb-0" rules={[{ required: true, message: "Payload format is required" }]}>
                    <Input.TextArea
                      rows={4}
                      placeholder='{"to":"{number}","message":"{message}"}'
                    />
                  </Form.Item>
                </div>
              </>
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between items-center pt-4">

          {/* TEST SMS */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 rounded-md border border-[#9a2119]
                       text-[#9a2119]
                       hover:bg-[#9a2119] hover:text-white transition"
          >
            Send Test SMS
          </button>

          {/* SAVE */}
          <div className="flex gap-3">
            <Button htmlType="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: "#9a2119", borderColor: "#9a2119" }}
            >
              Submit
            </Button>
          </div>
        </div>
      </Form>

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
            type="button"
            onClick={handleSendTestSms}
            className="w-full py-2 rounded-md
                       bg-[#9a2119]
                       text-white
                       hover:bg-[#c0392b]"
          >
            Send SMS
          </button>
          <Button block onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
