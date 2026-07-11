import { Form, Input, Select, Button, DatePicker } from "antd";
import { useEffect } from "react";
import { validationRules } from "../../utils/formValidation";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { DATE_DISPLAY_FORMAT, parseDateValue } from "../../utils/date";

const { Option } = Select;

const validateSubjectTags = (_, value) => {
  const subjects = Array.isArray(value) ? value : [];

  if (subjects.length === 0) {
    return Promise.reject(new Error("Subject name is required."));
  }

  const invalidSubject = subjects.find((subject) => {
    const normalizedSubject = typeof subject === "string" ? subject.trim() : "";
    return !normalizedSubject || !/^[A-Za-z\s]+$/.test(normalizedSubject);
  });

  if (invalidSubject) {
    return Promise.reject(
      new Error("Only characters are allowed in subject name.")
    );
  }

  return Promise.resolve();
};

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
  streamOptions = [],
  categoryOptions = [],
  secondCategoryOptions = [],
  subcategoryOptions = [],
  onStreamChange,
  onCategoryChange,
  onSecondCategoryChange,
}) {
  const [form] = Form.useForm();
  const isView = mode === "view";

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        issuedate: parseDateValue(initialValues.issuedate),
        lastdate: parseDateValue(initialValues.lastdate),
        examDate: parseDateValue(initialValues.examDate),
        subject: normalizeTagValues(initialValues.subject),
        topInstitutes: normalizeTagValues(initialValues.topInstitutes),
      });
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  const handleStreamChange = (streamId) => {
    form.setFieldsValue({
      categoryId: undefined,
      secondcategoryId: undefined,
      subcategoryId: undefined,
    });
    onStreamChange?.(streamId);
  };

  const handleCategoryChange = (categoryId) => {
    form.setFieldsValue({
      secondcategoryId: undefined,
      subcategoryId: undefined,
    });
    onCategoryChange?.(categoryId);
  };

  const handleSecondCategoryChange = (secondCategoryId) => {
    form.setFieldsValue({
      subcategoryId: undefined,
    });
    onSecondCategoryChange?.(secondCategoryId);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <h3 className="md:col-span-2 lg:col-span-4 mb-1 text-lg font-semibold text-[#9a2119]">
        Entrance Exam Details
      </h3>

      <Form.Item
        name="streamId"
        label="Stream"
        rules={[validationRules.required("Stream")]}
      >
        <Select
          disabled={isView}
          placeholder="Select Stream"
          onChange={handleStreamChange}
        >
          {streamOptions.map((item) => (
            <Option key={item.value} value={item.value}>
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
        <Select
          disabled={isView}
          placeholder="Select category"
          onChange={handleCategoryChange}
        >
          {categoryOptions.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="secondcategoryId"
        label="2nd Category"
      
      >
        <Select
          disabled={isView}
          placeholder="Select 2nd Category"
          onChange={handleSecondCategoryChange}
        >
          {secondCategoryOptions.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="subcategoryId"
        label="Select Subcategory"
       
      >
        <Select disabled={isView} placeholder="Select Subcategory">
          {subcategoryOptions.map((item) => (
            <Option key={item.value} value={item.value}>
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
        <DatePicker
          className="w-full"
          disabled={isView}
          format={DATE_DISPLAY_FORMAT}
          placeholder="DD-MM-YYYY"
        />
      </Form.Item>

      <Form.Item name="lastdate" label="Last Date">
        <DatePicker
          className="w-full"
          disabled={isView}
          format={DATE_DISPLAY_FORMAT}
          placeholder="DD-MM-YYYY"
        />
      </Form.Item>
{/* 
      <Form.Item name="examDate" label="Exam Date">
        <DatePicker
          className="w-full"
          disabled={isView}
          format={DATE_DISPLAY_FORMAT}
          placeholder="DD-MM-YYYY"
        />
      </Form.Item>

      <Form.Item name="examMode" label="Exam Mode">
        <Select disabled={isView} placeholder="Select exam mode">
          <Option value="online">Online</Option>
          <Option value="offline">Offline</Option>
          <Option value="hybrid">Hybrid</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="duration"
        label="Duration"
        rules={[validationRules.duration("Duration")]}
      >
        <Input disabled={isView} placeholder="e.g. 1 hr or 30 min" />
      </Form.Item>

      <Form.Item
        name="subject"
        label="Subject"
        rules={[{ validator: validateSubjectTags }]}
      >
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
        name="topInstitutes"
        label="Top Institutes"
      >
        <Select
          mode="tags"
          disabled={isView}
          placeholder="Add top institutes"
          tokenSeparators={[","]}
          open={false}
        />
      </Form.Item> */}

      <Form.Item
        name="url"
        label="URL"
        rules={[validationRules.url("URL")]}
      >
        <Input disabled={isView} />
      </Form.Item>

      {/* FULL WIDTH FIELDS */}
      {/* <Form.Item
        name="eligibility"
        label="Eligibility"
        className="md:col-span-2 lg:col-span-4"
      >
        <Input.TextArea rows={3} disabled={isView} />
      </Form.Item>

      <Form.Item
        name="about"
        label="About"
        className="md:col-span-2 lg:col-span-4"
      >
        <Input.TextArea rows={3} disabled={isView} />
      </Form.Item>

      <Form.Item
        name="examPattern"
        label="Exam Pattern"
        className="md:col-span-2 lg:col-span-4"
      >
        <RichTextEditor disabled={isView} height={220} />
      </Form.Item> */}

      {!isView && (
        <div className="md:col-span-2 lg:col-span-4">
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