import React, { useEffect } from "react";
import { Form, Input, Button, Upload, Select, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

function ModuleForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [initialValues]);

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <Form.Item name="image" label="Image">
          <Upload beforeUpload={() => false} disabled={disabled}>
            <Button icon={<UploadOutlined />} className="w-full">
              Upload Image
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item name="btnText" label="Btn Text">
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item name="url" label="URL">
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item name="position" label="Position">
          <Select disabled={disabled}>
            <Option value="Top">Top</Option>
            <Option value="Middle">Middle</Option>
            <Option value="Bottom">Bottom</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="isFree"
          label="Mark as Free"
          valuePropName="checked"
        >
          <Switch disabled={disabled} />
        </Form.Item>

      </div>

      {!disabled && (
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
        >
          Create
        </Button>
      )}
    </Form>
  );
}

export default ModuleForm;