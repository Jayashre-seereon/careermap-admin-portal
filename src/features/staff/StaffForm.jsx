import React, { useEffect } from "react";
import { Form, Input, Select, Button, message } from "antd";
import { validationRules } from "../../utils/formValidation";

function StaffForm({ roles = [], onSubmit, initialValues, disabled, mode }) {
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
      const payload = { ...values };
      // Don't overwrite the existing password with a blank one on edit
      if (mode === "edit" && !payload.password) {
        delete payload.password;
      }
      await onSubmit(payload);
      form.resetFields();
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";

      // Show as a toast
      message.error(errMsg);

      // If the error is about email, also show it inline under the field
      if (errMsg.toLowerCase().includes("email")) {
        form.setFields([
          {
            name: "email",
            errors: [errMsg],
          },
        ]);
      }
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
          Staff Details
        </h3>

        <Form.Item name="name" label="Name" rules={[validationRules.required("Name")]}>
          <Input placeholder="Enter name" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[validationRules.required("Email"), validationRules.email("Email")]}
        >
          <Input placeholder="Enter email" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="password"
          label={mode === "edit" ? "Password (leave blank to keep current)" : "Password"}
          rules={mode === "edit" ? [] : [validationRules.required("Password")]}
        >
          <Input.Password placeholder="Enter password" disabled={disabled} />
        </Form.Item>

        <Form.Item name="roleId" label="Role" rules={[validationRules.required("Role")]}>
          <Select
            placeholder="Select role"
            disabled={disabled}
            options={roles.map((role) => ({ label: role.name, value: role.id }))}
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

export default StaffForm;