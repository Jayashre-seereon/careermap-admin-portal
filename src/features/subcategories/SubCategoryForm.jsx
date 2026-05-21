import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import RichTextEditor from "../../components/ui/RichTextEditor";
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

export default function SubCategoryForm({
  onSubmit,
  initialValues,
  mode,
  categoryOptions = [],
  secondCategoryOptions = [],
  institutionOptions = [],
}) {
  const [form] = Form.useForm();
  const isView = mode === "view";

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        categoryId: initialValues.categoryId,
        secondcategoryId: initialValues.secondcategoryId,
        institutionId: initialValues.institutionId,
        file: toUploadFileList(initialValues.file, "subcategory-file"),
        coverImage: toUploadFileList(initialValues.coverImage, "subcategory-cover-image"),
      });
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <h3 className="md:col-span-2 lg:col-span-3 mb-1 text-lg font-semibold text-[#9a2119]">
          Subcategory Details
        </h3>

        <Form.Item
          name="categoryId"
          label="Category"
          rules={[validationRules.required("Category")]}
        >
          <Select disabled={isView} placeholder="Select category">
            {categoryOptions.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.title || item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="secondcategoryId"
          label="2nd Category"
          rules={[validationRules.required("2nd category")]}
        >
          <Select disabled={isView} placeholder="Select 2nd category">
            {secondCategoryOptions.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name || item.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="institutionId"
          label="Institution"
          rules={[validationRules.required("Institution")]}
        >
          <Select
            showSearch
            allowClear
            disabled={isView}
            placeholder="Search and select institution"
            optionFilterProp="label"
            options={institutionOptions.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[validationRules.required("Title")]}
        >
          <Input disabled={isView} placeholder="Enter title" />
        </Form.Item>

        <Form.Item name="path" label="Path Ways">
          <Input disabled={isView} placeholder="Enter path ways" />
        </Form.Item>

        <Form.Item
          name="file"
          label="File"
          valuePropName="fileList"
          getValueFromEvent={normalizeFile}
        >
          <Upload
            beforeUpload={() => false}
            disabled={isView}
            maxCount={1}
            listType="text"
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="coverImage"
          label="Cover Image"
          valuePropName="fileList"
          getValueFromEvent={normalizeFile}
        >
          <Upload
            beforeUpload={() => false}
            disabled={isView}
            maxCount={1}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          className="md:col-span-2 lg:col-span-3"
        >
          <Input.TextArea rows={4} disabled={isView} />
        </Form.Item>

        <Form.Item
          name="specialization"
          label="Specialization"
          className="md:col-span-2 lg:col-span-3"
        >
          <RichTextEditor
            disabled={isView}
            placeholder="Enter specialization"
            height={160}
          />
        </Form.Item>

        <Form.Item
          name="importandt_facts"
          label="Important Facts"
          className="md:col-span-2 lg:col-span-3"
        >
          <RichTextEditor
            disabled={isView}
            placeholder="Enter important facts"
            height={160}
          />
        </Form.Item>
      </div>

      {!isView && (
        <Button
          htmlType="submit"
          block
          style={{ background: "#9a2119", borderColor: "#9a2119", color: "#fff" }}
        >
          {mode === "edit" ? "Update" : "Create"}
        </Button>
      )}
    </Form>
  );
}
