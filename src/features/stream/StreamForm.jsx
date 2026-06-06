import React, { useEffect } from "react";
import { Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { validationRules } from "../../utils/formValidation";

function StreamForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  const normalizeFile = (event) => {
    if (Array.isArray(event)) {
      return event;
    }

    return event?.fileList || [];
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        image: [],
      });
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit} validateTrigger={["onChange", "onBlur"]}>
      <h3 className="mb-4 text-lg font-semibold text-[#9a2119]">Stream Details</h3>

      <Form.Item
        name="name"
        label="Stream Name"
        rules={[validationRules.required("Stream name"), validationRules.charactersOnly("Stream name")]}
      >
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={normalizeFile}>
        <Upload beforeUpload={() => false} maxCount={1} disabled={disabled} listType="text">
          <Button icon={<UploadOutlined />} className="w-full">
            Upload Image
          </Button>
        </Upload>
      </Form.Item>

      {initialValues?.image && typeof initialValues.image === "string" ? (
        <div className="mb-4">
          <img
            src={initialValues.image}
            alt={initialValues.name}
            className="h-20 w-20 rounded-lg border object-cover"
          />
        </div>
      ) : null}

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

export default StreamForm;
