import { useEffect } from "react";
import { Button, Form, Input, Select } from "antd";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

const normalizeTagValues = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export default function StudyAbroadForm({ onSubmit, initialValues, mode }) {
  const [form] = Form.useForm();
  const isView = mode === "view";

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        topUniversity: normalizeTagValues(initialValues.topUniversity),
        scholarship: normalizeTagValues(initialValues.scholarship),
        requirement: normalizeTagValues(initialValues.requirement),
        popularCourses: normalizeTagValues(initialValues.popularCourses),
      });
      return;
    }

    form.resetFields();
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
        Study Abroad Details
      </h3>

      <Form.Item
        name="title"
        label="Title"
        rules={[validationRules.required("Title")]}
      >
        <Input disabled={isView} placeholder="Enter title" />
      </Form.Item>

      <Form.Item
        name="countryName"
        label="Country"
        rules={[validationRules.required("Country")]}
      >
        <Input disabled={isView} placeholder="Enter country" />
      </Form.Item>

      <Form.Item name="popularCourses" label="Popular Courses">
        <Select
          mode="tags"
          disabled={isView}
          placeholder="Add popular courses"
          tokenSeparators={[","]}
          open={false}
        />
      </Form.Item>

      <Form.Item
        name="livingCost"
        label="Living Cost"
        rules={[validationRules.required("Living Cost")]}
      >
        <Input disabled={isView} placeholder="Enter living cost" />
      </Form.Item>

      <Form.Item
        name="tuitionCost"
        label="Tuition Cost"
        rules={[validationRules.required("Tuition Cost")]}
      >
        <Input disabled={isView} placeholder="Enter tuition cost" />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        className="md:col-span-2"
      >
        <Input.TextArea rows={4} disabled={isView} />
      </Form.Item>

      <Form.Item
        name="overview"
        label="Overview"
        className="md:col-span-2"
      >
        <Input.TextArea rows={4} disabled={isView} />
      </Form.Item>

      <Form.Item
        name="visaAndWorkRights"
        label="Visa & Work Rights"
        className="md:col-span-2"
      >
        <RichTextEditor disabled={isView} height={220} />
      </Form.Item>

      <Form.Item
        name="topUniversity"
        label="Top University"
        className="md:col-span-2"
      >
        <Select
          mode="tags"
          disabled={isView}
          placeholder="Add top universities"
          tokenSeparators={[","]}
          open={false}
        />
      </Form.Item>

      <Form.Item
        name="scholarship"
        label="Scholarship"
        className="md:col-span-2"
      >
        <Select
          mode="tags"
          disabled={isView}
          placeholder="Add scholarships"
          tokenSeparators={[","]}
          open={false}
        />
      </Form.Item>

      <Form.Item
        name="requirement"
        label="Requirement"
        className="md:col-span-2"
      >
        <Select
          mode="tags"
          disabled={isView}
          placeholder="Add requirements"
          tokenSeparators={[","]}
          open={false}
        />
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
