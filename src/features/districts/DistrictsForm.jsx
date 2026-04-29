import { Form, Input, Select, Button } from "antd";

export default function DistrictsForm({
  onSubmit,
  initialValues,
  viewMode,
}) {
  const [form] = Form.useForm();

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      {/* District Name */}
      <Form.Item name="name" label="District Name">
        <Input disabled={viewMode} />
      </Form.Item>

      {/* Select State */}
      <Form.Item name="state" label="Select State">
        <Select disabled={viewMode}>
          <Select.Option value="Telangana">Telangana</Select.Option>
          <Select.Option value="Madhya Pradesh">Madhya Pradesh</Select.Option>
          <Select.Option value="Lakshadweep">Lakshadweep</Select.Option>
          <Select.Option value="Uttar Pradesh">Uttar Pradesh</Select.Option>
          <Select.Option value="Gujarat">Gujarat</Select.Option>
        </Select>
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