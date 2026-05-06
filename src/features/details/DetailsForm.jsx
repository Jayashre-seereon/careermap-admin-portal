import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Upload,
} from "antd";
import {
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import StatusSwitch from "../../components/ui/StatusSwitch";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

function renderOptions(options) {
  return options.map((option) => (
    <Option key={option} value={option}>
      {option}
    </Option>
  ));
}

function renderCommonFields(viewMode, options) {
  return (
    <>
      <div className="md:col-span-2">
        <h3 className="mb-1 text-base font-semibold text-[#9a2119]">Common Details</h3>
        <p className="text-sm text-slate-500">
          These fields appear first for every section.
        </p>
      </div>

      <Form.Item name="stream" label="Stream" rules={[validationRules.required("Stream")]}>
        <Select disabled={viewMode} placeholder="Select Stream">
          {renderOptions(options.streamOptions)}
        </Select>
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[validationRules.required("Category")]}
      >
        <Select disabled={viewMode} placeholder="Select Category">
          {renderOptions(options.categoryOptions)}
        </Select>
      </Form.Item>

      <Form.Item name="secondCategory" label="Secondary Category">
        <Select disabled={viewMode} placeholder="Select secondary category">
          {renderOptions(options.secondCategoryOptions)}
        </Select>
      </Form.Item>

      <Form.Item name="subcategory" label="Subcategory">
        <Select disabled={viewMode} placeholder="Select Subcategory">
          {renderOptions(options.subcategoryOptions)}
        </Select>
      </Form.Item>
    </>
  );
}

function renderSectionSpecificFields(section, viewMode, options, normalizeUpload) {
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
                  <Form.Item
                    {...restField}
                    name={[name, "min"]}
                    rules={[validationRules.required("Minimum salary")]}
                  >
                    <Input disabled={viewMode} placeholder="Minimum salary" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "max"]}
                    rules={[validationRules.required("Maximum salary")]}
                  >
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
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[validationRules.required("Name")]}
                  >
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

        <Form.Item name="pathType" label="Select Path">
          <Select disabled={viewMode} placeholder="Select path">
            {renderOptions(options.pathTypeOptions)}
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

        <Form.Item
          name="exam"
          label="Exam Name"
          rules={[validationRules.required("Exam name")]}
        >
          <Input disabled={viewMode} />
        </Form.Item>

        <Form.Item name="issue" label="Issue Date">
          <Input disabled={viewMode} type="date" />
        </Form.Item>

        <Form.Item name="last" label="Last Date">
          <Input disabled={viewMode} type="date" />
        </Form.Item>

        <Form.Item
          name="url"
          label="URL"
          className="md:col-span-2"
          rules={[validationRules.url("URL")]}
        >
          <Input disabled={viewMode} />
        </Form.Item>
      </>
    );
  }

  return (
    <>
      <div className="md:col-span-2 text-base font-semibold text-[#9a2119]">
        Institution Details
      </div>

      <Form.Item
        name="name"
        label="Institution Name"
        rules={[validationRules.required("Institution name")]}
      >
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item
        name="logo"
        label="Logo"
        valuePropName="fileList"
        getValueFromEvent={normalizeUpload}
      >
        <Upload beforeUpload={() => false} disabled={viewMode} maxCount={1}>
          <Button icon={<UploadOutlined />} disabled={viewMode}>
            Upload Logo
          </Button>
        </Upload>
      </Form.Item>

      <Form.Item name="type" label="Institution Type">
        <Select disabled={viewMode} placeholder="Select institution type">
          <Option value="Govt.">Govt.</Option>
          <Option value="Pvt.">Pvt.</Option>
        </Select>
      </Form.Item>

      <Form.Item name="address" label="Address" className="md:col-span-2">
        <Input.TextArea rows={2} disabled={viewMode} />
      </Form.Item>

      <Form.Item name="admission" label="Admission Process">
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="date" label="Tentative Date">
        <Input type="date" disabled={viewMode} />
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
}) {
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {renderCommonFields(viewMode, options)}

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
            {renderSectionSpecificFields(section, viewMode, options, normalizeUpload)}
          </div>
        </div>
      ))}

      <div className="md:col-span-2 mt-2 flex items-center justify-end gap-2">
        <Button onClick={onCancel}>
          {viewMode ? "Back" : "Cancel"}
        </Button>

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
