import React, { useEffect } from "react";
import { Button, Form, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

function SectionForm({ domainOptions, onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        image: initialValues.image || undefined,
      });
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  const handleFinish = (values) => {
    onSubmit({
      ...initialValues,
      ...values,
    });
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
          Section Details
        </h3>

        <Form.Item
          name="name"
          label="Name"
          rules={[validationRules.required("Name")]}
        >
          <Input placeholder="Enter name" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="code"
          label="Code"
          rules={[validationRules.required("Code")]}
        >
          <Input placeholder="Enter code" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="domain"
          label="Domain"
          rules={[validationRules.required("Domain")]}
        >
          <Select
            placeholder="Select Domain"
            disabled={disabled}
            options={domainOptions}
          />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image"
          valuePropName="fileList"
          getValueFromEvent={(event) => event?.fileList}
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            disabled={disabled}
          >
            <Button icon={<UploadOutlined />} disabled={disabled}>
              Choose File
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="keyTraits"
          label="Key Traits"
          className="md:col-span-2"
          rules={[validationRules.required("Key traits")]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter key traits"
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          name="enjoys"
          label="Enjoys"
          className="md:col-span-2"
          rules={[validationRules.required("Enjoys")]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter enjoys"
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          name="idealEnvironments"
          label="Ideal Environments"
          className="md:col-span-2"
          rules={[validationRules.required("Ideal environments")]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter ideal environments"
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

export default SectionForm;
