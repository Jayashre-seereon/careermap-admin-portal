import useSubmitGuard from "../../hooks/useSubmitGuard";
import { useEffect } from "react";
import { Form, Input, InputNumber, Select, Button } from "antd";
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
        price: initialValues.price === "" || initialValues.price == null ? undefined : Number(initialValues.price),
        validity: initialValues.validity === "" || initialValues.validity == null ? undefined : Number(initialValues.validity),
        moduleIds: initialValues.moduleIds || [],
      });
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
        rules={[
          validationRules.required("Price"),
          {
            validator: (_, value) =>
              value === undefined || value === null || value === "" || Number(value) >= 0
                ? Promise.resolve()
                : Promise.reject(new Error("Price cannot be negative.")),
          },
        ]}
      >
        <InputNumber
          disabled={disabled}
          min={0}
          max={10000000}
          precision={2}
          controls={false}
          prefix="₹"
          placeholder="e.g. 999.00"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item name="plan_type" label="Plan Type">
        <Select disabled={disabled} placeholder="Select plan type" allowClear>
          <Select.Option value="best seller">Best Seller</Select.Option>
          <Select.Option value="recommended">Recommended</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="validity"
        label="Validity (in days)"
        rules={[
          validationRules.required("Validity"),
          {
            validator: (_, value) =>
              value === undefined || value === null || value === "" ||
              (Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 3650)
                ? Promise.resolve()
                : Promise.reject(new Error("Validity must be a whole number between 1 and 3650 days.")),
          },
        ]}
      >
        <InputNumber
          disabled={disabled}
          min={1}
          max={3650}
          precision={0}
          placeholder="e.g. 365"
          style={{ width: "100%" }}
        />
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

      {/* <Form.Item
        name="features"
        label="Features"
        className="md:col-span-2"
      >
        <RichTextEditor
          disabled={disabled}
          placeholder="Enter plan features"
          height={180}
        />
      </Form.Item> */}

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
          htmlType="submit" loading={submitting}
          className="md:col-span-2 bg-[#9a2119] text-white"
        >
          {initialValues ? "Update Plan" : "Add Plan"}
        </Button>
      )}
    </Form>
  );
}
