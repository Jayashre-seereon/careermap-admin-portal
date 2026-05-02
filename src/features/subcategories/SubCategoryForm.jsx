import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;
const institutionOptions = [
  "AIIMS DELHI",
  "AIIMS BHOPAL",
  "AIIMS BHUBANESWAR",
  "SCB Medical College",
  "CMC, Vellore",
  "KMC, Manipal",
  "Amrita Vishwam Vidyapeetham",
  "JIPMER, Puducherry",
  "Saveetha Institute of Medical and Technical Sciences",
  "Manipal College of Dental Sciences",
].map((item) => ({ label: item, value: item }));

const normalizeInstitutions = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

function SubCategoryForm({ onSubmit, initialValues, viewMode }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        institutions: normalizeInstitutions(initialValues.institutions),
      });
    }
    else form.resetFields();
  }, [form, initialValues]);

  const handleFinish = (values) => {
    onSubmit({
      ...values,
      institutions: Array.isArray(values.institutions)
        ? values.institutions.join(", ")
        : values.institutions,
    });
    form.resetFields();
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
        Subcategory Details
      </h3>

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
              >
        <Input size="large" disabled={viewMode} placeholder="Title" />
      </Form.Item>

      {/* How to Become */}
      <Form.Item
        name="howToBecome"
        label="How to Become Title"
       
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
        className="md:col-span-2"
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
        className="md:col-span-2"
      >
        <RichTextEditor
          disabled={viewMode}
          placeholder="Specialisation"
          height={180}
        />
      </Form.Item>

      {/* Important Facts */}
      <Form.Item
        name="importantFacts"
        label="Important Facts"
        className="md:col-span-2"
      >
        <RichTextEditor
          disabled={viewMode}
          placeholder="Important Facts"
          height={180}
        />
      </Form.Item>

      {/* Institutions */}
      <Form.Item
        name="institutions"
        label="Select Institutions"
        rules={[validationRules.required("Institutions")]}
        className="md:col-span-2"
      >
        <Select
          mode="multiple"
          showSearch
          allowClear
          size="large"
          disabled={viewMode}
          placeholder="Search and select institutions"
          optionFilterProp="label"
          options={institutionOptions}
        />
      </Form.Item>

      {/* Submit */}
      {!viewMode && (
        <div className="md:col-span-2 flex justify-end">
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
