import React, { useEffect } from "react";
import { Form, Select, Input, Button } from "antd";

const { Option } = Select;

function JobScopeForm({ onSubmit, initialValues, viewMode }) {
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
      className="grid grid-cols-2 gap-4"
    >
      {/* Stream */}
      <Form.Item name="stream" label="Stream" rules={[{ required: true }]}>
        <Select disabled={viewMode}>
          <Option value="Science">Science</Option>
        </Select>
      </Form.Item>

      {/* Category */}
      <Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select disabled={viewMode}>
          <Option value="Medical">Medical</Option>
        </Select>
      </Form.Item>

      {/* 2nd Category */}
      <Form.Item name="secondCategory" label="2nd Category">
        <Select disabled={viewMode}>
          <Option value="ALLIED & PARA MEDICAL COURSES/DEGREES">
            ALLIED & PARA MEDICAL COURSES/DEGREES
          </Option>
        </Select>
      </Form.Item>

      {/* Subcategory */}
      <Form.Item name="subcategory" label="Sub Categories">
        <Select disabled={viewMode}>
          <Option value="N/A">N/A</Option>
          <Option value="RADIOLOGY">RADIOLOGY</Option>
        </Select>
      </Form.Item>

      {/* Name */}
      <Form.Item
        name="name"
        label="Name"
        className="col-span-2"
        rules={[{ required: true }]}
      >
        <Input disabled={viewMode} />
      </Form.Item>

      {/* Submit */}
      {!viewMode && (
        <div className="col-span-2 text-right">
          <Button
            htmlType="submit"
            block
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            Create
          </Button>
        </div>
      )}
    </Form>
  );
}

export default JobScopeForm;