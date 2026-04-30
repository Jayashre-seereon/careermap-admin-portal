import { useEffect } from "react";
import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { validationRules } from "../../utils/formValidation";

export default function CareerPlanForm({ onSubmit, initialValues, viewMode }) {
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
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
        Career Plan Details
      </h3>

      <Form.Item
        name="title"
        label="Title"
        rules={[validationRules.required("Title")]}
      >
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="image" label="Image">
        <Upload beforeUpload={() => false} disabled={viewMode}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        className="md:col-span-2"
      >
        <Input.TextArea rows={4} disabled={viewMode} />
      </Form.Item>

      <Form.Item name="url" label="Link" className="md:col-span-2" rules={[validationRules.url("Link")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      {!viewMode && (
        <Button
          htmlType="submit"
          className="md:col-span-2 bg-[#9a2119] text-white"
        >
          Submit
        </Button>
      )}
    </Form>
  );
}
