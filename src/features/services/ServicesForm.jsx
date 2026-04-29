import { Form, Input, Upload, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function ServicesForm({ onSubmit, initialValues, viewMode }) {
  const [form] = Form.useForm();

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
      className="grid grid-cols-2 gap-4"
    >
      <Form.Item name="title" label="Title">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="price" label="Price">
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

      <Form.Item name="description" label="Description" className="col-span-2">
        <Input.TextArea rows={4} disabled={viewMode} />
      </Form.Item>

      <Form.Item name="status" label="Status">
        <Select disabled={viewMode}>
          <Select.Option value="Active">Active</Select.Option>
          <Select.Option value="Inactive">Inactive</Select.Option>
        </Select>
      </Form.Item>

      {!viewMode && (
        <Button
          htmlType="submit"
          className="col-span-2 bg-[#9a2119] text-white"
        >
          Add Services
        </Button>
      )}
    </Form>
  );
}