import { Button, Form, Input, message } from "antd";
import RichTextEditor from "../../../components/editor/RichTextEditor";
import {
  getGlobalTemplateConfig,
  saveGlobalTemplateConfig,
} from "../notificationConfigStore";

export default function GlobalTemplatePage() {
  const [form] = Form.useForm();
  const initialValues = getGlobalTemplateConfig();

  const handleSubmit = (values) => {
    saveGlobalTemplateConfig(values);
    message.success("Global template saved successfully.");
  };

  const handleCancel = () => {
    form.setFieldsValue(getGlobalTemplateConfig());
    message.info("Changes cancelled.");
  };

  return (
    <div className="w-full">

      {/* MAIN HEADING */}
      <h1 className="text-xl font-semibold text-[#9a2119] mb-6">
        Global Template Management
      </h1>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border p-5 space-y-6"
      >

        {/* ================= SHORTCODES ================= */}
        <div>
          <h2 className="text-lg font-semibold text-[#9a2119] mb-3">
            Short Codes
          </h2>

          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-[#9a2119] text-white">
                <tr>
                  <th className="text-left px-4 py-3">Short Code</th>
                  <th className="text-left px-4 py-3">Description</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3 font-mono">
                    {"{{site_name}}"}
                  </td>
                  <td className="px-4 py-3">Name of your site</td>
                </tr>

                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-3 font-mono">
                    {"{{site_currency}}"}
                  </td>
                  <td className="px-4 py-3">Currency of your site</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 font-mono">
                    {"{{currency_symbol}}"}
                  </td>
                  <td className="px-4 py-3">Symbol of currency</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= EMAIL + SMS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* EMAIL SECTION */}
          <div className="bg-gray-50 rounded-xl border p-5">
            <h3 className="text-[#9a2119] font-semibold mb-4">
              Email Template
            </h3>

            {/* FROM */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Email Sent From
              </label>
              <Form.Item
                name="emailFrom"
                className="mb-0"
                rules={[{ required: true, message: "Email sender is required" }]}
              >
                <Input placeholder="info@example.com" />
              </Form.Item>
            </div>

            {/* BODY */}
            <div>
              <label className="block mb-1 font-medium">
                Email Body
              </label>
              <Form.Item
                name="emailBody"
                className="mb-0"
                rules={[{ required: true, message: "Email body is required" }]}
              >
                <RichTextEditor height={240} />
              </Form.Item>
            </div>
          </div>

          {/* SMS SECTION */}
          <div className="bg-gray-50 rounded-xl border p-5">
            <h3 className="text-[#9a2119] font-semibold mb-4">
              SMS Template
            </h3>

            {/* FROM */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                SMS Sent From
              </label>
              <Form.Item
                name="smsFrom"
                className="mb-0"
                rules={[{ required: true, message: "SMS sender is required" }]}
              >
                <Input placeholder="FinBiz" />
              </Form.Item>
            </div>

            {/* BODY */}
            <div>
              <label className="block mb-1 font-medium">
                SMS Body
              </label>
              <Form.Item
                name="smsBody"
                className="mb-0"
                rules={[{ required: true, message: "SMS body is required" }]}
              >
                <Input.TextArea rows={7} className="w-full" />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end gap-3">
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
      </Form>
    </div>
  );
}
