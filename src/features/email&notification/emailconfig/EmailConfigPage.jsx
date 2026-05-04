import { useState } from "react";
import { Button, Form, Input, Select, Modal, message } from "antd";
import { getEmailConfig, saveEmailConfig } from "../notificationConfigStore";

const { Option } = Select;

export default function EmailConfigPage() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const initialValues = getEmailConfig();

  const handleSubmit = (values) => {
    saveEmailConfig(values);
    message.success("Email configuration saved successfully.");
  };

  const handleCancel = () => {
    form.setFieldsValue(getEmailConfig());
    message.info("Changes cancelled.");
  };

  const handleSendTestEmail = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail.trim())) {
      message.error("Enter a valid email address.");
      return;
    }

    message.success(`Test email sent to ${testEmail.trim()}.`);
    setTestEmail("");
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Email Configuration
      </h1>

      {/* CARD */}
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border p-6 space-y-6"
      >

        {/* EMAIL METHOD */}
        <div>
          <label className="block mb-2 font-medium">
            Email Send Method
          </label>

          <Form.Item name="method" className="mb-0">
            <Select className="w-full sm:w-60">
              <Option value="SMTP">SMTP</Option>
              <Option value="MAIL">PHP Mail</Option>
            </Select>
          </Form.Item>
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
              <Form.Item name="host" className="mb-0" rules={[{ required: true, message: "Host is required" }]}>
                <Input placeholder="smtp.gmail.com" />
              </Form.Item>
            </div>

            {/* PORT */}
            <div>
              <label className="block mb-1 font-medium">Port</label>
              <Form.Item name="port" className="mb-0" rules={[{ required: true, message: "Port is required" }]}>
                <Input placeholder="587" />
              </Form.Item>
            </div>

            {/* ENCRYPTION */}
            <div>
              <label className="block mb-1 font-medium">
                Encryption
              </label>
              <Form.Item name="encryption" className="mb-0">
                <Select className="w-full">
                  <Option value="TLS">TLS</Option>
                  <Option value="SSL">SSL</Option>
                  <Option value="NONE">None</Option>
                </Select>
              </Form.Item>
            </div>

            {/* USERNAME */}
            <div>
              <label className="block mb-1 font-medium">
                Username
              </label>
              <Form.Item name="username" className="mb-0" rules={[{ required: true, message: "Username is required" }]}>
                <Input placeholder="your@email.com" />
              </Form.Item>
            </div>

            {/* PASSWORD */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">
                Password
              </label>
              <Form.Item name="password" className="mb-0" rules={[{ required: true, message: "Password is required" }]}>
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">

          {/* TEST BUTTON */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 rounded-md border border-[#9a2119]
                       text-[#9a2119]
                       hover:bg-[#9a2119] hover:text-white transition"
          >
            Send Test Email
          </button>

          {/* SAVE BUTTON */}
          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
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
            type="button"
            onClick={handleSendTestEmail}
            className="w-full py-2 rounded-md
                       bg-[#9a2119]
                       text-white
                       hover:bg-[#c0392b]"
          >
            Send Email
          </button>
          <Button block onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
