import { useEffect } from "react";
import { Button, Form, Input } from "antd";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

export default function NotificationsForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      return;
    }

    form.resetFields();
  }, [form, initialValues]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
        Notification Details
      </h3>

      <Form.Item
        name="title"
        label="Title"
        rules={[validationRules.required("Title")]}
      >
        <Input disabled={disabled} placeholder="Enter notification title" />
      </Form.Item>

      <Form.Item
        name="target"
        label="Target"
        rules={[validationRules.required("Target")]}
      >
        <Input disabled={disabled} placeholder="Enter target" />
      </Form.Item>

      <Form.Item
        name="message"
        label="Message"
        className="md:col-span-2"
        rules={[validationRules.required("Message")]}
      >
        <RichTextEditor
          disabled={disabled}
          placeholder="Enter notification message"
          height={180}
        />
      </Form.Item>

      {!disabled && (
        <Button
          htmlType="submit"
          block
          className="md:col-span-2 bg-[#9a2119] text-white"
        >
          {initialValues ? "Update Notification" : "Add Notification"}
        </Button>
      )}
    </Form>
  );
}
