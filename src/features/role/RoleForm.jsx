import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { validationRules } from "../../utils/formValidation";

function RoleForm({ onSubmit, initialValues, disabled }) {
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
      form.resetFields();
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
      message.error(errMsg);
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
          Role Details
        </h3>

        <Form.Item name="name" label="Name" rules={[validationRules.required("Name")]}>
          <Input placeholder="Enter role name" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[validationRules.required("Description")]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter role description"
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

export default RoleForm;
