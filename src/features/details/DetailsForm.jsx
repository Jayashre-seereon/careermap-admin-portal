import { useEffect } from "react";
import { Button, Checkbox, DatePicker, Form, Input, Select, Upload } from "antd";
import { MinusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import StatusSwitch from "../../components/ui/StatusSwitch";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

const toDayjsValue = (value) => {
  if (!value) {
    return null;
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

const mergeDefinedValues = (values = {}) =>
  Object.fromEntries(
    Object.entries(values).filter(([, value]) => {
      if (value === undefined || value === null) {
        return false;
      }

      if (typeof value === "string" && value.trim() === "") {
        return false;
      }

      return true;
    })
  );

function renderOptions(options) {
  return options.map((option) => {
    if (typeof option === "string") {
      return (
        <Option key={option} value={option}>
          {option}
        </Option>
      );
    }

    return (
      <Option key={option.value} value={option.value}>
        {option.label || option.name || option.title || option.value}
      </Option>
    );
  });
}

function renderCommonFields(viewMode, options, onCategoryChange, onSecondCategoryChange) {
  return (
    <>
      <div className="md:col-span-2">
        <h3 className="mb-1 text-base font-semibold text-[#9a2119]">Common Details</h3>
        <p className="text-sm text-slate-500">
          These fields appear first for every section.
        </p>
      </div>

      <Form.Item name="stream" label="Stream">
        <Select disabled={viewMode} placeholder="Select stream">
          {renderOptions(options.streamOptions)}
        </Select>
      </Form.Item>

      <Form.Item name="category" label="Category">
        <Select
          disabled={viewMode}
          placeholder="Select category"
          onChange={(value) => onCategoryChange?.(value)}
        >
          {renderOptions(options.categoryOptions)}
        </Select>
      </Form.Item>

      <Form.Item
        name="secondCategory"
        label="Secondary Category"
      >
        <Select
          disabled={viewMode}
          placeholder="Select secondary category"
          onChange={(value) => onSecondCategoryChange?.(value)}
        >
          {renderOptions(options.secondaryCategoryOptions)}
        </Select>
      </Form.Item>

      <Form.Item name="subcategory" label="Subcategory">
        <Select disabled={viewMode} placeholder="Select subcategory">
          {renderOptions(options.subcategoryOptions)}
        </Select>
      </Form.Item>
    </>
  );
}

function renderSectionSpecificFields(section, viewMode, options, normalizeUpload, onAutoFill) {
  if (section === "salary-range") {
    return (
      <>
        <div className="md:col-span-2 text-base font-semibold text-[#9a2119]">
          Salary Range Details
        </div>

        <Form.List name="salaryRanges">
          {(fields, { add, remove }) => (
            <>
              <div className="md:col-span-2 grid grid-cols-[1fr_1fr_32px] gap-2 text-sm text-slate-500">
                <div>Minimum Salary</div>
                <div>Maximum Salary</div>
                <div />
              </div>

              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="md:col-span-2 grid grid-cols-[1fr_1fr_32px] gap-2">
                  <Form.Item {...restField} name={[name, "min"]} rules={[validationRules.required("Minimum salary")]}>
                    <Input disabled={viewMode} placeholder="Minimum salary" />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "max"]} rules={[validationRules.required("Maximum salary")]}>
                    <Input disabled={viewMode} placeholder="Maximum salary" />
                  </Form.Item>

                  <div className="pt-[6px]">
                    {!viewMode && fields.length > 1 && (
                      <Button
                        danger
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    )}
                  </div>
                </div>
              ))}

              {!viewMode && (
                <Form.Item className="md:col-span-2">
                  <Button type="dashed" block onClick={() => add({ min: "", max: "" })}>
                    Add Salary Range
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </>
    );
  }

  if (section === "job-scope") {
    return (
      <>
        <div className="md:col-span-2 text-base font-semibold text-[#9a2119]">
          Job Scope Details
        </div>

        <Form.List name="names">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="md:col-span-2 grid grid-cols-[1fr_32px] gap-2">
                  <Form.Item {...restField} name={name} rules={[validationRules.required("Name")]}>
                    <Input disabled={viewMode} placeholder="Enter name" />
                  </Form.Item>

                  <div className="pt-[6px]">
                    {!viewMode && fields.length > 1 && (
                      <Button
                        danger
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      />
                    )}
                  </div>
                </div>
              ))}

              {!viewMode && (
                <Form.Item className="md:col-span-2">
                  <Button type="dashed" block onClick={() => add("")}>
                    Add Job Scope Name
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </>
    );
  }

  if (section === "career-path") {
    return (
      <>
        <div className="md:col-span-2 text-base font-semibold text-[#9a2119]">
          Career Path Details
        </div>

        <Form.Item name="pathType" label="Select Path Name" rules={[validationRules.required("Path name")]}>
          <Select
            disabled={viewMode}
            placeholder="Select path"
            onChange={(value) => onAutoFill?.("career-path", value)}
          >
            {renderOptions(options.pathOptions)}
          </Select>
        </Form.Item>

        <Form.Item name="graduation" label="Graduation">
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="afterGraduation" label="After Graduation">
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="afterPostGraduation" label="After Post Graduation">
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="anyOther" label="Any Other">
          <Input disabled={viewMode} />
        </Form.Item>
      </>
    );
  }

  if (section === "entrance-exam") {
    return (
      <>
        <div className="md:col-span-2 text-base font-semibold text-[#9a2119]">
          Entrance Exam Details
        </div>

        <Form.Item name="exam" label="Select Exam Name" rules={[validationRules.required("Exam name")]}>
          <Select
            disabled={viewMode}
            placeholder="Select exam"
            onChange={(value) => onAutoFill?.("entrance-exam", value)}
          >
            {renderOptions(options.examOptions)}
          </Select>
        </Form.Item>

        <Form.Item name="issue" label="Issue Date">
          <DatePicker className="w-full" disabled={viewMode} />
        </Form.Item>

        <Form.Item name="last" label="Last Date">
          <DatePicker className="w-full" disabled={viewMode} />
        </Form.Item>

        <Form.Item name="url" label="URL" className="md:col-span-2" rules={[validationRules.url("URL")]}>
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="about" label="About" className="md:col-span-2">
          <RichTextEditor disabled={viewMode} height={180} />
        </Form.Item>

        <Form.Item name="eligibility" label="Eligibility" className="md:col-span-2">
          <Input.TextArea rows={2} disabled={viewMode} />
        </Form.Item>

        <Form.Item name="examDate" label="Exam Date">
          <DatePicker className="w-full" disabled={viewMode} />
        </Form.Item>

        <Form.Item name="examMode" label="Exam Mode">
          <Select disabled={viewMode} placeholder="Select exam mode">
            <Option value="online">Online</Option>
            <Option value="offline">Offline</Option>
            <Option value="hybrid">Hybrid</Option>
          </Select>
        </Form.Item>

        <Form.Item name="duration" label="Duration">
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="subject" label="Subject">
          <Select mode="tags" disabled={viewMode} placeholder="Add subjects" tokenSeparators={[","]} open={false} />
        </Form.Item>

        <Form.Item name="totalMark" label="Total Mark">
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="frequency" label="Frequency">
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="examPattern" label="Exam Pattern" className="md:col-span-2">
          <RichTextEditor disabled={viewMode} height={220} />
        </Form.Item>

        <Form.Item name="topInstitutes" label="Top Institutes" className="md:col-span-2">
          <Select
            mode="tags"
            disabled={viewMode}
            placeholder="Add top institutes"
            tokenSeparators={[","]}
            open={false}
          />
        </Form.Item>
      </>
    );
  }

  return (
    <>
      <div className="md:col-span-2 text-base font-semibold text-[#9a2119]">
        Institution Details
      </div>

      <Form.Item name="name" label="Select Institution Name" rules={[validationRules.required("Institution name")]}>
        <Select
          disabled={viewMode}
          placeholder="Select institution"
          onChange={(value) => onAutoFill?.("institution", value)}
        >
          {renderOptions(options.institutionOptions)}
        </Select>
      </Form.Item>

      <Form.Item name="logo" label="Logo" valuePropName="fileList" getValueFromEvent={normalizeUpload}>
        <Upload beforeUpload={() => false} disabled={viewMode} maxCount={1}>
          <Button icon={<UploadOutlined />} disabled={viewMode}>
            Upload Logo
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item name="type" label="Institution Type">
        <Input disabled={viewMode} placeholder="Enter institution type" />
      </Form.Item>

      <Form.Item name="address" label="Address" className="md:col-span-2">
        <Input.TextArea rows={2} disabled={viewMode} />
      </Form.Item>

      <Form.Item name="admission" label="Admission Process">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="about" label="About" className="md:col-span-2">
        <RichTextEditor disabled={viewMode} height={180} />
      </Form.Item>

      <Form.Item name="coursesOffered" label="Courses Offered" className="md:col-span-2">
        <Select
          mode="tags"
          disabled={viewMode}
          placeholder="Add courses offered"
          tokenSeparators={[","]}
          open={false}
        />
      </Form.Item>

      <Form.Item name="date" label="Tentative Date">
        <DatePicker className="w-full" disabled={viewMode} />
      </Form.Item>

      <Form.Item name="url" label="URL" rules={[validationRules.url("URL")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="country" label="Country">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="state" label="State">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="city" label="City">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="district" label="District">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item
        name="isTop"
        label="Is Top Institution"
        valuePropName="checked"
        getValueProps={(value) => ({ checked: value === "Yes" })}
        normalize={(checked) => (checked ? "Yes" : "No")}
      >
        <StatusSwitch disabled={viewMode} checkedChildren="Yes" unCheckedChildren="No" />
      </Form.Item>
    </>
  );
}

export default function DetailsForm({
  form,
  initialValues,
  selectedSections,
  sectionOptions,
  viewMode,
  onSubmit,
  onCancel,
  onSectionChange,
  sectionLabels,
  options,
  normalizeUpload,
  onCategoryChange,
  onSecondCategoryChange,
}) {
  const normalizedInitialValues = initialValues
    ? {
        ...initialValues,
        logo: initialValues.logo || [],
        issue: toDayjsValue(initialValues.issue),
        last: toDayjsValue(initialValues.last),
        examDate: toDayjsValue(initialValues.examDate),
        date: toDayjsValue(initialValues.date),
        subject: Array.isArray(initialValues.subject) ? initialValues.subject : [],
        topInstitutes: Array.isArray(initialValues.topInstitutes) ? initialValues.topInstitutes : [],
        coursesOffered: Array.isArray(initialValues.coursesOffered) ? initialValues.coursesOffered : [],
      }
    : undefined;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(normalizedInitialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues, normalizedInitialValues]);

  const handleAutoFill = (section, value) => {
    if (viewMode) {
      return;
    }

    if (section === "career-path") {
      const matchedPath = options.pathOptions.find((item) => item.value === value);
      if (!matchedPath?.record) {
        return;
      }

      const record = matchedPath.record;
      form.setFieldsValue(
        mergeDefinedValues({
          stream: record.streamId || record.stream || undefined,
          category: record.categoryId || record.category || undefined,
          secondCategory: record.secondcategoryId || record.secondCategoryId || record.secondCategory || undefined,
          subcategory: record.subcategoryId || record.subcategory || undefined,
          pathType: record.id,
          graduation: record.graduation,
          afterGraduation: record.aftergraduation || record.afterGraduation || "",
          afterPostGraduation: record.afterpostgraduation || record.afterPostGraduation || "",
          anyOther: record.anyother || record.anyOther || "",
        })
      );
      onCategoryChange?.(record.categoryId || record.category);
      onSecondCategoryChange?.(record.secondcategoryId || record.secondCategoryId || record.secondCategory);
      return;
    }

    if (section === "entrance-exam") {
      const matchedExam = options.examOptions.find((item) => item.value === value);
      if (!matchedExam?.record) {
        return;
      }

      const record = matchedExam.record;
      const subjectValues = Array.isArray(record.subject)
        ? record.subject
        : typeof record.subject === "string"
          ? record.subject.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
          : [];
      const topInstituteValues = Array.isArray(record.topInstitutes || record.top_institution)
        ? record.topInstitutes || record.top_institution
        : typeof (record.topInstitutes || record.top_institution) === "string"
          ? (record.topInstitutes || record.top_institution)
              .split(/[\n,]/)
              .map((item) => item.trim())
              .filter(Boolean)
          : [];

      form.setFieldsValue(
        mergeDefinedValues({
          stream: record.streamId || record.stream || undefined,
          category: record.categoryId || record.category || undefined,
          secondCategory: record.secondcategoryId || record.secondCategoryId || record.secondCategory || undefined,
          subcategory: record.subcategoryId || record.subcategory || undefined,
          exam: record.id,
          issue: toDayjsValue(record.issuedate || record.issue),
          last: toDayjsValue(record.lastdate || record.last),
          url: record.url || "",
          about: record.about || "",
          eligibility: record.eligibility || "",
          examDate: toDayjsValue(record.examDate || record.exam_date),
          examMode: record.examMode || record.exam_mode || record.mode || "",
          duration: record.duration,
          subject: subjectValues,
          totalMark: record.totalMark || record.total_mark || "",
          frequency: record.frequency || record.frequncy || "",
          examPattern: record.examPattern || record.exam_pattern || "",
          topInstitutes: topInstituteValues,
        })
      );
      onCategoryChange?.(record.categoryId || record.category);
      onSecondCategoryChange?.(record.secondcategoryId || record.secondCategoryId || record.secondCategory);
      return;
    }

    if (section === "institution") {
      const matchedInstitution = options.institutionOptions.find((item) => item.value === value);
      if (!matchedInstitution?.record) {
        return;
      }

      const record = matchedInstitution.record;
      const courseValues = Array.isArray(record.coursesOffered || record.course_offered)
        ? record.coursesOffered || record.course_offered
        : typeof (record.coursesOffered || record.course_offered) === "string"
          ? (record.coursesOffered || record.course_offered)
              .split(/[\n,]/)
              .map((item) => item.trim())
              .filter(Boolean)
          : [];

      form.setFieldsValue(
        mergeDefinedValues({
          stream: record.streamId || record.stream || undefined,
          category: record.categoryId || record.category || undefined,
          secondCategory: record.secondcategoryId || record.secondCategoryId || record.secondCategory || undefined,
          subcategory: record.subcategoryId || record.subcategory || undefined,
          name: record.id,
          logo: record.logo || [],
          type: record.institute_type || record.type || "",
          address: record.address || "",
          admission: record.admission_process || record.admission || "",
          about: record.about || "",
          coursesOffered: courseValues,
          date: toDayjsValue(record.tentative_date || record.date),
          url: record.url || "",
          country: record.country || record.countruy || "",
          state: record.state || "",
          city: record.city || "",
          district: record.district || "",
          isTop: record.is_top ? "Yes" : record.isTop || "No",
        })
      );
      onCategoryChange?.(record.categoryId || record.category);
      onSecondCategoryChange?.(record.secondcategoryId || record.secondCategoryId || record.secondCategory);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
      onFinishFailed={({ errorFields }) => {
        const firstError = errorFields?.[0];
        if (firstError) {
          form.scrollToField(firstError.name, { block: "center" });
        }
      }}
      validateTrigger={["onChange", "onBlur"]}
      initialValues={normalizedInitialValues}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {renderCommonFields(viewMode, options, onCategoryChange, onSecondCategoryChange)}

      <div className="md:col-span-2">
        <p className="mb-2 text-sm font-medium">Select Sections</p>
        <Checkbox.Group
          value={selectedSections}
          onChange={onSectionChange}
          disabled={viewMode}
          style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
        >
          {sectionOptions.map((option) => (
            <Checkbox key={option.value} value={option.value}>
              {option.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      {selectedSections.map((section) => (
        <div key={section} className="md:col-span-2">
          <p className="mb-2 text-sm font-medium">{sectionLabels[section]} Fields</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderSectionSpecificFields(section, viewMode, options, normalizeUpload, handleAutoFill)}
          </div>
        </div>
      ))}

      <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
        <Button onClick={onCancel}>{viewMode ? "Back" : "Cancel"}</Button>

        {!viewMode && (
          <Button
            htmlType="submit"
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            {initialValues ? "Update Details" : "Create Details"}
          </Button>
        )}
      </div>
    </Form>
  );
}
