import React, { useEffect } from "react";
import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function StreamForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [initialValues]);

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>

      <Form.Item
        name="name"
        label="Stream Name"
        rules={[{ required: true }]}
      >
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item name="image" label="Image">
        <Upload beforeUpload={() => false} disabled={disabled}>
          <Button icon={<UploadOutlined />} className="w-full">
            Upload Image
          </Button>
        </Upload>
      </Form.Item>

      {!disabled && (
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
        >
          Submit
        </Button>
      )}
    </Form>
  );
}

export default StreamForm;