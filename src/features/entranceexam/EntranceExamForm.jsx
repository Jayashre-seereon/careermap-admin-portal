import { Form, Input, Select, Button, DatePicker } from "antd";
import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { validationRules } from "../../utils/formValidation";
import RichTextEditor from "../../components/ui/RichTextEditor";

const { Option } = Select;

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

export default function EntranceExamForm({
  onSubmit,
  initialValues,
  mode,
  moduleOptions = [],
  streamOptions = [],
  categoryOptions = [],
  secondCategoryOptions = [],
  subcategoryOptions = [],
}) {
  const [form] = Form.useForm();
  const isView = mode === "view";
  const selectedCategoryId = Form.useWatch("categoryId", form);
  const selectedSecondCategoryId = Form.useWatch("secondcategoryId", form);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        issuedate: initialValues.issuedate ? dayjs(initialValues.issuedate) : null,
        lastdate: initialValues.lastdate ? dayjs(initialValues.lastdate) : null,
        examDate: initialValues.examDate ? dayjs(initialValues.examDate) : null,
        subject: normalizeTagValues(initialValues.subject),
        topInstitutes: normalizeTagValues(initialValues.topInstitutes),
      });
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  const filteredSecondCategories = useMemo(() => {
    if (!selectedCategoryId) {
      return secondCategoryOptions;
    }

    return secondCategoryOptions.filter(
      (item) => !item.categoryId || item.categoryId === selectedCategoryId
    );
  }, [secondCategoryOptions, selectedCategoryId]);

  const filteredSubcategories = useMemo(() => {
    return subcategoryOptions.filter((item) => {
      const matchesCategory =
        !selectedCategoryId || !item.categoryId || item.categoryId === selectedCategoryId;
      const matchesSecondCategory =
        !selectedSecondCategoryId ||
        !item.secondcategoryId ||
        item.secondcategoryId === selectedSecondCategoryId;

      return matchesCategory && matchesSecondCategory;
    });
  }, [subcategoryOptions, selectedCategoryId, selectedSecondCategoryId]);

  useEffect(() => {
    const currentSecondCategoryId = form.getFieldValue("secondcategoryId");
    const hasSecondCategory = filteredSecondCategories.some(
      (item) => item.id === currentSecondCategoryId
    );

    if (currentSecondCategoryId && !hasSecondCategory) {
      form.setFieldsValue({
        secondcategoryId: undefined,
        subcategoryId: undefined,
      });
    }
  }, [filteredSecondCategories, form]);

  useEffect(() => {
    const currentSubcategoryId = form.getFieldValue("subcategoryId");
    const hasSubcategory = filteredSubcategories.some(
      (item) => item.id === currentSubcategoryId
    );

    if (currentSubcategoryId && !hasSubcategory) {
      form.setFieldsValue({
        subcategoryId: undefined,
      });
    }
  }, [filteredSubcategories, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
        Entrance Exam Details
      </h3>

      <Form.Item
        name="moduleId"
        label="Select Module"
        rules={[validationRules.required("Module")]}
      >
        <Select disabled={isView} placeholder="Select module">
          {moduleOptions.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="streamId"
        label="Stream"
        rules={[validationRules.required("Stream")]}
      >
        <Select disabled={isView} placeholder="Select Stream">
          {streamOptions.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="Select Category"
        rules={[validationRules.required("Category")]}
      >
        <Select disabled={isView} placeholder="Select category">
          {categoryOptions.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="secondcategoryId"
        label="2nd Category"
        rules={[validationRules.required("2nd category")]}
      >
        <Select disabled={isView} placeholder="Select 2nd Category">
          {filteredSecondCategories.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="subcategoryId"
        label="Select Subcategory"
        rules={[validationRules.required("Subcategory")]}
      >
        <Select disabled={isView} placeholder="Select Subcategory">
          {filteredSubcategories.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="examname"
        label="Exam Name"
        rules={[validationRules.required("Exam name")]}
      >
        <Input disabled={isView} />
      </Form.Item>

      <Form.Item name="issuedate" label="Issue Date">
        <DatePicker className="w-full" disabled={isView} />
      </Form.Item>

      <Form.Item name="lastdate" label="Last Date">
        <DatePicker className="w-full" disabled={isView} />
      </Form.Item>

      <Form.Item
        name="eligibility"
        label="Eligibility"
        className="md:col-span-2"
      >
        <Input.TextArea rows={3} disabled={isView} />
      </Form.Item>

      <Form.Item
        name="about"
        label="About"
        className="md:col-span-2"
      >
        <Input.TextArea rows={3} disabled={isView} />
      </Form.Item>

      <Form.Item name="examDate" label="Exam Date">
        <DatePicker className="w-full" disabled={isView} />
      </Form.Item>

      <Form.Item name="examMode" label="Exam Mode">
        <Input disabled={isView} placeholder="Online / Offline / Hybrid" />
      </Form.Item>

      <Form.Item name="duration" label="Duration">
        <Input disabled={isView} placeholder="e.g. 3 Hours" />
      </Form.Item>

      <Form.Item name="subject" label="Subject">
        <Select
          mode="tags"
          disabled={isView}
          placeholder="Add subjects"
          tokenSeparators={[","]}
          open={false}
        />
      </Form.Item>

      <Form.Item name="totalMark" label="Total Mark">
        <Input disabled={isView} placeholder="Enter total marks" />
      </Form.Item>

      <Form.Item name="frequency" label="Frequency">
        <Input disabled={isView} placeholder="e.g. Yearly" />
      </Form.Item>

      <Form.Item
        name="examPattern"
        label="Exam Pattern"
        className="md:col-span-2"
      >
        <RichTextEditor disabled={isView} height={220} />
      </Form.Item>

      <Form.Item
        name="topInstitutes"
        label="Top Institutes"
        className="md:col-span-2"
      >
        <Select
          mode="tags"
          disabled={isView}
          placeholder="Add top institutes"
          tokenSeparators={[","]}
          open={false}
        />
      </Form.Item>

      <Form.Item
        name="url"
        label="URL"
        className="md:col-span-2"
        rules={[validationRules.url("URL")]}
      >
        <Input disabled={isView} />
      </Form.Item>

      {!isView && (
        <div className="md:col-span-2">
          <Button
            htmlType="submit"
            block
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            {mode === "edit" ? "Update" : "Submit"}
          </Button>
        </div>
      )}
    </Form>
  );
}
