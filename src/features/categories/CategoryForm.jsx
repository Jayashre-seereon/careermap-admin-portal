import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button, Radio } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function CategoryForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [initialValues]);

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Form.Item name="stream" label="Stream" rules={[{ required: true }]}>
          <Select placeholder="Select Stream" disabled={disabled}>
            <Option value="Science">Science</Option>
            <Option value="Commerce">Commerce</Option>
          </Select>
        </Form.Item>

        <Form.Item name="institutions" label="Select Institutions">
          <Input placeholder="Search Institutions" disabled={disabled} />
        </Form.Item>

        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item name="howToBecome" label="How to Become Title">
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item name="file" label="File">
          <Upload beforeUpload={() => false} disabled={disabled}>
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="coverImage" label="Cover Image">
          <Upload beforeUpload={() => false} disabled={disabled}>
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} disabled={disabled} />
        </Form.Item>

        <Form.Item name="specialisation" label="Specialisation">
          <Input.TextArea rows={3} disabled={disabled} />
        </Form.Item>

        <Form.Item name="importantFacts" label="Important Facts">
          <Input.TextArea rows={3} disabled={disabled} />
        </Form.Item>

        <Form.Item name="isUpgrade" label="Category Access">
          <Radio.Group disabled={disabled}>
            <Radio value="Free">Free</Radio>
            <Radio value="Premium">Premium</Radio>
          </Radio.Group>
        </Form.Item>

      </div>

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