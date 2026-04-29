import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

export default function NotificationsForm({ onSubmit, initialValues }) {
  const [form] = Form.useForm();

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      initialValues={initialValues}
      className="grid grid-cols-2 gap-4"
    >
      <Form.Item name="title" label="Title" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="type" label="Type">
        <Select>
          <Option value="Info">Info</Option>
          <Option value="Warning">Warning</Option>
          <Option value="Success">Success</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="message"
        label="Message"
        className="col-span-2"
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item name="target" label="Target">
        <Select>
          <Option value="All Users">All Users</Option>
          <Option value="Specific User">Specific User</Option>
        </Select>
      </Form.Item>

      <Form.Item name="status" label="Status">
        <Select>
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </Form.Item>

      <div className="col-span-2">
        <Button
          htmlType="submit"
          block
          style={{ background: "#9a2119", color: "white" }}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
}