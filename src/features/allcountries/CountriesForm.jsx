import { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { validationRules } from "../../utils/formValidation";

export default function CountriesForm({ onSubmit, initialValues, viewMode }) {
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
      <Form.Item
        name="name"
        label="Country Name"
        rules={[validationRules.required("Country name")]}
      >
        <Input disabled={viewMode} />
      </Form.Item>

      {!viewMode && (
        <Button
          htmlType="submit"
          block
          className="bg-[#9a2119] text-white"
        >
          Add
        </Button>
      )}
    </Form>
  );
}
