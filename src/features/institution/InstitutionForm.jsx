import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

function InstitutionForm({ onSubmit, initialValues, viewMode }) {
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
      className="grid grid-cols-3 gap-4"
    >
      {/* Name */}
      <Form.Item name="name" label="Institution Name" rules={[validationRules.required("Institution name")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      {/* Logo */}
      <Form.Item name="logo" label="Logo">
        <Upload beforeUpload={() => false} disabled={viewMode}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      {/* Type */}
      <Form.Item name="type" label="Institution Type">
        <Select disabled={viewMode}>
          <Option value="Govt.">Govt.</Option>
          <Option value="Pvt.">Pvt.</Option>
        </Select>
      </Form.Item>

      {/* Address */}
      <Form.Item name="address" label="Address" className="col-span-3">
        <Input.TextArea rows={2} disabled={viewMode} />
      </Form.Item>

      {/* Admission */}
      <Form.Item name="admission" label="Admission Process">
        <Input disabled={viewMode} />
      </Form.Item>

      {/* Date */}
      <Form.Item name="date" label="Tentative Date">
        <Input placeholder="July 2025" disabled={viewMode} />
      </Form.Item>

      {/* URL */}
      <Form.Item name="url" label="URL" rules={[validationRules.url("URL")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      {/* Country */}
      <Form.Item name="country" label="Country" rules={[validationRules.charactersOnly("Country")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      {/* State */}
      <Form.Item name="state" label="State" rules={[validationRules.charactersOnly("State")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      {/* District */}
      <Form.Item name="district" label="District" rules={[validationRules.charactersOnly("District")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      {/* Submit */}
      {!viewMode && (
        <div className="col-span-3">
          <Button
            htmlType="submit"
            block
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            Submit
          </Button>
        </div>
      )}
    </Form>
  );
}

export default InstitutionForm;
