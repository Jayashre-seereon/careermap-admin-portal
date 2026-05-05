import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import RichTextEditor from "../../components/ui/RichTextEditor";
import StatusSwitch from "../../components/ui/StatusSwitch";
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
        isUpgrade: "Free",
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
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      validateTrigger={["onChange", "onBlur"]}
      initialValues={{ isUpgrade: "Free" }}
    >
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
          Category Details
        </h3>

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
          label="Path Ways"
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

        <Form.Item name="description" label="Description" className="md:col-span-2">
          <Input.TextArea rows={3} disabled={disabled} />
        </Form.Item>

        <Form.Item name="specialisation" label="Specialisation" className="md:col-span-2">
          <RichTextEditor
            disabled={disabled}
            placeholder="Enter specialisation"
            height={160}
          />
        </Form.Item>

        <Form.Item name="importantFacts" label="Important Facts" className="md:col-span-2">
          <RichTextEditor
            disabled={disabled}
            placeholder="Enter important facts"
            height={160}
          />
        </Form.Item>

        <Form.Item
          name="isUpgrade"
          label="Category Access"
          valuePropName="checked"
          getValueProps={(value) => ({ checked: value === "Free" })}
          normalize={(checked) => (checked ? "Free" : "Premium")}
          rules={[validationRules.required("Category access")]}
        >
          <StatusSwitch
            disabled={disabled}
            checkedChildren="Free"
            unCheckedChildren="Premium"
          />
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
