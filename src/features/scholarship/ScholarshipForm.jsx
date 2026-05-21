import { Form, Input, Select, Button, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import dayjs from "dayjs";
import RichTextEditor from "../../components/ui/RichTextEditor";
import StatusSwitch from "../../components/ui/StatusSwitch";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

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

export default function ScholarshipForm({ onSubmit, initialValues, mode }) {
  const [form] = Form.useForm();
  const isView = mode === "view";

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        deadline: initialValues.deadline ? dayjs(initialValues.deadline) : null,
        image: toUploadFileList(initialValues.image, "scholarship-image"),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ is_free: false });
    }
  }, [form, initialValues]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
        Scholarship Details
      </h3>

      <Form.Item name="type" label="Type" rules={[validationRules.required("Type")]}>
        <Select disabled={isView}>
          <Option value="Government">Government</Option>
          <Option value="Private">Private</Option>
          <Option value="State">State</Option>
        </Select>
      </Form.Item>

      <Form.Item name="name" label="Name" rules={[validationRules.required("Name")]}>
        <Input disabled={isView} />
      </Form.Item>

      <Form.Item name="url" label="URL" rules={[validationRules.url("URL")]}>
        <Input disabled={isView} />
      </Form.Item>

      <Form.Item name="price" label="Price">
        <Input disabled={isView} />
      </Form.Item>

      <Form.Item name="deadline" label="Deadline">
        <DatePicker className="w-full" disabled={isView} />
      </Form.Item>

      <Form.Item name="is_free" label="Is Free" valuePropName="checked">
        <StatusSwitch disabled={isView} />
      </Form.Item>

      <Form.Item
        name="image"
        label="Image"
        valuePropName="fileList"
        getValueFromEvent={normalizeFile}
      >
        <Upload beforeUpload={() => false} maxCount={1} disabled={isView} listType="picture">
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="eligibility"
        label="Eligibility"
        className="md:col-span-2"
      >
        <Input.TextArea rows={3} disabled={isView} />
      </Form.Item>

      <Form.Item
        name="requirement"
        label="Requirement"
        className="md:col-span-2"
      >
        <Input.TextArea rows={3} disabled={isView} />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        className="md:col-span-2"
      >
        <RichTextEditor disabled={isView} height={220} />
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
