import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { validationRules } from "../../utils/formValidation";

export default function PathTypeForm({ onSubmit, initialValues, mode }) {
  const [form] = Form.useForm();
  const isView = mode === "view";

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
      <h3 className="mb-4 text-lg font-semibold text-[#9a2119]">
        Path Type Details
      </h3>

      <Form.Item
        name="pathtype"
        label="Path Type"
        rules={[validationRules.required("Path type")]}
      >
        <Input placeholder="Enter Path Type" disabled={isView} />
      </Form.Item>

      {!isView && (
        <Button
          htmlType="submit"
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
          className="text-white w-full"
        >
          {mode === "edit" ? "Update" : "Save"}
        </Button>
      )}
    </Form>
  );
}
