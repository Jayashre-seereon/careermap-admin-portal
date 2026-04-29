import { Form, Input, Select, Button } from "antd";

export default function StatesForm({
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
      {/* State Name */}
      <Form.Item name="name" label="State Name">
        <Input disabled={viewMode} />
      </Form.Item>

      {/* Select Country */}
      <Form.Item name="country" label="Select Country">
        <Select disabled={viewMode}>
          <Select.Option value="India">India</Select.Option>
          <Select.Option value="Others">Others</Select.Option>
        </Select>
      </Form.Item>

      {!viewMode && (
        <Button
          htmlType="submit"
          block
          className="bg-[#9a2119] text-white"
        >
          Submit
        </Button>
      )}
    </Form>
  );
}