import React, { useEffect } from "react";
import { Form, Button, Select, Upload, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import StatusSwitch from "../../components/ui/StatusSwitch";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

function ModuleForm({ onSubmit, initialValues, disabled, moduleOptions = [] }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        image: undefined, // don't prefill Upload field
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

        {/* ── Image Upload Field ── */}
        <Form.Item
          name="image"
          label="Module Image"
          className="md:col-span-2"
          valuePropName="value"          // use value, not fileList
          getValueFromEvent={(e) => e}   // pass the Upload event object as-is
        >
          {disabled ? (
            // View mode — show existing image or placeholder
            initialValues?.image ? (
              <Image
                src={initialValues.image}
                alt="Module"
                style={{ maxHeight: 120, borderRadius: 8, objectFit: "cover" }}
              />
            ) : (
              <span className="text-gray-400 text-sm">No image uploaded</span>
            )
          ) : (
            <Upload
              beforeUpload={() => false}   // prevent auto-upload
              maxCount={1}
              accept="image/*"
              listType="picture"
            >
              <Button
                icon={<UploadOutlined />}
                style={{ borderColor: "#9a2119", color: "#9a2119" }}
              >
                Upload Image
              </Button>
            </Upload>
          )}
        </Form.Item>

        {/* Show current image in edit mode if one exists */}
        {!disabled && initialValues?.image && (
          <div className="md:col-span-2 -mt-2 mb-2">
            <p className="text-xs text-gray-500 mb-1">Current image:</p>
            <Image
              src={initialValues.image}
              alt="Current module"
              style={{ maxHeight: 80, borderRadius: 6, objectFit: "cover" }}
            />
          </div>
        )}
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