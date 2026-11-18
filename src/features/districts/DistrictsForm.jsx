import useSubmitGuard from "../../hooks/useSubmitGuard";
import { useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import { validationRules } from "../../utils/formValidation";

export default function DistrictsForm({
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
      <h3 className="mb-4 text-lg font-semibold text-[#9a2119]">District Details</h3>

      {/* District Name */}
      <Form.Item
        name="name"
        label="District Name"
        rules={[validationRules.required("District name"), validationRules.nameText("District name")]}
      >
        <Input disabled={viewMode} />
      </Form.Item>

      {/* Select State */}
      <Form.Item name="state" label="Select State" rules={[validationRules.required("State")]}>
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
          htmlType="submit" loading={submitting}
          block
          className="bg-[#9a2119] text-white"
        >
          Add
        </Button>
      )}
    </Form>
  );
}
