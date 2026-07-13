import { useEffect } from "react";
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import StatusSwitch from "../../components/ui/StatusSwitch";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { validationRules } from "../../utils/formValidation";
import { DATE_DISPLAY_FORMAT, parseDateValue } from "../../utils/date";

const { Option } = Select;

const toDayjsValue = (value) => parseDateValue(value);

const toUploadFileList = (value, fallbackName = "file") => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return [{ uid: value, name: fallbackName, status: "done", url: value }];
  }
  return [];
};

const mergeDefinedValues = (values = {}) =>
  Object.fromEntries(
    Object.entries(values).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    })
  );

function renderOptions(options = []) {
  return options.map((option) => {
    if (typeof option === "string") {
      return <Option key={option} value={option}>{option}</Option>;
    }
    return (
      <Option key={option.value} value={option.value}>
        {option.label || option.name || option.title || option.value}
      </Option>
    );
  });
}

// ─── Common Fields (4 per row) ───────────────────────────────────────────────
function renderCommonFields(viewMode, options, onStreamChange, onCategoryChange, onSecondCategoryChange) {
  return (
    <>
      <div className="col-span-4">
        <h3 className="mb-1 text-base font-semibold text-[#9a2119]">Common Details</h3>
        <p className="text-sm text-slate-500">These fields appear first for every section.</p>
      </div>

      <Form.Item name="stream" label="Stream" rules={[validationRules.required("Stream")]}>
        <Select disabled={viewMode} placeholder="Select stream" onChange={(v) => onStreamChange?.(v)}>
          {renderOptions(options.streamOptions)}
        </Select>
      </Form.Item>

      <Form.Item name="category" label="Category" rules={[validationRules.required("Category")]}>
        <Select disabled={viewMode} placeholder="Select category" onChange={(v) => onCategoryChange?.(v)}>
          {renderOptions(options.categoryOptions)}
        </Select>
      </Form.Item>

      <Form.Item name="secondCategory" label="Secondary Category">
        <Select disabled={viewMode} placeholder="Select secondary category" allowClear onChange={(v) => onSecondCategoryChange?.(v)}>
          {renderOptions(options.secondaryCategoryOptions)}
        </Select>
      </Form.Item>

      <Form.Item name="subcategory" label="Subcategory">
        <Select disabled={viewMode} placeholder="Select subcategory" allowClear>
          {renderOptions(options.subcategoryOptions)}
        </Select>
      </Form.Item>
      <Form.Item name="description" label="Description" className="col-span-4">
        <Input.TextArea rows={4} disabled={viewMode} placeholder="Enter description here..." />
      </Form.Item>
      <Form.Item name="specialization" label="Specialization" className="col-span-2">
  <RichTextEditor disabled={viewMode} height={180} />
</Form.Item>

<Form.Item name="importantFactor" label="Important Factor" className="col-span-2">
  <RichTextEditor disabled={viewMode} height={180} />
</Form.Item>

<Form.Item
  name="media"
  label="Media"
  valuePropName="fileList"
  getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
  getValueProps={(value) => ({ fileList: Array.isArray(value) ? value : [] })}
  className="col-span-4"
  required
>
  <Upload beforeUpload={() => false} disabled={viewMode} maxCount={1}>
    <Button icon={<UploadOutlined />} disabled={viewMode}>Upload Media</Button>
  </Upload>
</Form.Item>
    </>
  );
}

