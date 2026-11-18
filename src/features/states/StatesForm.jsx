import useSubmitGuard from "../../hooks/useSubmitGuard";
import { useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import { validationRules } from "../../utils/formValidation";

export default function StatesForm({
  onSubmit,
  initialValues,
  viewMode,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  const [guardedSubmit, submitting] = useSubmitGuard(onSubmit);
  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={guardedSubmit}
      validateTrigger={["onChange", "onBlur"]}
    >
      <h3 className="mb-4 text-lg font-semibold text-[#9a2119]">State Details</h3>

      {/* State Name */}
      <Form.Item
        name="name"
        label="State Name"
        rules={[validationRules.required("State name"), validationRules.nameText("State name")]}
      >
        <Input disabled={viewMode} />
      </Form.Item>

      {/* Select Country */}
      <Form.Item name="country" label="Select Country" rules={[validationRules.required("Country")]}>
        <Select disabled={viewMode}>
          <Select.Option value="India">India</Select.Option>
          <Select.Option value="Others">Others</Select.Option>
        </Select>
      </Form.Item>

      {!viewMode && (
        <Button
          htmlType="submit" loading={submitting}
          block
          className="bg-[#9a2119] text-white"
        >
          Submit
        </Button>
      )}
    </Form>
  );
}
