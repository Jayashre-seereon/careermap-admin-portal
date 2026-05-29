import { useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

export default function PlansForm({
  onSubmit,
  initialValues,
  disabled,
  moduleOptions = [],
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        moduleIds: initialValues.moduleIds || [],
      });
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
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
        Plan Details
      </h3>

      <Form.Item
        name="name"
        label="Plan Name"
        rules={[validationRules.required("Plan name")]}
      >
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item
        name="price"
        label="Price"
        rules={[validationRules.required("Price"), validationRules.decimal("Price")]}
      >
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item name="plan_type" label="Plan Type">
        <Select disabled={disabled} placeholder="Select plan type" allowClear>
          <Select.Option value="best seller">Best Seller</Select.Option>
          <Select.Option value="recommended">Recommended</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="validity"
        label="Validity"
        rules={[validationRules.required("Validity")]}
      >
        <Input disabled={disabled} placeholder="e.g. 12 months" />
      </Form.Item>

      <Form.Item
        name="moduleIds"
        label="Modules"
        className="md:col-span-2"
        rules={[validationRules.required("Module")]}
      >
        <Select
          mode="multiple"
          disabled={disabled}
          placeholder="Select modules"
          options={moduleOptions.map((item) => ({
            label: item.title,
            value: item.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="features"
        label="Features"
        className="md:col-span-2"
      >
        <RichTextEditor
          disabled={disabled}
          placeholder="Enter plan features"
          height={180}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        className="md:col-span-2"
      >
        <RichTextEditor
          disabled={disabled}
          placeholder="Enter plan description"
          height={180}
        />
      </Form.Item>

      {!disabled && (
        <Button
          htmlType="submit"
          className="md:col-span-2 bg-[#9a2119] text-white"
        >
          {initialValues ? "Update Plan" : "Add Plan"}
        </Button>
      )}
    </Form>
  );
}
