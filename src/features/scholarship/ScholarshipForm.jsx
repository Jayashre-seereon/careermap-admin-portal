import { Form, Input, Select, Button } from "antd";
import { useEffect } from "react";
import RichTextEditor from "../../components/editor/RichTextEditor";
import StatusSwitch from "../../components/ui/StatusSwitch";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

export default function ScholarshipForm({ onSubmit, initialValues, viewMode }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        isFree: false,
        markFree: false,
        ...initialValues,
      });
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ isFree: false, markFree: false, ...initialValues }}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <Form.Item name="type" label="Type" rules={[validationRules.required("Type")]}>
        <Select disabled={viewMode}>
          <Option value="State">State</Option>
          <Option value="Private">Private</Option>
        </Select>
      </Form.Item>

      <Form.Item name="name" label="Name" rules={[validationRules.required("Name")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="url" label="URL" rules={[validationRules.url("URL")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="isFree" label="Is Free" valuePropName="checked">
        <StatusSwitch disabled={viewMode} />
      </Form.Item>

      <Form.Item name="markFree" label="Mark as Free" valuePropName="checked">
        <StatusSwitch disabled={viewMode} />
      </Form.Item>

      <Form.Item
        name="desc"
        label="Long Description"
        className="col-span-2"
      >
        <RichTextEditor height={220} readOnly={viewMode} />
      </Form.Item>

      {!viewMode && (
        <Button
          htmlType="submit"
          className="col-span-2 bg-[#9a2119] text-white"
        >
          Submit
        </Button>
      )}
    </Form>
  );
}
