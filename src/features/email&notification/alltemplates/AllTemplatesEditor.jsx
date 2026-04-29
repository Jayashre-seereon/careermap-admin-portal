import { Button, Form, Input, Switch } from "antd";
import { useEffect } from "react";
import RichTextEditor from "../../../components/editor/RichTextEditor";

export default function AllTemplatesEditor({ initialValues, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* EMAIL TEMPLATE */}
        <div className="bg-white rounded-xl border p-5">
          <h3 className="text-[#9a2119] font-semibold mb-4">
            Email Template
          </h3>

          <Form.Item
            name="emailStatus"
            label="Status"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item name="subject" label="Subject">
            <Input placeholder="Your Account has been Credited" />
          </Form.Item>

          <Form.Item name="emailMessage" label="Message">
            <RichTextEditor height={240} />
          </Form.Item>
        </div>

        {/* SMS TEMPLATE */}
        <div className="bg-white rounded-xl border p-5">
          <h3 className="text-[#9a2119] font-semibold mb-4">
            SMS Template
          </h3>

          <Form.Item
            name="smsStatus"
            label="Status"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item name="smsMessage" label="Message">
            <Input.TextArea rows={10} />
          </Form.Item>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          htmlType="submit"
          className="bg-[#9a2119] text-white"
        >
          Save
        </Button>
      </div>
    </Form>
  );
}
