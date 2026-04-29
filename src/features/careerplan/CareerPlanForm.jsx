import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function CareerPlanForm({ onSubmit, initialValues, viewMode }) {
  const [form] = Form.useForm();

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
      className="grid grid-cols-2 gap-4"
    >
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="image" label="Image">
        <Upload beforeUpload={() => false} disabled={viewMode}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        className="col-span-2"
      >
        <Input.TextArea rows={4} disabled={viewMode} />
      </Form.Item>

      <Form.Item name="url" label="Link" className="col-span-2">
        <Input disabled={viewMode} />
      </Form.Item>

      {!viewMode && (
        <Button
          htmlType="submit"
          className="col-span-2 bg-[#9a2119] text-white"
        >
          Submit
        </Button>
      )}
    </Form>
  );
}