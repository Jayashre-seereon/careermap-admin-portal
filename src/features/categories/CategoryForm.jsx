import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button, Radio } from "antd";
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

export default function CategoryForm({ onSubmit, initialValues, disabled }) {
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
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish} validateTrigger={["onChange", "onBlur"]}>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Form.Item name="stream" label="Stream" rules={[{ required: true }]}>
          <Select placeholder="Select Stream" disabled={disabled}>
            <Option value="Science">Science</Option>
            <Option value="Commerce">Commerce</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="institutions"
          label="Select Institutions"
          rules={[validationRules.required("Institutions")]}
        >
          <Select
            mode="multiple"
            showSearch
            allowClear
            disabled={disabled}
            placeholder="Search and select institutions"
            optionFilterProp="label"
            options={institutionOptions}
          />
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
             >
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="howToBecome"
          label="How to Become Title"
               >
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
          <RichTextEditor
            disabled={disabled}
            placeholder="Enter specialisation"
            height={160}
          />
        </Form.Item>

        <Form.Item name="importantFacts" label="Important Facts">
          <RichTextEditor
            disabled={disabled}
            placeholder="Enter important facts"
            height={160}
          />
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
