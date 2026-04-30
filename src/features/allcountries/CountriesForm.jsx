import { Form, Input, Button } from "antd";
import { validationRules } from "../../utils/formValidation";

export default function CountriesForm({ onSubmit, initialValues, viewMode }) {
  const [form] = Form.useForm();

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
    >
      <Form.Item
        name="name"
        label="Country Name"
        rules={[validationRules.required("Country name"), validationRules.charactersOnly("Country name")]}
      >
        <Input disabled={viewMode} />
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
