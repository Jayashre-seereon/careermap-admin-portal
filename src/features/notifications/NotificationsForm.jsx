import useSubmitGuard from "../../hooks/useSubmitGuard";
import { useEffect } from "react";
import { Button, Form, Input, Select } from "antd";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

const TARGET_OPTIONS = [
  { label: "All Users", value: "All Users" },
];

const isMessageEmpty = (html) => {
  const text = String(html || "")
    .replace(/<(img|video|iframe)\b/gi, "MEDIA")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|\u00a0/g, " ")
    .trim();
  return !text;
};

export default function NotificationsForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();
  const currentTarget = initialValues?.target;
  const targetOptions =
    currentTarget && !TARGET_OPTIONS.some((o) => o.value.toLowerCase() === String(currentTarget).toLowerCase())
      ? [...TARGET_OPTIONS, { label: currentTarget, value: currentTarget }]
      : TARGET_OPTIONS;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      return;
    }

    form.resetFields();
  }, [form, initialValues]);

  const [guardedSubmit, submitting] = useSubmitGuard(onSubmit);
  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={guardedSubmit}
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
        <Select disabled={disabled} placeholder="Select target audience" options={targetOptions} />
      </Form.Item>

      <Form.Item
        name="message"
        label="Message"
        className="md:col-span-2"
        rules={[
          {
            validator: (_, value) =>
              isMessageEmpty(value)
                ? Promise.reject(new Error("Message is required."))
                : Promise.resolve(),
          },
        ]}
      >
        <RichTextEditor
          disabled={disabled}
          placeholder="Enter notification message"
          height={180}
        />
      </Form.Item>

      {!disabled && (
        <Button
          htmlType="submit" loading={submitting}
          block
          className="md:col-span-2 bg-[#9a2119] text-white"
        >
          {initialValues ? "Update Notification" : "Add Notification"}
        </Button>
      )}
    </Form>
  );
}
