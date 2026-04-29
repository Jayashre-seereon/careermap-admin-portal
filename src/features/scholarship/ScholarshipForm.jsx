import { Form, Input, Select, Switch, Button } from "antd";

const { Option } = Select;

export default function ScholarshipForm({ onSubmit, initialValues, viewMode }) {
  const [form] = Form.useForm();

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
      className="grid grid-cols-2 gap-4"
    >
      <Form.Item name="type" label="Type">
        <Select disabled={viewMode}>
          <Option value="State">State</Option>
          <Option value="Private">Private</Option>
        </Select>
      </Form.Item>

      <Form.Item name="name" label="Name">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="url" label="URL">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="isFree" label="Is Free" valuePropName="checked">
        <Switch disabled={viewMode} />
      </Form.Item>

      <Form.Item name="markFree" label="Mark as Free" valuePropName="checked">
        <Switch disabled={viewMode} />
      </Form.Item>

      <Form.Item
        name="description"
        label="Long Description"
        className="col-span-2"
      >
        <Input.TextArea rows={4} disabled={viewMode} />
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