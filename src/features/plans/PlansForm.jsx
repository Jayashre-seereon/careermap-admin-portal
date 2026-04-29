import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

export default function PlansForm({ onSubmit, initialValues, viewMode }) {
  const [form] = Form.useForm();

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
      className="grid grid-cols-2 gap-4"
    >
      <Form.Item name="name" label="Plan Name">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="price" label="Price">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="module" label="Module" className="col-span-2">
        <Select mode="multiple" disabled={viewMode}>
          <Option value="Career Library">Career Library</Option>
          <Option value="Career Assessment">Career Assessment</Option>
          <Option value="Master Class">Master Class</Option>
          <Option value="Book Your Mentor">Book Your Mentor</Option>
          <Option value="Entrance Exam">Entrance Exam</Option>
          <Option value="Institute">Institute</Option>
          <Option value="Scholarship">Scholarship</Option>
          <Option value="Quiz">Quiz</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="features"
        label="Features"
        className="col-span-2"
      >
        <Input.TextArea rows={5} disabled={viewMode} />
      </Form.Item>

      {!viewMode && (
        <Button
          htmlType="submit"
          className="col-span-2 bg-[#9a2119] text-white"
        >
          Add Plans
        </Button>
      )}
    </Form>
  );
}