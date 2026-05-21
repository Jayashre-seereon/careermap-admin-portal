import React, { useEffect, useMemo } from "react";
import { Form, Input, Button, Select, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import RichTextEditor from "../../components/ui/RichTextEditor";
import StatusSwitch from "../../components/ui/StatusSwitch";
import {
  getValueFromInput,
  inputSanitizers,
  validationRules,
} from "../../utils/formValidation";

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

function MentorForm({
  onSubmit,
  initialValues,
  disabled,
  categoryOptions = [],
  subcategoryOptions = [],
}) {
  const [form] = Form.useForm();
  const selectedCategoryId = Form.useWatch("categoryId", form);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        status: true,
        ...initialValues,
        dateof_birth: initialValues.dateof_birth ? dayjs(initialValues.dateof_birth) : null,
        image: toUploadFileList(initialValues.image, "mentor-image"),
        resume: toUploadFileList(initialValues.resume, "mentor-resume"),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: true });
    }
  }, [form, initialValues]);

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId) {
      return subcategoryOptions;
    }

    return subcategoryOptions.filter(
      (item) => !item.categoryId || item.categoryId === selectedCategoryId
    );
  }, [subcategoryOptions, selectedCategoryId]);

  useEffect(() => {
    const currentSubCategoryId = form.getFieldValue("subCategoryId");
    const hasSubcategory = filteredSubcategories.some(
      (item) => item.id === currentSubCategoryId
    );

    if (currentSubCategoryId && !hasSubcategory) {
      form.setFieldsValue({ subCategoryId: undefined });
    }
  }, [filteredSubcategories, form]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      initialValues={{ status: true }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <h3 className="md:col-span-2 lg:col-span-4 mb-1 text-lg font-semibold text-[#9a2119]">
          Mentor Details
        </h3>

        <Form.Item
          name="categoryId"
          label="Category"
          rules={[validationRules.required("Category")]}
        >
          <Select disabled={disabled} placeholder="Select Category">
            {categoryOptions.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="subCategoryId"
          label="Subcategory"
          rules={[validationRules.required("Subcategory")]}
        >
          <Select disabled={disabled} placeholder="Select Subcategory">
            {filteredSubcategories.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[validationRules.required("Name")]}
        >
          <Input disabled={disabled} placeholder="Enter mentor name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[validationRules.email("Email")]}
        >
          <Input disabled={disabled} placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Phone Number"
          rules={[validationRules.phone("Phone number")]}
        >
          <Input disabled={disabled} placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item name="dateof_birth" label="Date of Birth">
          <DatePicker className="w-full" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="designation"
          label="Designation"
          rules={[validationRules.required("Designation")]}
        >
          <Input disabled={disabled} placeholder="Enter designation" />
        </Form.Item>

        <Form.Item
          name="education"
          label="Education"
          rules={[validationRules.required("Education")]}
        >
          <Input disabled={disabled} placeholder="Enter education field" />
        </Form.Item>

        <Form.Item name="placeof_word" label="Place of Work">
          <Input disabled={disabled} placeholder="Enter place of work" />
        </Form.Item>

        <Form.Item
          name="linkedin"
          label="LinkedIn"
          getValueFromEvent={getValueFromInput(inputSanitizers.url)}
          rules={[validationRules.url("LinkedIn URL")]}
        >
          <Input disabled={disabled} placeholder="Enter LinkedIn profile link" />
        </Form.Item>

        <Form.Item
          name="facebook"
          label="Facebook"
          getValueFromEvent={getValueFromInput(inputSanitizers.url)}
          rules={[validationRules.url("Facebook URL")]}
        >
          <Input disabled={disabled} placeholder="Enter Facebook profile link" />
        </Form.Item>

        <Form.Item name="skill" label="My Skills" className="md:col-span-2">
          <Input.TextArea
            rows={4}
            disabled={disabled}
            placeholder="Enter skills separated by commas"
          />
        </Form.Item>

        <Form.Item
          name="experience"
          label="Experience (Years)"
          rules={[validationRules.numbersOnly("Experience")]}
        >
          <Input disabled={disabled} placeholder="Enter years of experience" />
        </Form.Item>

        <Form.Item
          name="mentor_fees"
          label="Mentor Fees"
          rules={[validationRules.decimal("Mentor fees")]}
        >
          <Input disabled={disabled} placeholder="Enter mentor fees" />
        </Form.Item>

        <Form.Item
          name="rank"
          label="Rank"
          rules={[validationRules.decimal("Rank")]}
        >
          <Input disabled={disabled} placeholder="Enter rank" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image"
          valuePropName="fileList"
          getValueFromEvent={normalizeFile}
        >
          <Upload beforeUpload={() => false} maxCount={1} disabled={disabled}>
            <Button icon={<UploadOutlined />} className="w-full">
              Upload Image
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="resume"
          label="Resume"
          valuePropName="fileList"
          getValueFromEvent={normalizeFile}
        >
          <Upload beforeUpload={() => false} maxCount={1} disabled={disabled}>
            <Button icon={<UploadOutlined />} className="w-full">
              Upload Resume
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          className="md:col-span-2 lg:col-span-3"
        >
          <RichTextEditor
            disabled={disabled}
            placeholder="Enter mentor description"
            height={180}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          valuePropName="checked"
          className="md:col-span-2 lg:col-span-1"
        >
          <StatusSwitch
            disabled={disabled}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
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

export default MentorForm;
