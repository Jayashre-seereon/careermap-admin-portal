import { Form, Input, Select, Switch, Button } from "antd";
import { useEffect } from "react";
import RichTextEditor from "../../components/editor/RichTextEditor";

const { Option } = Select;

export default function ScholarshipForm({ onSubmit, initialValues, viewMode }) {
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
      initialValues={initialValues}
      onFinish={onSubmit}
      className="grid grid-cols-2 gap-4"
    >
      <Form.Item name="type" label="Type">
        <Select disabled={viewMode}>
          <Option value="State">State</Option>
          <Option value="Private">Private</Option>
        </Select>
      </Form.Item>

      <Form.Item name="class" label="Class">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="name" label="Name">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="url" label="URL">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="isFree" label="Is Free" valuePropName="checked">
        <Switch disabled={viewMode} />
      </Form.Item>

      <Form.Item name="markFree" label="Mark as Free" valuePropName="checked">
        <Switch disabled={viewMode} />
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
