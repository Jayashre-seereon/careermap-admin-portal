import React, { useEffect } from "react";
import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const normalizeFile = (event) => {
  if (Array.isArray(event)) {
    return event;
  }
  return event?.fileList || [];
};

const toUploadFileList = (value, fallbackName) => {
  if (!value || typeof value !== "string") {
    return [];
  }
  return [
    {
      uid: value,
      name: fallbackName,
      status: "done",
      url: value,
    },
  ];
};

export default function NewsletterForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
       image: initialValues.image
  ? [
      {
        uid: initialValues.image,
        name: initialValues.image.split("/").pop(), // ✅ actual file name
        status: "done",
        url: initialValues.image,
      },
    ]
  : [],   });
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit} validateTrigger={["onChange", "onBlur"]}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="url"
          label="URL"
          rules={[{ required: true, message: "URL is required" }, { type: "url", warningOnly: true }]}
        >
          <Input disabled={disabled} placeholder="https://example.com/newsletters/..." />
        </Form.Item>

        <Form.Item
          name="image"
          label="File"
          valuePropName="fileList"
          getValueFromEvent={normalizeFile}
          className="md:col-span-2"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Upload
            beforeUpload={() => false}
            disabled={disabled}
            maxCount={1}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Description is required" }]}
          className="md:col-span-2"
        >
          <Input.TextArea disabled={disabled} rows={4} placeholder="Enter description" />
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