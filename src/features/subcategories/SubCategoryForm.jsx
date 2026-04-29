import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

function SubCategoryForm({ onSubmit, initialValues, viewMode }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [initialValues]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      className="grid grid-cols-2 gap-5"
    >
      {/* LEFT COLUMN */}

      {/* Category */}
      <Form.Item
        name="category"
        label="Select Category"
        rules={[{ required: true }]}
      >
        <Select disabled={viewMode} size="large">
          <Option value="Medical">Medical</Option>
        </Select>
      </Form.Item>

      {/* 2nd Category */}
      <Form.Item name="secondCategory" label="Select 2nd Category">
        <Select disabled={viewMode} size="large">
          <Option value="GENERAL COURSES/DEGREES">
            GENERAL COURSES/DEGREES
          </Option>
        </Select>
      </Form.Item>

      {/* Title */}
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true }]}
      >
        <Input size="large" disabled={viewMode} placeholder="Title" />
      </Form.Item>

      {/* How to Become */}
      <Form.Item
        name="howToBecome"
        label="How to Become Title"
        rules={[{ required: true }]}
      >
        <Input
          size="large"
          disabled={viewMode}
          placeholder="How to Become Title"
        />
      </Form.Item>

      {/* File */}
      <Form.Item name="file" label="File">
        <Upload beforeUpload={() => false} disabled={viewMode}>
          <Button icon={<UploadOutlined />}>Choose File</Button>
        </Upload>
      </Form.Item>

      {/* Cover Image */}
      <Form.Item name="coverImage" label="Cover Image">
        <Upload beforeUpload={() => false} disabled={viewMode}>
          <Button icon={<UploadOutlined />}>Choose File</Button>
        </Upload>
      </Form.Item>

      {/* Description */}
      <Form.Item
        name="description"
        label="Description"
        className="col-span-2"
      >
        <Input.TextArea
          rows={4}
          disabled={viewMode}
          placeholder="Description"
        />
      </Form.Item>

      {/* Specialisation */}
      <Form.Item
        name="specialisation"
        label="Specialisation"
        className="col-span-2"
      >
        <Input.TextArea
          rows={4}
          disabled={viewMode}
          placeholder="Specialisation"
        />
      </Form.Item>

      {/* Important Facts */}
      <Form.Item
        name="importantFacts"
        label="Important Facts"
        className="col-span-2"
      >
        <Input.TextArea
          rows={4}
          disabled={viewMode}
          placeholder="Important Facts"
        />
      </Form.Item>

      {/* Institutions */}
      <Form.Item
        name="institutions"
        label="Select Institutions"
        rules={[{ required: true }]}
        className="col-span-2"
      >
        <Input
          size="large"
          disabled={viewMode}
          placeholder="Search Institutions"
        />
      </Form.Item>

      {/* Submit */}
      {!viewMode && (
        <div className="col-span-2 flex justify-end">
          <Button
            htmlType="submit"
            block
            size="large"
            style={{
              background: "#9a2119",
              borderColor: "#9a2119",
            }}
            className="text-white px-8"
          >
            Create
          </Button>
        </div>
      )}
    </Form>
  );
}

export default SubCategoryForm;