// ─── Salary Range Fields ─────────────────────────────────────────────────────
function renderSalaryRangeFields(viewMode) {
  return (
    <>
      <div className="text-base font-semibold text-[#9a2119] mb-2">Salary Range Details</div>

      <Form.List name="salaryRanges">
        {(fields, { add, remove }) => (
          <div>
           <div className="grid grid-cols-[1fr_120px_1fr_1fr_40px] gap-2 mb-1 text-xs font-medium text-slate-500 px-1">
  <div>Currency</div>
  <div>Profession</div>
  <div>Min Salary/Annum</div>
  <div>Max Salary/Annum</div>
  <div />
</div>

            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="grid grid-cols-[1fr_120px_1fr_1fr_40px] gap-2 mb-2">
                
                <Form.Item {...restField} name={[name, "currency"]} rules={[validationRules.required("Currency")]} className="mb-0">
                  <Select disabled={viewMode} placeholder="Currency">
                    <Option value="INR">INR</Option>
                    <Option value="USD">USD</Option>
                  </Select>
                </Form.Item>
<Form.Item {...restField} name={[name, "profession"]} rules={[validationRules.required("Profession")]} className="mb-0">
  <Input disabled={viewMode} placeholder="Profession" />
</Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "min"]}
                  rules={[
                    validationRules.required("Minimum salary"),
                    {
                      validator(_, value) {
                        if (!value && value !== 0) return Promise.resolve();
                        const strVal = String(value).replace(/,/g, "");
                        if (!/^\d+(\.\d+)?$/.test(strVal)) return Promise.reject(new Error("Only numbers are allowed"));
                        return Promise.resolve();
                      },
                    },
                  ]}
                  className="mb-0"
                >
                  <InputNumber
                    disabled={viewMode}
                    placeholder="Min salary"
                    className="w-full"
                    stringMode
                    controls={false}
                    min={0}
                    formatter={(v) => (v == null || v === "" ? "" : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
                    parser={(v) => (v ? v.replace(/,/g, "") : "")}
                    inputMode="numeric"
                    onKeyPress={(e) => { if (!/[\d.]/.test(e.key)) e.preventDefault(); }}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, "max"]}
                  rules={[
                    validationRules.required("Maximum salary"),
                    {
                      validator(_, value) {
                        if (!value && value !== 0) return Promise.resolve();
                        const strVal = String(value).replace(/,/g, "");
                        if (!/^\d+(\.\d+)?$/.test(strVal)) return Promise.reject(new Error("Only numbers are allowed"));
                        return Promise.resolve();
                      },
                    },
                  ]}
                  className="mb-0"
                >
                  <InputNumber
                    disabled={viewMode}
                    placeholder="Max salary"
                    className="w-full"
                    stringMode
                    controls={false}
                    min={0}
                    formatter={(v) => (v == null || v === "" ? "" : String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
                    parser={(v) => (v ? v.replace(/,/g, "") : "")}
                    inputMode="numeric"
                    onKeyPress={(e) => { if (!/[\d.]/.test(e.key)) e.preventDefault(); }}
                  />
                </Form.Item>

                <div className="flex items-center justify-center pt-1">
                  {!viewMode && fields.length > 1 && (
                    <Button danger type="text" icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                  )}
                </div>
              </div>
            ))}

            {!viewMode && (
              <Button type="dashed" onClick={() => add({ currency: "INR", min: "", max: "" })} icon={<PlusOutlined />} className="mt-1">
                Add Salary Range
              </Button>
            )}
          </div>
        )}
      </Form.List>
    </>
  );
}

