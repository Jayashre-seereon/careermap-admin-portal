import React, { useEffect } from "react";
import { Form, Input, Button, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import RichTextEditor from "../../components/ui/RichTextEditor";

const { Option } = Select;

function MentorForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      
      {/* GRID 3 COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Category */}
        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <Select disabled={disabled} placeholder="Select Category">
            <Option value="Medical">Medical</Option>
            <Option value="Engineering">Engineering</Option>
            <Option value="Commercial Pilot">Commercial Pilot</Option>
            <Option value="Merchant Navy">Merchant Navy</Option>
          </Select>
        </Form.Item>

        {/* Subcategory */}
        <Form.Item name="subcategory" label="Subcategory">
          <Select disabled={disabled} placeholder="Select Subcategory">
            <Option value="Frontend">Select Subcategory</Option>
          </Select>
        </Form.Item>

        {/* Name */}
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input disabled={disabled} />
        </Form.Item>

        {/* Email */}
        <Form.Item name="email" label="Email">
          <Input disabled={disabled} />
        </Form.Item>

        {/* Phone */}
        <Form.Item name="phone" label="Phone Number">
          <Input disabled={disabled} />
        </Form.Item>

        {/* Designation */}
        <Form.Item name="designation" label="Designation">
          <Input disabled={disabled} />
        </Form.Item>

        {/* Place of Work */}
        <Form.Item name="workplace" label="Place of Work">
          <Input disabled={disabled} />
        </Form.Item>

        {/* LinkedIn */}
        <Form.Item name="linkedin" label="LinkedIn">
          <Input disabled={disabled} />
        </Form.Item>

        {/* Facebook */}
        <Form.Item name="facebook" label="Facebook">
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item name="skills" label="My Skills" className="lg:col-span-2">
          <RichTextEditor
            disabled={disabled}
            placeholder="Enter mentor skills"
            height={160}
          />
        </Form.Item>

        {/* Experience */}
        <Form.Item name="experience" label="Experience (Years)">
          <Input disabled={disabled} />
        </Form.Item>

        {/* Fees */}
        <Form.Item name="fees" label="Mentor Fees">
          <Input disabled={disabled} />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item name="image" label="Image">
          <Upload beforeUpload={() => false} disabled={disabled}>
            <Button icon={<UploadOutlined />} className="w-full">
              Upload Image
            </Button>
          </Upload>
        </Form.Item>

        {/* Resume Upload */}
        <Form.Item name="resume" label="Resume">
          <Upload beforeUpload={() => false} disabled={disabled}>
            <Button icon={<UploadOutlined />} className="w-full">
              Upload Resume
            </Button>
          </Upload>
        </Form.Item>

        {/* Description FULL WIDTH */}
        <Form.Item
          name="description"
          label="Description"
          className="lg:col-span-3"
        >
          <RichTextEditor
            disabled={disabled}
            placeholder="Enter mentor description"
            height={180}
          />
        </Form.Item>

      </div>

      {/* SUBMIT BUTTON (HIDE IN VIEW MODE) */}
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

export default MentorForm;
