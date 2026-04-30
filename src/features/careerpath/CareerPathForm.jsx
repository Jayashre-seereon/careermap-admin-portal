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
      <Form.Item name="module" label="Select Module" rules={[validationRules.required("Module")]}>
        <Select disabled={viewMode}>
          <Option value="Career Library">Career Library</Option>
        </Select>
      </Form.Item>

      <Form.Item name="stream" label="Stream" rules={[validationRules.required("Stream")]}>
        <Select disabled={viewMode} placeholder="Select Stream">
          <Option value="Science">Science</Option>
          <Option value="Commerce">Commerce</Option>
          <Option value="Arts">Arts</Option>
        </Select>
      </Form.Item>

      <Form.Item name="category" label="Category" rules={[validationRules.required("Category")]}>
        <Select disabled={viewMode}>
          <Option value="Medical">Medical</Option>
          <Option value="Engineering">Engineering</Option>
          <Option value="Commercial Pilot">Commercial Pilot</Option>
          <Option value="Merchant Navy">Merchant Navy</Option>
        </Select>
      </Form.Item>

      <Form.Item name="secondCategory" label="2nd Category" rules={[validationRules.required("2nd Category")]}>
        <Select disabled={viewMode}>
          <Option value="GENERAL COURSES/DEGREES">GENERAL COURSES/DEGREES</Option>
          <Option value="ALLIED & PARA MEDICAL COURSES/DEGREES">
            ALLIED & PARA MEDICAL COURSES/DEGREES
          </Option>
          <Option value="Architecture">Architecture</Option>
        </Select>
      </Form.Item>

      <Form.Item name="subcategory" label="Subcategory" rules={[validationRules.required("Subcategory")]}>
        <Select disabled={viewMode}>
          <Option value="MBBS">MBBS</Option>
          <Option value="BDS">BDS</Option>
          <Option value="B.Tech">B.Tech</Option>
        </Select>
      </Form.Item>

      <Form.Item name="pathType" label="Select Path">
        <Select disabled={viewMode}>
          <Option value="Path 1">Path 1</Option>
        </Select>
      </Form.Item>

      <Form.Item name="graduation" label="Graduation">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="afterGraduation" label="After Graduation">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="afterPostGraduation" label="After Post Graduation">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="anyOther" label="Any Other">
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
