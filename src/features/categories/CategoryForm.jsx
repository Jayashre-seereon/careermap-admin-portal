import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import RichTextEditor from "../../components/ui/RichTextEditor";
import StatusSwitch from "../../components/ui/StatusSwitch";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

const normalizeInstitutionValue = (value) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

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

export default function CategoryForm({
  onSubmit,
  initialValues,
  disabled,
  streamOptions = [],
  institutionOptions = [],
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        isUpgrade: "Free",
        ...initialValues,
        institutions: normalizeInstitutionValue(initialValues.institutions),
        file: toUploadFileList(initialValues.file, "category-file"),
        coverImage: toUploadFileList(initialValues.coverImage, "cover-image"),
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
      initialValues={{ isUpgrade: "Free" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
          Category Details
        </h3>

        <Form.Item name="stream" label="Stream" rules={[{ required: true }]}>
          <Select placeholder="Select Stream" disabled={disabled}>
            {streamOptions.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="institutions"
          label="Select Institutions"
          rules={[validationRules.required("Institutions")]}
        >
          <Select
            showSearch
            allowClear
            disabled={disabled}
            placeholder="Search and select institutions"
            optionFilterProp="label"
            options={institutionOptions.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Form.Item>

        <Form.Item name="title" label="Title">
          <Input disabled={disabled} />
        </Form.Item>

        <Form.Item name="howToBecome" label="Path Ways">
          <Input disabled={disabled} />
        </Form.Item>

        {/* <Form.Item
          name="file"
          label="File"
          valuePropName="fileList"
          getValueFromEvent={normalizeFile}
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

      */}
         <Form.Item
          name="coverImage"
          label="Cover Image"
          valuePropName="fileList"
          getValueFromEvent={normalizeFile}
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
          className="md:col-span-2"
        >
          <RichTextEditor
            disabled={disabled}
            placeholder="Enter description"
            height={160}
          />
        </Form.Item>

        <Form.Item
          name="specialisation"
          label="Specialisation"
          className="md:col-span-2"
        >
          <RichTextEditor
            disabled={disabled}
            placeholder="Enter specialisation"
            height={160}
          />
        </Form.Item>

        <Form.Item
          name="importantFacts"
          label="Important Facts"
          className="md:col-span-2"
        >
          <RichTextEditor
            disabled={disabled}
            placeholder="Enter important facts"
            height={160}
          />
        </Form.Item>

        {/* <Form.Item
          name="isUpgrade"
          label="Category Access"
          valuePropName="checked"
          getValueProps={(value) => ({ checked: value === "Free" })}
          normalize={(checked) => (checked ? "Free" : "Premium")}
          rules={[validationRules.required("Category access")]}
        >
          <StatusSwitch
            disabled={disabled}
            checkedChildren="Free"
            unCheckedChildren="Premium"
          />
        </Form.Item> */}
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
