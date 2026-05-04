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
].map((item) => ({ label: item, value: item }));

const normalizeInstitutions = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

export default function Category2Form({ onSubmit, initialValues, mode }) {
  const [form] = Form.useForm();
  const isView = mode === "view";

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        institutions: normalizeInstitutions(initialValues.institutions),
      });
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  const handleFinish = (values) => {
    onSubmit({
      ...values,
      institutions: Array.isArray(values.institutions)
        ? values.institutions.join(", ")
        : values.institutions,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} validateTrigger={["onChange", "onBlur"]}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <h3 className="md:col-span-2 lg:col-span-3 mb-1 text-lg font-semibold text-[#9a2119]">
          2nd Category Details
        </h3>

        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <Select disabled={isView}>
            <Option value="Medical">Medical</Option>
            <Option value="Architecture & Planning">Architecture</Option>
            <Option value="Business Management">Business</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="2nd Category"
          rules={[validationRules.required("2nd Category"), validationRules.charactersOnly("2nd Category")]}
        >
          <Input disabled={isView} />
        </Form.Item>

        <Form.Item
          name="institutions"
          label="Select Institute"
          rules={[validationRules.required("Institute")]}
        >
          <Select
            mode="multiple"
            showSearch
            allowClear
            disabled={isView}
            placeholder="Search and select institute"
            optionFilterProp="label"
            options={institutionOptions}
          />
        </Form.Item>

        <Form.Item name="howToBecome" label="How to Become Title">
          <Input disabled={isView} placeholder="Enter how to become title" />
        </Form.Item>

        <Form.Item name="coverImage" label="Cover Image">
          <Upload beforeUpload={() => false} disabled={isView}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="image" label="Image">
          <Upload beforeUpload={() => false} disabled={isView}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="description" label="Description" className="md:col-span-2 lg:col-span-3">
          <Input.TextArea rows={4} disabled={isView} />
        </Form.Item>

        <Form.Item name="specialisation" label="Specialisation" className="md:col-span-2 lg:col-span-3">
          <RichTextEditor
            disabled={isView}
            placeholder="Enter specialisation"
            height={160}
          />
        </Form.Item>

        <Form.Item name="importantFacts" label="Important Facts" className="md:col-span-2 lg:col-span-3">
          <RichTextEditor
            disabled={isView}
            placeholder="Enter important facts"
            height={160}
          />
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
