import React, { useEffect } from "react";
import { Form, Button, Select } from "antd";
import StatusSwitch from "../../components/ui/StatusSwitch";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

function ModuleForm({ onSubmit, initialValues, disabled, moduleOptions = [] }) {
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
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
          Module Details
        </h3>

        <Form.Item
          name="title"
          label="Title"
          rules={[validationRules.required("Title")]}
        >
          <Select disabled={disabled} placeholder="Select module">
            {moduleOptions.map((item) => (
              <Option key={item.title} value={item.title}>
                {item.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="isFree" label="Unlocked" valuePropName="checked">
          <StatusSwitch disabled={disabled} />
        </Form.Item>
      </div>

      {!disabled && (
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
        >
          Submit
        </Button>
      )}
    </Form>
  );
}

export default ModuleForm;