// ─── Job Scope Fields ─────────────────────────────────────────────────────────
function renderJobScopeFields(viewMode, form) {
  return (
    <>
      <div className="text-base font-semibold text-[#9a2119] mb-2">Job Scope Details</div>

      <Form.List name="names">
        {(fields, { add, remove }) => (
          <div>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="grid grid-cols-[1fr_40px] gap-2 mb-2">
                <Form.Item
                  {...restField}
                  name={name}
                  className="mb-0"
                  rules={[
                    validationRules.required("Name"),
                    {
                      validator(_, value) {
                        if (!value || !value.trim()) return Promise.resolve();
                        const allNames = form.getFieldValue("names") || [];
                        const trimmedNew = value.trim().toLowerCase();
                        const duplicates = allNames.filter(
                          (n, idx) => idx !== name && typeof n === "string" && n.trim().toLowerCase() === trimmedNew
                        );
                        if (duplicates.length > 0) {
                          return Promise.reject(new Error(`"${value.trim()}" is already added in Job Scope`));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    disabled={viewMode}
                    placeholder="Enter job scope name"
                    onChange={() => {
                      const allNames = form.getFieldValue("names") || [];
                      allNames.forEach((_, idx) => {
                        form.validateFields([["names", idx]]).catch(() => {});
                      });
                    }}
                  />
                </Form.Item>

                <div className="flex items-center justify-center pt-1">
                  {!viewMode && fields.length > 1 && (
                    <Button danger type="text" icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                  )}
                </div>
              </div>
            ))}

            {!viewMode && (
              <Button type="dashed" onClick={() => add("")} icon={<PlusOutlined />} className="mt-1">
                Add Job Scope Name
              </Button>
            )}
          </div>
        )}
      </Form.List>
    </>
  );
}

// ─── Career Path Fields (Multiple) ───────────────────────────────────────────
function renderCareerPathFields(viewMode, options, onAutoFill, filteredPathOptions) {
  return (
    <>
      <div className="col-span-4 text-base font-semibold text-[#9a2119]">Career Path Details</div>

      <Form.List name="careerPaths">
        {(fields, { add, remove }) => (
          <div className="col-span-4 space-y-4">
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600">Career Path #{name + 1}</span>
                  {!viewMode && fields.length > 1 && (
                    <Button danger type="text" size="small" icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Form.Item
                    {...restField}
                    name={[name, "pathType"]}
                    label="Select Path Name"
                    rules={[validationRules.required("Path name")]}
                    className="col-span-2"
                  >
                   <Select
  disabled={viewMode}
  placeholder="Select path"
  showSearch
  optionFilterProp="children"
  filterOption={(input, option) =>
    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
  }
  onChange={(v) => onAutoFill?.("career-path", v, name)}
>
  {renderOptions(filteredPathOptions)}
</Select>
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "graduation"]} label="Graduation">
                    <Input disabled={viewMode} />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "afterGraduation"]} label="After Graduation">
                    <Input disabled={viewMode} />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "afterPostGraduation"]} label="After Post Graduation">
                    <Input disabled={viewMode} />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "anyOther"]} label="Any Other">
                    <Input disabled={viewMode} />
                  </Form.Item>
                </div>
              </div>
            ))}

            {!viewMode && (
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() => add({ pathType: undefined, graduation: "", afterGraduation: "", afterPostGraduation: "", anyOther: "" })}
              >
                Add Career Path
              </Button>
            )}
          </div>
        )}
      </Form.List>
    </>
  );
}

// ─── Entrance Exam Fields (Multiple) ─────────────────────────────────────────
function renderEntranceExamFields(viewMode, options, onAutoFill) {
  return (
    <>
      <div className="col-span-4 text-base font-semibold text-[#9a2119]">Entrance Exam Details</div>

      <Form.List name="entranceExams">
        {(fields, { add, remove }) => (
          <div className="col-span-4 space-y-4">
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600">Entrance Exam #{name + 1}</span>
                  {!viewMode && fields.length > 1 && (
                    <Button danger type="text" size="small" icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-4">
                  {/* Row 1 */}
                  <Form.Item
                    {...restField}
                    name={[name, "exam"]}
                    label="Select Exam Name"
                    rules={[validationRules.required("Exam name")]}
                    className="col-span-2"
                  >
                  <Select
  disabled={viewMode}
  placeholder="Select exam"
  showSearch
  optionFilterProp="children"
  filterOption={(input, option) =>
    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
  }
  onChange={(v) => onAutoFill?.("entrance-exam", v, name)}
>
  {renderOptions(options.examOptions)}
</Select>
                  </Form.Item>

                  {/* <Form.Item {...restField} name={[name, "examMode"]} label="Exam Mode">
                    <Select disabled={viewMode} placeholder="Select exam mode">
                      <Option value="online">Online</Option>
                      <Option value="offline">Offline</Option>
                      <Option value="hybrid">Hybrid</Option>
                    </Select>
                  </Form.Item> */}

                  {/* <Form.Item {...restField} name={[name, "frequency"]} label="Frequency">
                    <Input disabled={viewMode} />
                  </Form.Item> */}

                  {/* Row 2 */}
                  <Form.Item {...restField} name={[name, "issue"]} label="Issue Date">
                    <DatePicker className="w-full" disabled format={DATE_DISPLAY_FORMAT} />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "last"]} label="Last Date">
                    <DatePicker className="w-full" disabled format={DATE_DISPLAY_FORMAT} />
                  </Form.Item>

                  {/* <Form.Item {...restField} name={[name, "examDate"]} label="Exam Date">
                    <DatePicker className="w-full" disabled={viewMode} format={DATE_DISPLAY_FORMAT} />
                  </Form.Item> */}

                  {/* <Form.Item {...restField} name={[name, "duration"]} label="Duration">
                    <Input disabled={viewMode} />
                  </Form.Item> */}

                  {/* Row 3 */}
                  {/* <Form.Item {...restField} name={[name, "totalMark"]} label="Total Mark">
                    <Input disabled={viewMode} />
                  </Form.Item> */}

                  {/* <Form.Item {...restField} name={[name, "subject"]} label="Subject">
                    <Select mode="tags" disabled={viewMode} placeholder="Add subjects" tokenSeparators={[","]} open={false} />
                  </Form.Item> */}

                  <Form.Item
                    {...restField}
                    name={[name, "url"]}
                    label="URL"
                    rules={[validationRules.url("URL")]}
                  >
                    <Input disabled/>
                  </Form.Item>

                  {/* <Form.Item {...restField} name={[name, "topInstitutes"]} label="Top Institutes">
                    <Select mode="tags" disabled={viewMode} placeholder="Add top institutes" tokenSeparators={[","]} open={false} />
                  </Form.Item> */}

                  {/* Row 4: full-width */}
                  {/* <Form.Item {...restField} name={[name, "eligibility"]} label="Eligibility" className="col-span-4">
                    <Input.TextArea rows={2} disabled={viewMode} />
                  </Form.Item> */}

                  {/* <Form.Item {...restField} name={[name, "about"]} label="About" className="col-span-4">
                    <RichTextEditor disabled={viewMode} height={180} />
                  </Form.Item> */}

                  {/* <Form.Item {...restField} name={[name, "examPattern"]} label="Exam Pattern" className="col-span-4">
                    <RichTextEditor disabled={viewMode} height={200} />
                  </Form.Item> */}
                </div>
              </div>
            ))}

            {!viewMode && (
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() =>
                  add({
                    exam: undefined,
                    issue: null,
                    last: null,
                    url: "",
                    about: "",
                    eligibility: "",
                    examDate: null,
                    examMode: undefined,
                    duration: "",
                    subject: [],
                    totalMark: "",
                    frequency: "",
                    examPattern: "",
                    topInstitutes: [],
                  })
                }
              >
                Add Entrance Exam
              </Button>
            )}
          </div>
        )}
      </Form.List>
    </>
  );
}

