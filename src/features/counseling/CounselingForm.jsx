import { parseCategoryList } from "./counselingUtils";
import useSubmitGuard from "../../hooks/useSubmitGuard";
import React from "react";
import { Button, Form, Input, Select, DatePicker, Radio, InputNumber, Divider, Checkbox } from "antd";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";
import dayjs from "dayjs";
import { useMemo } from "react";

const { Option } = Select;

// Subjects shown per class/stream, matching the physical counseling sheet
const SUBJECTS_9_10 = ["Subject-1", "Subject-2", "Subject-3", "Subject-4", "Subject-5", "Subject-6"];
const SUBJECTS_SCIENCE = ["Subject-1", "Subject-2", "Subject-3", "Subject-4", "Subject-5", "Subject-6"];
const SUBJECTS_COMMERCE = ["Subject-1", "Subject-2", "Subject-3", "Subject-4", "Subject-5", "Subject-6"];
const SUBJECTS_HUMANITIES = ["Subject-1", "Subject-2", "Subject-3", "Subject-4", "Subject-5", "Subject-6"];

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

const normalizeMarks = (marks, subjects = []) => {
  const source = Array.isArray(marks)
    ? marks.reduce((result, item) => {
        if (item?.subject) result[item.subject] = item.score;
        return result;
      }, {})
    : (marks && typeof marks === "object" ? marks : {});

  // Some API responses include a normalized subjects array beside marks.
  subjects.forEach((item) => {
    if (item?.subject && source[item.subject] === undefined) {
      source[item.subject] = item.score;
    }
  });
  return source;
};

// Total percentage is free text (e.g. "85", "85.5%", "A+ / 92"), shown exactly as saved.
const normalizePercentage = (value) => {
  if (value === null || value === undefined) return undefined;
  const text = String(value).trim();
  return text || undefined;
};

function getSubjectsFor(classValue, streamValue) {
  if (streamValue === "Not Decided") return SUBJECTS_9_10;
  if (classValue === "9th" || classValue === "10th") {
    return streamValue ? SUBJECTS_9_10 : [];
  }
  if ((classValue === "11th" || classValue === "12th") && streamValue) {
    return STREAM_SUBJECTS[streamValue] || [];
  }
  return [];
}

