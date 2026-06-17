import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

function CounselingForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = async (values) => {
    try {
      await onSubmit(values);
      // Only clear the form once the submission actually succeeded.
      form.resetFields();
    } catch (err) {
      // onSubmit already logs the error; keep the user's input so they can retry.
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      validateTrigger={["onChange", "onBlur"]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <h3 className="mb-1 text-lg font-semibold text-[#9a2119] md:col-span-2">
          Counseling Details
        </h3>

        <Form.Item
          name="firstName"
          label="First Name"
          rules={[validationRules.required("First Name")]}
        >
          <Input placeholder="Enter first name" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[validationRules.required("Last Name")]}
        >
          <Input placeholder="Enter last name" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            validationRules.required("Email"),
            validationRules.email("Email"),
          ]}
        >
          <Input placeholder="Enter email" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="inquiryFor"
          label="Inquiry For"
          rules={[validationRules.required("Inquiry For")]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter inquiry for"
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          name="interest"
          label="Interest"
          className="md:col-span-2"
          rules={[validationRules.required("Interest")]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter interest"
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          name="study"
          label="Study"
          className="md:col-span-2"
          rules={[validationRules.required("Study")]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter study"
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

export default CounselingForm;