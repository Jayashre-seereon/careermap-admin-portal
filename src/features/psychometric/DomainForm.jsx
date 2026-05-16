import React, { useEffect } from "react";
import { Button, Form, Input, InputNumber, Select } from "antd";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

const scoringTypeOptions = [
  { label: "Likert", value: "Likert" },
  { label: "Likert 2", value: "Likert 2" },
  { label: "Objective", value: "Objective" },
  { label: "MCQ", value: "MCQ" },
];

function DomainForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <h3 className="mb-1 text-lg font-semibold text-[#9a2119] md:col-span-2">
          Domain Details
        </h3>

        <Form.Item
          name="name"
          label="Name"
          rules={[
            validationRules.required("Name"),
            validationRules.charactersOnly("Name"),
          ]}
        >
          <Input placeholder="Enter name" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="displayDomainName"
          label="Display Domain Name"
          rules={[validationRules.required("Display domain name")]}
        >
          <Input placeholder="Enter display domain name" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="scoringType"
          label="Scoring Type"
          rules={[validationRules.required("Scoring type")]}
        >
          <Select
            placeholder="Select Option"
            disabled={disabled}
            options={scoringTypeOptions}
          />
        </Form.Item>

        <Form.Item
          name="domainWeightage"
          label="Domain Weightage"
          rules={[validationRules.required("Domain weightage")]}
        >
          <InputNumber
            className="w-full"
            min={0}
            max={100}
            precision={0}
            placeholder="Enter domain weightage"
            addonAfter="%"
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          className="md:col-span-2"
          rules={[validationRules.required("Description")]}
        >
          <RichTextEditor
            height={180}
            placeholder="Enter description"
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          name="instruction"
          label="Instruction"
          className="md:col-span-2"
          rules={[validationRules.required("Instruction")]}
        >
          <RichTextEditor
            height={180}
            placeholder="Enter instruction"
            disabled={disabled}
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

export default DomainForm;
