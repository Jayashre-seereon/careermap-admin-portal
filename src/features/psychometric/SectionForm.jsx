import React, { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";

import { validationRules } from "../../utils/formValidation";

function SectionForm({
  domainOptions,
  assessmentOptions,
  assessmentId,
  onSubmit,
  initialValues,
  disabled,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        assessmentId: initialValues.assessmentId
          ? String(initialValues.assessmentId)
          : assessmentId
            ? String(assessmentId)
            : undefined,
        code: initialValues.code || "",
        title: initialValues.title || "",
        description: initialValues.description || "",
        order: initialValues.order ?? undefined,
      });
    } else {
      form.resetFields();
      form.setFieldValue("assessmentId", assessmentId ? String(assessmentId) : undefined);
    }
  }, [assessmentId, initialValues, form]);

  const handleFinish = (values) => {
    onSubmit({
      assessmentId: values.assessmentId,
      code: values.code,
      title: values.title,
      description: values.description || "",
      order: Number(values.order),
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      validateTrigger={["onChange", "onBlur"]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <h3 className="mb-1 text-lg font-semibold text-[#9a2119] md:col-span-2">
          Section Details
        </h3>

        <Form.Item
          name="assessmentId"
          label="Assessment"
          rules={[validationRules.required("Assessment")]}
        >
          <Select
            placeholder="Select assessment"
            options={assessmentOptions}
            disabled={disabled}
          />
        </Form.Item>

        {/* Section Type */}
        <Form.Item
          name="code"
          label="Section Type"
          rules={[
            validationRules.required("Section type"),
          ]}
        >
          <Select
            placeholder="Select section type"
            options={domainOptions}
            disabled={disabled}
          />
        </Form.Item>

        {/* Title */}
        <Form.Item
          name="title"
          label="Title"
          rules={[
            validationRules.required("Title"),
          ]}
        >
          <Input
            placeholder="Enter section title"
            disabled={disabled}
          />
        </Form.Item>

        {/* Order */}
        <Form.Item
          name="order"
          label="Order"
          rules={[
            validationRules.required("Order"),
          ]}
        >
          <InputNumber
            className="w-full"
            min={1}
            placeholder="Enter order"
            disabled={disabled}
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label="Description"
          className="md:col-span-2"
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter description"
            disabled={disabled}
          />
        </Form.Item>
      </div>

      {!disabled && (
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{
            background: "#9a2119",
            borderColor: "#9a2119",
          }}
        >
          {initialValues ? "Update Section" : "Create Section"}
        </Button>
      )}
    </Form>
  );
}

export default SectionForm;
