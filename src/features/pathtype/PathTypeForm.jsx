import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { validationRules } from "../../utils/formValidation";

function PathTypeForm({ onSubmit, initialValues, viewMode }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [form, initialValues]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish} validateTrigger={["onChange", "onBlur"]}>
      
      {/* Path Type */}
      <Form.Item
        name="title"
        label="Path Type"
        rules={[validationRules.required("Path type"), validationRules.charactersOnly("Path type")]}
      >
        <Input placeholder="Enter Path Type" disabled={viewMode} />
      </Form.Item>

      {/* Submit */}
      {!viewMode && (
        <Button
          htmlType="submit"
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
          className="text-white w-full"
        >
          Save
        </Button>
      )}
    </Form>
  );
}

export default PathTypeForm;
