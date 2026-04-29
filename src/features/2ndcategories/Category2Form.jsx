import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function Category2Form({ onSubmit, initialValues, mode }) {
  const [form] = Form.useForm();
  const isView = mode === "view";

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <div className="grid grid-cols-3 gap-4">

        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <Select disabled={isView}>
            <Option value="Medical">Medical</Option>
            <Option value="Architecture & Planning">Architecture</Option>
            <Option value="Business Management">Business</Option>
          </Select>
        </Form.Item>

        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input disabled={isView} />
        </Form.Item>

        <Form.Item name="image" label="Image">
          <Upload beforeUpload={() => false} disabled={isView}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="description" label="Description" className="col-span-3">
          <Input.TextArea rows={4} disabled={isView} />
        </Form.Item>

      </div>

      {!isView && (
        <Button
          htmlType="submit"
          block
          style={{ background: "#9a2119", borderColor: "#9a2119", color: "#fff" }}
        >
          Create
        </Button>
      )}
    </Form>
  );
}