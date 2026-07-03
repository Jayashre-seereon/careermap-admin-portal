import React from "react";
import { Button, Form, Input, Select, DatePicker, Radio, InputNumber, Divider } from "antd";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";
import dayjs from "dayjs";

const { Option } = Select;

// Subjects shown per class/stream, matching the physical counseling sheet
const SUBJECTS_9_10 = ["ENG", "MATHS", "SCIENCE", "SST", "SANSKRIT/HINDI/ODIYA"];
const SUBJECTS_SCIENCE = ["ENG", "PHY", "CHE", "MATHS", "BIO", "IT"];
const SUBJECTS_COMMERCE = ["ENG", "ACCOUNTING", "ECONOMICS", "BUSINESS STUDIES", "LEGAL STUDIES", "COMP/PH. ED"];
const SUBJECTS_HUMANITIES = ["ENG", "HISTORY", "GEOGRAPHY", "POL. SCIENCE", "PSYCHOLOGY", "SOCIOLOGY"];

const STREAM_SUBJECTS = {
  Science: SUBJECTS_SCIENCE,
  Commerce: SUBJECTS_COMMERCE,
  Humanities: SUBJECTS_HUMANITIES,
};

const CATEGORY_OPTIONS = [
  { value: "A", label: "Absolutely clear about future career options, need only the right direction and route" },
  { value: "B", label: "Confused between two/three career options" },
  { value: "C", label: "Parents and the student differ on career options" },
  { value: "D", label: "Changing career options quite frequently" },
  { value: "E", label: "Vague knowledge about career options" },
];

function getSubjectsFor(classValue, streamValue) {
  if (classValue === "9th" || classValue === "10th") {
    return SUBJECTS_9_10;
  }
  if ((classValue === "11th" || classValue === "12th") && streamValue) {
    return STREAM_SUBJECTS[streamValue] || [];
  }
  return [];
}

function CounselingForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  const classValue = Form.useWatch("class", form);
  const streamValue = Form.useWatch("stream", form);
  const isSeniorClass = classValue === "11th" || classValue === "12th";
  const subjects = getSubjectsFor(classValue, streamValue);

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        counselingDate: initialValues.counselingDate ? dayjs(initialValues.counselingDate) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        counselingDate: values.counselingDate ? values.counselingDate.toISOString() : null,
      };
      await onSubmit(payload);
      form.resetFields();
    } catch (err) {
      // onSubmit already logs the error; keep the user's input so they can retry.
    }
  };

  const handleClassChange = () => {
    // Class changed -> stream and marks are no longer valid, clear them
    form.setFieldsValue({ stream: undefined, marks: undefined });
  };

  const handleStreamChange = () => {
    // Stream changed -> subject set changed, clear old marks
    form.setFieldsValue({ marks: undefined });
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      validateTrigger={["onChange", "onBlur"]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <h3 className="mb-1 text-lg font-semibold text-[#9a2119] md:col-span-2">
          Counselee Details
        </h3>

        <Form.Item
          name="studentName"
          label="Name of the Counselee"
          rules={[validationRules.required("Name")]}
        >
          <Input placeholder="Enter counselee name" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="class"
          label="Class"
          rules={[validationRules.required("Class")]}
        >
          <Select placeholder="Select class" disabled={disabled} onChange={handleClassChange}>
            <Option value="9th">9th</Option>
            <Option value="10th">10th</Option>
            <Option value="11th">11th</Option>
            <Option value="12th">12th</Option>
          </Select>
        </Form.Item>

        {isSeniorClass && (
          <Form.Item
            name="stream"
            label="Stream (11th/12th)"
            rules={[validationRules.required("Stream")]}
          >
            <Select placeholder="Select stream" disabled={disabled} onChange={handleStreamChange}>
              <Option value="Science">Science</Option>
              <Option value="Commerce">Commerce</Option>
              <Option value="Humanities">Humanities</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item name="school" label="School" rules={[validationRules.required("School")]}>
          <Input placeholder="Enter school name" disabled={disabled} />
        </Form.Item>

      <Form.Item name="counselingDate" label="Date" rules={[validationRules.required("Date")]}>
  <DatePicker className="w-full" format="DD-MM-YYYY" disabled={disabled} />
</Form.Item>

     <Form.Item
  name="phoneNumber"
  label="Phone Number"
  rules={[
    validationRules.required("Phone Number"),
    {
      pattern: /^[6-9]\d{9}$/,
      message: "Enter a valid 10-digit phone number",
    },
  ]}
>
  <Input
    placeholder="Enter phone number"
    disabled={disabled}
    maxLength={10}
    onKeyPress={(e) => {
      // Block anything that isn't a digit
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    }}
    onPaste={(e) => {
      const pasted = e.clipboardData.getData("text");
      if (!/^\d+$/.test(pasted)) {
        e.preventDefault();
      }
    }}
  />
</Form.Item>

        <Form.Item
          name="email"
          label="Gmail Id"
          rules={[validationRules.required("Email"), validationRules.email("Email")]}
        >
          <Input placeholder="Enter email" disabled={disabled} />
        </Form.Item>

        <Form.Item name="fatherOccupation" label="Occupation of Father">
          <Input placeholder="Enter father's occupation" disabled={disabled} />
        </Form.Item>

        <Form.Item name="motherOccupation" label="Occupation of Mother">
          <Input placeholder="Enter mother's occupation" disabled={disabled} />
        </Form.Item>

        <Form.Item name="siblingCount" label="No. of Sibling">
          <InputNumber className="w-full" min={0} disabled={disabled} />
        </Form.Item>
      </div>

      {classValue && (
        <>
          <Divider />
          <h3 className="mb-2 text-lg font-semibold text-[#9a2119]">
            {classValue === "9th" || classValue === "10th"
              ? "Latest Score"
              : `Latest Score (${streamValue || "select stream"})`}
          </h3>

          {subjects.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {subjects.map((subject) => (
                <Form.Item key={subject} name={["marks", subject]} label={subject}>
                  <InputNumber className="w-full" min={0} max={100} disabled={disabled} />
                </Form.Item>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a stream to enter marks.</p>
          )}
        </>
      )}

      <Divider />
      <h3 className="mb-2 text-lg font-semibold text-[#9a2119]">Student's Dream Career</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Form.Item name="dreamCareerOption1" label="Option 1">
          <Input placeholder="Enter option 1" disabled={disabled} />
        </Form.Item>
        <Form.Item name="dreamCareerOption2" label="Option 2">
          <Input placeholder="Enter option 2" disabled={disabled} />
        </Form.Item>
        <Form.Item name="dreamCareerOption3" label="Option 3">
          <Input placeholder="Enter option 3" disabled={disabled} />
        </Form.Item>
      </div>

      <Form.Item name="parentsExpectation" label="What do your parents want you to become?">
        <Input rows={2} placeholder="Enter parents' expectation" disabled={disabled} />
      </Form.Item>

      <Divider />
    <Form.Item
  name="category"
  label="Which category does your counselee belong to?"
  rules={[validationRules.required("Category")]}
>
  <Radio.Group disabled={disabled} className="w-full">
    <div className="flex flex-col gap-2">
      {CATEGORY_OPTIONS.map((option) => (
        <Radio key={option.value} value={option.label}>
          <span className="font-semibold">({option.value})</span> {option.label}
        </Radio>
      ))}
    </div>
  </Radio.Group>
</Form.Item>

      <Form.Item name="observation" label="Observation & Recommendation / Suggestion">
        <RichTextEditor height={150} placeholder="Enter observation and recommendation" disabled={disabled} />
      </Form.Item>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Form.Item name="counselorName" label="Name of the CC">
          <Input placeholder="Enter counselor name" disabled={disabled} />
        </Form.Item>

        <Form.Item name="psychometricRecommended" label="Psychometric Test">
          <Radio.Group disabled={disabled}>
            <Radio value={true}>Recommended</Radio>
            <Radio value={false}>Not Recommended</Radio>
          </Radio.Group>
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

export default CounselingForm;