function CounselingForm({ onSubmit, initialValues, disabled, instituteDisabled = false, instituteOptions = [] }) {
  const [form] = Form.useForm();
  // Partner institute of the record being viewed/edited (not the catalogue school).
  const initialInstituteId = initialValues?.instituteId ?? initialValues?.institute?.id ?? null;
  // Options come from the parent (already loaded), so the select never shows a bare id while
  // a second request is in flight. The record's own institute is added if it is not in the list.
  const institutes = useMemo(() => {
    const list = instituteOptions.map((institute) => ({ id: Number(institute.id), name: institute.name }));
    if (initialInstituteId && !list.some((institute) => institute.id === Number(initialInstituteId))) {
      list.push({
        id: Number(initialInstituteId),
        name: initialValues?.institute?.name || `Institute ${initialInstituteId}`,
      });
    }
    return list;
  }, [instituteOptions, initialInstituteId, initialValues]);

  const classValue = Form.useWatch("class", form);
  const streamValue = Form.useWatch("stream", form);
  const storedMarks = normalizeMarks(initialValues?.marks, initialValues?.subjects);
  // Keep the same generic subject fields in add, edit, and view modes.
  const subjects = getSubjectsFor(classValue, streamValue);
  React.useEffect(() => {
    if (!initialValues) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      ...initialValues,
      instituteId: initialValues.instituteId ?? initialValues.institute?.id ?? undefined,
      totalPercentage: normalizePercentage(
        initialValues.totalPercentage ?? initialValues.total_percentage ?? initialValues.percentage
      ),
      marks: normalizeMarks(initialValues.marks, initialValues.subjects),
      category: parseCategoryList(initialValues.category),
      counselingDate: initialValues.counselingDate
        ? dayjs(initialValues.counselingDate)
        : undefined,
    });
  }, [initialValues, form]);
  const handleFinish = async (values) => {
    try {
      const payload = {
        ...values,
        school: institutes.find((institute) => Number(institute.id) === Number(values.instituteId))?.name || initialValues?.school || null,
        instituteId: values.instituteId ? Number(values.instituteId) : null,
        totalPercentage: String(values.totalPercentage ?? "").trim() || null,
        stream: String(values.stream ?? "").trim() || null,
        // `category` is a String column: send the selected options as a JSON array string so the
        // request is valid even on a backend build that does not serialize arrays itself.
        category: parseCategoryList(values.category).length
          ? JSON.stringify(parseCategoryList(values.category))
          : null,
        counselingDate: values.counselingDate ? values.counselingDate.toISOString() : null,
      };
      await onSubmit(payload);
      form.resetFields();
    } catch (err) {
      // onSubmit already logs the error; keep the user's input so they can retry.
    }
  };





  const [guardedSubmit, submitting] = useSubmitGuard(handleFinish);
  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={guardedSubmit}
      validateTrigger={["onChange", "onBlur"]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <h3 className="mb-1 text-lg font-semibold text-[#9a2119] md:col-span-2">
          Counseling Details
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
          <Select placeholder="Select class" disabled={disabled}>
            <Option value="9th">9th</Option>
            <Option value="10th">10th</Option>
            <Option value="11th">11th</Option>
            <Option value="12th">12th</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="stream"
          label="Desired Stream"
          rules={[validationRules.required("Stream")]}
        >
          <Input placeholder="Enter desired stream (e.g. Science, Commerce, Arts)" disabled={disabled} maxLength={100} />
        </Form.Item>

        <Form.Item name="instituteId" label="School / Institute" rules={[validationRules.required("School / Institute")]}>
          <Select showSearch optionFilterProp="label" placeholder="Select institute" disabled={disabled || (instituteDisabled && Boolean(initialInstituteId))} options={institutes.map((institute) => ({ value: institute.id, label: institute.name }))} />
        </Form.Item>

      <Form.Item name="counselingDate" label="Date" rules={[validationRules.required("Date")]}>
  <DatePicker
    className="w-full"
    format="DD-MM-YYYY"
    disabled={disabled}
    disabledDate={(date) => date && date.isBefore(dayjs().startOf("day"))}
  />
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
          label="Email Id"
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

     
        <>
          <Divider />
          <h3 className="mb-2 text-lg font-semibold text-[#9a2119]">
            Latest Score 
          </h3>
<Form.Item
  name="totalPercentage"
  label="Total Percentage (%)"
>
  <Input
    placeholder="Enter total percentage (e.g. 85, 85.5%)"
    disabled={disabled}
    maxLength={50}
  />
</Form.Item>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
  {SUBJECTS_9_10.map((subject) => (
    <Form.Item key={subject} name={["marks", subject]} label={subject}>
      <Input className="w-full" disabled={disabled} />
    </Form.Item>
  ))}
</div>
        </>
      

      {disabled && initialValues?.marks && (
        <div className="mb-4 grid grid-cols-1 gap-2 rounded-lg bg-slate-50 p-3 text-sm sm:grid-cols-2">
          {initialValues.marks._createdAt && <div><span className="font-semibold">Created at:</span> {new Date(initialValues.marks._createdAt).toLocaleString()}</div>}
          {initialValues.marks._createdById && <div><span className="font-semibold">Created by ID:</span> {initialValues.marks._createdById}</div>}
          {initialValues.marks._creatorType && <div><span className="font-semibold">Creator type:</span> {initialValues.marks._creatorType}</div>}
          {initialValues.marks._counselorName && <div><span className="font-semibold">Counselor:</span> {initialValues.marks._counselorName}</div>}
        </div>
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
  label="Which category does your counselee belong to? (select all that apply)"
  rules={[{ required: true, type: "array", min: 1, message: "Please select at least one category" }]}
>
  <Checkbox.Group disabled={disabled} className="w-full">
    <div className="flex flex-col gap-2">
      {CATEGORY_OPTIONS.map((option) => (
        <Checkbox key={option.value} value={option.label}>
          <span className="font-semibold">({option.value})</span> {option.label}
        </Checkbox>
      ))}
    </div>
  </Checkbox.Group>
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
          htmlType="submit" loading={submitting}
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
