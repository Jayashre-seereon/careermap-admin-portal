import { useEffect } from "react";
import { Button, Form, Input, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import StatusSwitch from "../../components/ui/StatusSwitch";
import {
  getValueFromInput,
  inputSanitizers,
  validationRules,
} from "../../utils/formValidation";

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

export default function MasterClassForm({ onSubmit, initialValues, mode }) {
  const [form] = Form.useForm();
  const isView = mode === "view";
  const videoOptions = [
    { label: "Career Video", value: "career_video" },
    { label: "Export Video", value: "export_video" },
   
  ];

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        image: toUploadFileList(initialValues.image, "masterclass-image"),
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue({ isActive: true });
  }, [form, initialValues]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      initialValues={{ isActive: true }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
        Master Class Details
      </h3>

      <Form.Item
        name="title"
        label="Title"
        rules={[validationRules.required("Title")]}
      >
        <Input disabled={isView} placeholder="Enter title" />
      </Form.Item>

      <Form.Item
        name="name"
        label="Name"
        rules={[validationRules.required("Name")]}
      >
        <Input disabled={isView} placeholder="Enter speaker or class name" />
      </Form.Item>

      <Form.Item
        name="time"
        label="Time"
        rules={[validationRules.required("Time")]}
      >
        <Input disabled={isView} placeholder="e.g. 45 min" />
      </Form.Item>

      <Form.Item
        name="views"
        label="Views"
        getValueFromEvent={getValueFromInput(inputSanitizers.numbersOnly)}
        rules={[
          validationRules.required("Views"),
          validationRules.numbersOnly("Views"),
        ]}
      >
        <Input disabled={isView} placeholder="Enter total views" />
      </Form.Item>

      <Form.Item
        name="videoUrl"
        label="Video URL"
        getValueFromEvent={getValueFromInput(inputSanitizers.url)}
        rules={[
          validationRules.required("Video URL"),
          validationRules.url("Video URL"),
        ]}
      >
        <Input disabled={isView} placeholder="Enter video link" />
      </Form.Item>

     

      <Form.Item
        name="category"
        label="Category"
      >
        <Select disabled={isView} placeholder="Select category">
          {videoOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="isActive"
        label="Status"
        valuePropName="checked"
      >
        <StatusSwitch
          disabled={isView}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      </Form.Item>

      <Form.Item
        name="image"
        label="Image"
        valuePropName="fileList"
        getValueFromEvent={normalizeFile}
        className="md:col-span-2"
      >
        <Upload beforeUpload={() => false} maxCount={1} disabled={isView} listType="picture">
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Form.Item>

      {!isView && (
        <Button
          htmlType="submit"
          className="md:col-span-2 bg-[#9a2119] text-white"
        >
          {mode === "edit" ? "Update" : "Submit"}
        </Button>
      )}
    </Form>
  );
}