// ─── Institution Fields (Multiple) ───────────────────────────────────────────
function renderInstitutionFields(viewMode, options, normalizeUpload, onAutoFill) {
  return (
    <>
      <div className="col-span-4 text-base font-semibold text-[#9a2119]">Institution Details</div>

      <Form.List name="institutions">
        {(fields, { add, remove }) => (
          <div className="col-span-4 space-y-4">
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600">Institution #{name + 1}</span>
                  {!viewMode && fields.length > 1 && (
                    <Button danger type="text" size="small" icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Form.Item
                    {...restField}
                    name={[name, "name"]}
                    label="Select Institution Name"
                    rules={[validationRules.required("Institution name")]}
                    className="col-span-2"
                  >
                    <Select
                     disabled={viewMode} 
                    placeholder="Select institution" 
                     showSearch
 optionFilterProp="label"
  filterOption={(input, option) =>
    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
  }
                    onChange={(v) => onAutoFill?.("institution", v, name)}>
                      {renderOptions(options.institutionOptions)}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "logo"]}
                    label="Logo"
                    valuePropName="fileList"
                    getValueFromEvent={normalizeUpload}
                    getValueProps={(value) => ({ fileList: Array.isArray(value) ? value : [] })}
                  >
                    <Upload beforeUpload={() => false} disabled maxCount={1}>
                      <Button icon={<UploadOutlined />} disabled>Upload Logo</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "type"]} label="Institution Type">
                    <Input disabled placeholder="Institution type" />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "country"]} label="Country">
                    <Input disabled />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "state"]} label="State">
                    <Input disabled />
                  </Form.Item>
{/* 
                  <Form.Item {...restField} name={[name, "city"]} label="City">
                    <Input disabled={viewMode} />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "district"]} label="District">
                    <Input disabled={viewMode} />
                  </Form.Item> */}

                  {/* <Form.Item {...restField} name={[name, "admission"]} label="Admission Process">
                    <Input disabled={viewMode} />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "date"]} label="Tentative Date">
                    <DatePicker className="w-full" disabled={viewMode} format={DATE_DISPLAY_FORMAT} />
                  </Form.Item> */}

                  <Form.Item {...restField} name={[name, "url"]} label="URL" rules={[validationRules.url("URL")]}>
                    <Input disabled/>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "isTop"]}
                    label="Is Top Institution"
                    valuePropName="checked"
                    getValueProps={(value) => ({ checked: value === "Yes" })}
                    normalize={(checked) => (checked ? "Yes" : "No")}
                  >
                    <StatusSwitch disabled checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "address"]} label="Address" className="col-span-4">
                    <Input.TextArea rows={2} disabled />
                  </Form.Item>

                  {/* <Form.Item {...restField} name={[name, "coursesOffered"]} label="Courses Offered" className="col-span-4">
                    <Select mode="tags" disabled={viewMode} placeholder="Add courses offered" tokenSeparators={[","]} open={false} />
                  </Form.Item> */}

                  {/* <Form.Item {...restField} name={[name, "about"]} label="About" className="col-span-4">
                    <RichTextEditor disabled={viewMode} height={180} />
                  </Form.Item> */}
                </div>
              </div>
            ))}

            {!viewMode && (
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() =>
                  add({ name: undefined, logo: [], type: "", address: "", admission: "", about: "", coursesOffered: [], date: null, url: "", country: "", state: "", city: "", district: "", isTop: "No" })
                }
              >
                Add Institution
              </Button>
            )}
          </div>
        )}
      </Form.List>
    </>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
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
  onStreamChange,
  onCategoryChange,
  onSecondCategoryChange,
}) {
  const selectedCategory = Form.useWatch("category", form);
  const selectedSecondCategory = Form.useWatch("secondCategory", form);

  const handleCategoryChange = (value) => {
    form.setFieldsValue({ secondCategory: undefined, subcategory: undefined });
    // reset pathType inside each careerPath entry
    const paths = form.getFieldValue("careerPaths") || [];
    form.setFieldsValue({ careerPaths: paths.map((p) => ({ ...p, pathType: undefined, graduation: "", afterGraduation: "", afterPostGraduation: "", anyOther: "" })) });
    onCategoryChange?.(value);
  };

  const handleSecondCategoryChange = (value) => {
    form.setFieldsValue({ subcategory: undefined });
    onSecondCategoryChange?.(value);
  };

  const normalizedInitialValues = initialValues
    ? {
        ...initialValues,
        description: initialValues.description || "",
        media: toUploadFileList(initialValues.media, "media"),
        // Career Paths array
        careerPaths: Array.isArray(initialValues.careerPaths) && initialValues.careerPaths.length > 0
          ? initialValues.careerPaths
          : initialValues.pathType
          ? [{ pathType: initialValues.pathType, graduation: initialValues.graduation || "", afterGraduation: initialValues.afterGraduation || "", afterPostGraduation: initialValues.afterPostGraduation || "", anyOther: initialValues.anyOther || "" }]
          : [{ pathType: undefined, graduation: "", afterGraduation: "", afterPostGraduation: "", anyOther: "" }],
        // Entrance Exams array
        entranceExams: Array.isArray(initialValues.entranceExams) && initialValues.entranceExams.length > 0
          ? initialValues.entranceExams.map((e) => ({
              ...e,
              issue: toDayjsValue(e.issue),
              last: toDayjsValue(e.last),
              examDate: toDayjsValue(e.examDate),
              subject: Array.isArray(e.subject) ? e.subject : [],
              topInstitutes: Array.isArray(e.topInstitutes) ? e.topInstitutes : [],
            }))
          : initialValues.exam
          ? [{
              exam: initialValues.exam,
              issue: toDayjsValue(initialValues.issue),
              last: toDayjsValue(initialValues.last),
              url: initialValues.url || "",
              about: initialValues.about || "",
              eligibility: initialValues.eligibility || "",
              examDate: toDayjsValue(initialValues.examDate),
              examMode: initialValues.examMode || undefined,
              duration: initialValues.duration || "",
              subject: Array.isArray(initialValues.subject) ? initialValues.subject : [],
              totalMark: initialValues.totalMark || "",
              frequency: initialValues.frequency || "",
              examPattern: initialValues.examPattern || "",
              topInstitutes: Array.isArray(initialValues.topInstitutes) ? initialValues.topInstitutes : [],
            }]
          : [{ exam: undefined, issue: null, last: null, url: "", about: "", eligibility: "", examDate: null, examMode: undefined, duration: "", subject: [], totalMark: "", frequency: "", examPattern: "", topInstitutes: [] }],
        // Institutions array
        institutions: Array.isArray(initialValues.institutions) && initialValues.institutions.length > 0
          ? initialValues.institutions.map((inst) => ({
              ...inst,
              date: toDayjsValue(inst.date),
              logo: toUploadFileList(inst.logo, "institution-logo"),
              coursesOffered: Array.isArray(inst.coursesOffered) ? inst.coursesOffered : [],
            }))
          : initialValues.name
          ? [{
              name: initialValues.name,
              logo: toUploadFileList(initialValues.logo, "institution-logo"),
              type: initialValues.type || "",
              address: initialValues.address || "",
              admission: initialValues.admission || "",
              about: initialValues.about || "",
              coursesOffered: Array.isArray(initialValues.coursesOffered) ? initialValues.coursesOffered : [],
              date: toDayjsValue(initialValues.date),
              url: initialValues.url || "",
              country: initialValues.country || "",
              state: initialValues.state || "",
              city: initialValues.city || "",
              district: initialValues.district || "",
              isTop: initialValues.isTop || "No",
            }]
          : [{ name: undefined, logo: [], type: "", address: "", admission: "", about: "", coursesOffered: [], date: null, url: "", country: "", state: "", city: "", district: "", isTop: "No" }],
      }
    : undefined;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(normalizedInitialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  const filteredPathOptions = (options.pathOptions || []).filter((item) => {
    const matchesCategory = !selectedCategory || !item.categoryId || item.categoryId === selectedCategory;
    const matchesSecondCategory = !selectedSecondCategory || !item.secondcategoryId || item.secondcategoryId === selectedSecondCategory;
    return matchesCategory && matchesSecondCategory;
  });

  useEffect(() => {
    const paths = form.getFieldValue("careerPaths") || [];
    const updated = paths.map((p) => {
      if (!p?.pathType) return p;
      const hasPath = filteredPathOptions.some((o) => o.value === p.pathType);
      if (!hasPath) return { ...p, pathType: undefined, graduation: "", afterGraduation: "", afterPostGraduation: "", anyOther: "" };
      return p;
    });
    form.setFieldsValue({ careerPaths: updated });
  }, [filteredPathOptions, form]);

  const handleAutoFill = (section, value, itemIndex) => {
    if (viewMode) return;

    if (section === "career-path") {
      const matchedPath = options.pathOptions.find((item) => item.value === value);
      if (!matchedPath?.record) return;
      const record = matchedPath.record;
      const currentPaths = form.getFieldValue("careerPaths") || [];
      const updated = [...currentPaths];
      updated[itemIndex] = {
        ...updated[itemIndex],
        pathType: record.id,
        graduation: record.graduation || "",
        afterGraduation: record.aftergraduation || record.afterGraduation || "",
        afterPostGraduation: record.afterpostgraduation || record.afterPostGraduation || "",
        anyOther: record.anyother || record.anyOther || "",
      };
      form.setFieldsValue({ careerPaths: updated });
      return;
    }

    if (section === "entrance-exam") {
      const matchedExam = options.examOptions.find((item) => item.value === value);
      if (!matchedExam?.record) return;
      const record = matchedExam.record;
      const subjectValues = Array.isArray(record.subject)
        ? record.subject
        : typeof record.subject === "string"
        ? record.subject.split(/[\n,]/).map((i) => i.trim()).filter(Boolean)
        : [];
      const topInstituteValues = Array.isArray(record.topInstitutes || record.top_institution)
        ? record.topInstitutes || record.top_institution
        : typeof (record.topInstitutes || record.top_institution) === "string"
        ? (record.topInstitutes || record.top_institution).split(/[\n,]/).map((i) => i.trim()).filter(Boolean)
        : [];

      const currentExams = form.getFieldValue("entranceExams") || [];
      const updated = [...currentExams];
      updated[itemIndex] = {
        ...updated[itemIndex],
        exam: record.id,
        issue: toDayjsValue(record.issuedate || record.issue),
        last: toDayjsValue(record.lastdate || record.last),
        url: record.url || "",
        about: record.about || "",
        eligibility: record.eligibility || "",
        examDate: toDayjsValue(record.examDate || record.exam_date),
        examMode: record.examMode || record.exam_mode || record.mode || undefined,
        duration: record.duration || "",
        subject: subjectValues,
        totalMark: record.totalMark || record.total_mark || "",
        frequency: record.frequency || record.frequncy || "",
        examPattern: record.examPattern || record.exam_pattern || "",
        topInstitutes: topInstituteValues,
      };
      form.setFieldsValue({ entranceExams: updated });
      return;
    }

    if (section === "institution") {
      const matchedInstitution = options.institutionOptions.find((item) => item.value === value);
      if (!matchedInstitution?.record) return;
      const record = matchedInstitution.record;
      const courseValues = Array.isArray(record.coursesOffered || record.course_offered)
        ? record.coursesOffered || record.course_offered
        : typeof (record.coursesOffered || record.course_offered) === "string"
        ? (record.coursesOffered || record.course_offered).split(/[\n,]/).map((i) => i.trim()).filter(Boolean)
        : [];

      const currentInstitutions = form.getFieldValue("institutions") || [];
      const updated = [...currentInstitutions];
      updated[itemIndex] = {
        ...updated[itemIndex],
        name: record.id,
        logo: toUploadFileList(record.logo, "institution-logo"),
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
      };
      form.setFieldsValue({ institutions: updated });
      onCategoryChange?.(record.categoryId || record.category);
      onSecondCategoryChange?.(record.secondcategoryId || record.secondCategoryId || record.secondCategory);
    }
  };

  const hasSalary = selectedSections.includes("salary-range");
  const hasJobScope = selectedSections.includes("job-scope");

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      onFinishFailed={({ errorFields }) => {
        const firstError = errorFields?.[0];
        if (firstError) form.scrollToField(firstError.name, { block: "center" });
      }}
      validateTrigger={["onChange", "onBlur"]}
      initialValues={normalizedInitialValues}
    >
      {/* ── Common: 4 per row ── */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {renderCommonFields(viewMode, options, onStreamChange, handleCategoryChange, handleSecondCategoryChange)}
      </div>

      {/* ── Section Checkboxes ── */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium">Select Sections</p>
        <Checkbox.Group
          value={selectedSections}
          onChange={onSectionChange}
          disabled={viewMode}
          style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
        >
          {sectionOptions.map((option) => (
            <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>
          ))}
        </Checkbox.Group>
      </div>

      {/* ── Salary Range + Job Scope side by side ── */}
      {(hasSalary || hasJobScope) && (
       <div
  className="grid gap-6 mb-4"
  style={hasSalary && hasJobScope ? { gridTemplateColumns: "2fr 1fr" } : { gridTemplateColumns: "1fr" }}
>     {hasSalary && (
            <div className="border border-slate-200 rounded-lg p-4">
              {renderSalaryRangeFields(viewMode)}
            </div>
          )}
          {hasJobScope && (
            <div className="border border-slate-200 rounded-lg p-4">
              {renderJobScopeFields(viewMode, form)}
            </div>
          )}
        </div>
      )}

      {/* ── Career Path (multiple) ── */}
      {selectedSections.includes("career-path") && (
        <div className="border border-slate-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-4 gap-4">
            {renderCareerPathFields(viewMode, options, handleAutoFill, filteredPathOptions)}
          </div>
        </div>
      )}

      {/* ── Entrance Exam (multiple) ── */}
      {selectedSections.includes("entrance-exam") && (
        <div className="border border-slate-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-4 gap-4">
            {renderEntranceExamFields(viewMode, options, handleAutoFill)}
          </div>
        </div>
      )}

      {/* ── Institution (multiple) ── */}
      {selectedSections.includes("institution") && (
        <div className="border border-slate-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-4 gap-4">
            {renderInstitutionFields(viewMode, options, normalizeUpload, handleAutoFill)}
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button onClick={onCancel}>{viewMode ? "Back" : "Cancel"}</Button>
        {!viewMode && (
          <Button htmlType="submit" style={{ background: "#9a2119", borderColor: "#9a2119" }} className="text-white">
            {initialValues ? "Update Details" : "Create Details"}
          </Button>
        )}
      </div>
    </Form>
  );
}
