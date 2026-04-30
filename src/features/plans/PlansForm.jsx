import { useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

export default function PlansForm({ onSubmit, initialValues, viewMode }) {
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
      className="grid grid-cols-2 gap-4"
    >
      <Form.Item
        name="name"
        label="Plan Name"
        rules={[validationRules.required("Plan name"), validationRules.charactersOnly("Plan name")]}
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

      <Form.Item name="module" label="Module" className="col-span-2" rules={[validationRules.required("Module")]}>
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
        <RichTextEditor
          disabled={viewMode}
          placeholder="Enter plan features"
          height={200}
        />
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
