import { useEffect } from "react";
import { Form, Input, Upload, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

export default function ServicesForm({ onSubmit, initialValues, viewMode }) {
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
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
        Service Details
      </h3>

      <Form.Item
        name="title"
        label="Title"
        rules={[validationRules.required("Title")]}
      >
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[validationRules.required("Price"), validationRules.decimal("Price")]}
      >
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="icon" label="Icon">
        <Upload beforeUpload={() => false} disabled={viewMode}>
          <Button icon={<UploadOutlined />}>Upload Icon</Button>
        </Upload>
      </Form.Item>

      <Form.Item name="file" label="File (Max 200MB)">
        <Upload beforeUpload={() => false} disabled={viewMode}>
          <Button icon={<UploadOutlined />}>Upload File</Button>
        </Upload>
      </Form.Item>

      <Form.Item name="description" label="Description" className="md:col-span-2">
        <RichTextEditor
          disabled={viewMode}
          placeholder="Enter service description"
          height={180}
        />
      </Form.Item>

      <Form.Item name="status" label="Status" rules={[validationRules.required("Status")]}>
        <Select disabled={viewMode}>
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Inactive">Inactive</Select.Option>
        </Select>
      </Form.Item>

      {!viewMode && (
        <Button
          htmlType="submit"
          className="md:col-span-2 bg-[#9a2119] text-white"
        >
          Add Services
        </Button>
      )}
    </Form>
  );
}
