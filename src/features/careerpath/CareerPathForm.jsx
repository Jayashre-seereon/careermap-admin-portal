import React, { useEffect } from "react";
import { Form, Select, Input, Button } from "antd";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

function CareerPathForm({ onSubmit, initialValues, viewMode }) {
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
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-2 gap-4"
    >
      <Form.Item name="module" label="Select Module">
        <Select disabled={viewMode}>
          <Option value="Career Library">Career Library</Option>
        </Select>
      </Form.Item>

      <Form.Item name="category" label="Category">
        <Select disabled={viewMode}>
          <Option value="Medical">Medical</Option>
        </Select>
      </Form.Item>

      <Form.Item name="pathType" label="Select Path">
        <Select disabled={viewMode}>
          <Option value="Path 1">Path 1</Option>
        </Select>
      </Form.Item>

      <Form.Item name="stream" label="Stream" rules={[validationRules.charactersOnly("Stream")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="graduation" label="Graduation" rules={[validationRules.charactersOnly("Graduation")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="afterGraduation" label="After Graduation" rules={[validationRules.charactersOnly("After graduation")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="afterPostGraduation" label="After Post Graduation" rules={[validationRules.charactersOnly("After post graduation")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="anyOther" label="Any Other" rules={[validationRules.charactersOnly("Any other")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      {!viewMode && (
        <div className="col-span-2 text-right">
          <Button
            htmlType="submit"
            block
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            Create
          </Button>
        </div>
      )}
    </Form>
  );
}

export default CareerPathForm;
