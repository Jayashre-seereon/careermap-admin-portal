import React, { useEffect } from "react";
import { Form, Input, Button, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import StatusSwitch from "../../components/ui/StatusSwitch";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

function ModuleForm({ onSubmit, initialValues, disabled }) {
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <h3 className="md:col-span-2 lg:col-span-3 mb-1 text-lg font-semibold text-[#9a2119]">
          Module Details
        </h3>

        <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={normalizeFile}>
          <Upload beforeUpload={() => false} maxCount={1} disabled={disabled}>
            <Button icon={<UploadOutlined />} className="w-full">
              Upload Image
            </Button>
          </Upload>
        </Form.Item>

        {initialValues?.image && typeof initialValues.image === "string" ? (
          <div className="md:col-span-2 lg:col-span-3 mb-2">
            <img
              src={initialValues.image}
              alt={initialValues.title}
              className="h-20 w-20 rounded-lg border object-cover"
            />
          </div>
        ) : null}

        <Form.Item
          name="title"
          label="Title"
          rules={[validationRules.required("Title")]}
          >
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="btnText"
          label="Btn Text"
          rules={[validationRules.required("Button text")]}
            >
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="url"
          label="URL"
          rules={[validationRules.required("URL"), validationRules.url("URL")]}
        >
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item name="position" label="Position" rules={[validationRules.required("Position")]}>
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
