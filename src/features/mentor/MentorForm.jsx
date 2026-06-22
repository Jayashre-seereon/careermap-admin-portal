import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button, DatePicker, Form, Input, TimePicker, Upload,Select } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import RichTextEditor from "../../components/ui/RichTextEditor";
import StatusSwitch from "../../components/ui/StatusSwitch";
import { getCategories } from "../../api/category";
import { getSecondaryCategoriesByCategory } from "../../api/secondaryCategory";
import { getSubCategoriesBySecondCategory } from "../../api/subcategory";
const { Option } = Select;
import {
  getValueFromInput,
  inputSanitizers,
  validationRules,
} from "../../utils/formValidation";
import { DATE_DISPLAY_FORMAT, parseDateValue } from "../../utils/date";

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

const toDateValue = (value) => {
  return parseDateValue(value);
};

const toTimeValue = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value?.format === "function") {
    return value;
  }

  const rawValue = String(value).trim();
  if (!rawValue) {
    return null;
  }

  const normalizedValue = rawValue.length === 5 ? `${rawValue}:00` : rawValue;
  const parsed = dayjs(`1970-01-01T${normalizedValue}`);
  return parsed.isValid() ? parsed : null;
};

const normalizeTimeRangeValue = (value) => {
  if (!value) {
    return [null, null];
  }

  if (Array.isArray(value)) {
    return [toTimeValue(value[0]), toTimeValue(value[1])];
  }

  if (typeof value === "string") {
    const text = value.trim();
    if (!text) {
      return [null, null];
    }

    const [start = "", end = ""] = text.split("-").map((part) => part.trim());
    if (start || end) {
      return [toTimeValue(start), toTimeValue(end)];
    }

    return [toTimeValue(text), null];
  }

  if (typeof value?.format === "function") {
    return [value, null];
  }

  return [null, null];
};

const formatTimeValue = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    const text = value.trim();
    if (!text) {
      return "";
    }

    if (/^\d{2}:\d{2}(:\d{2})?$/.test(text)) {
      return text.slice(0, 5);
    }

    return text;
  }

  if (typeof value?.format === "function") {
    return value.format("HH:mm");
  }

  return "";
};

const formatTimeRangeValue = (value) => {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    const [start, end] = value;
    const startText = formatTimeValue(start);
    const endText = formatTimeValue(end);

    if (startText && endText) {
      return `${startText}-${endText}`;
    }

    return startText || endText || "";
  }

  if (typeof value === "string") {
    const text = value.trim();
    if (!text) {
      return "";
    }

    const [start = "", end = ""] = text.split("-").map((part) => part.trim());
    if (start && end) {
      return `${formatTimeValue(start)}-${formatTimeValue(end)}`;
    }

    return formatTimeValue(text);
  }

  if (typeof value?.format === "function") {
    return value.format("HH:mm");
  }

  return "";
};

const normalizeAvailability = (availability = []) => {
  if (!Array.isArray(availability) || availability.length === 0) {
    return [{ date: null, timeSlots: [[null, null]] }];
  }

  const normalized = availability
    .map((entry) => {
      const timeSlots = Array.isArray(entry?.timeSlots) && entry.timeSlots.length > 0
        ? entry.timeSlots.map(normalizeTimeRangeValue)
        : [[null, null]];

      return {
        date: toDateValue(entry?.date),
        timeSlots,
      };
    })
    .filter((entry) => entry.date || entry.timeSlots.some((slot) => slot?.some(Boolean)));

  return normalized.length > 0 ? normalized : [{ date: null, timeSlots: [[null, null]] }];
};

function MentorForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();
  const [count, setCount] = useState(0);
  const [categories, setCategories] = useState([]);
const [secondaryCategories, setSecondaryCategories] = useState([]);
const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        status: true,
        ...initialValues,
        dateof_birth: toDateValue(initialValues.dateof_birth),
        availability: normalizeAvailability(initialValues.availability),
        image: toUploadFileList(initialValues.image, "mentor-image"),
        resume: toUploadFileList(initialValues.resume, "mentor-resume"),
        categoryId: initialValues?.categoryId
  ? { value: initialValues.categoryId, label: initialValues.categoryName }
  : undefined,

secondcategoryId: initialValues?.secondcategoryId
  ? { value: initialValues.secondcategoryId, label: initialValues.secondCategoryName }
  : undefined,

subcategoryId: initialValues?.subcategoryId
  ? { value: initialValues.subcategoryId, label: initialValues.subCategoryName }
  : undefined,
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      status: true,
      availability: [{ date: null, timeSlots: [[null, null]] }],
    });
  }, [form, initialValues]);
useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  const res = await getCategories();
  setCategories(res.data || []);
};
const handleCategoryChange = async (categoryId, isInit = false) => {
  if (!isInit) {
    form.setFieldsValue({
      secondcategoryId: undefined,
      subcategoryId: undefined,
    });
    setSubCategories([]);
  }

  if (!categoryId) return;

  const res = await getSecondaryCategoriesByCategory(categoryId);
  setSecondaryCategories(res.data || []);
};

const handleSecondCategoryChange = async (secondCategoryId, isInit = false) => {
  if (!isInit) {
    form.setFieldsValue({ subcategoryId: undefined });
  }

  if (!secondCategoryId) return;

  const res = await getSubCategoriesBySecondCategory(secondCategoryId);
  setSubCategories(res.data || []);
};
useEffect(() => {
  const init = async () => {
    await fetchCategories();

    if (initialValues?.categoryId) {
      await handleCategoryChange(initialValues.categoryId, true);
    }

    if (initialValues?.secondcategoryId) {
      await handleSecondCategoryChange(initialValues.secondcategoryId, true);
    }
  };

  init();
}, [initialValues]);
  const renderAvailabilityTimeSlots = (timeFields, addTimeSlot, removeTimeSlot) => (
    <>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">Time Ranges</span>
        {!disabled && (
          <Button
            type="dashed"
            size="small"
            onClick={() => addTimeSlot([null, null])}
            icon={<PlusOutlined />}
          >
            Add Time Range
          </Button>
        )}
      </div>

      {timeFields.map(({ key, name, ...restField }) => (
        <div key={key} className="mb-2 flex items-start gap-2">
          <Form.Item
            {...restField}
            name={name}
            className="mb-0 flex-1"
            rules={[
              {
                validator: (_, value) => {
                  const [start, end] = Array.isArray(value) ? value : [];

                  if (start && end) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error("Time range is required"));
                },
              },
            ]}
          >
            <TimePicker.RangePicker
              className="w-full"
              popupClassName="mentor-time-picker-popup"
              disabled={disabled}
              format="HH:mm"
              use12Hours={false}
              showSecond={false}
              showNow={false}
              inputReadOnly
              placeholder={["Start time", "End time"]}
            />
          </Form.Item>

          {!disabled && timeFields.length > 1 && (
            <Button
              danger
              type="text"
              className="mt-1"
              icon={<MinusCircleOutlined />}
              onClick={() => removeTimeSlot(name)}
            />
          )}
        </div>
      ))}

      {!disabled && timeFields.length === 0 && (
        <Button type="dashed" block onClick={() => addTimeSlot([null, null])} icon={<PlusOutlined />}>
          Add Time Range
        </Button>
      )}
    </>
  );

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      initialValues={{ status: true, availability: [{ date: null, timeSlots: [[null, null]] }] }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <h3 className="md:col-span-2 lg:col-span-4 mb-1 text-lg font-semibold text-[#9a2119]">
          Mentor Details
        </h3>
          {/* CATEGORY */}
<Form.Item name="categoryId" label="Category">
  <Select
    labelInValue
    disabled={disabled}
    placeholder="Select Category"
    onChange={(val) => handleCategoryChange(val?.value)}
  >
    {categories.map((cat) => (
      <Option key={cat.id} value={cat.id}>
        {cat.title}
      </Option>
    ))}
  </Select>
</Form.Item>

{/* SECOND CATEGORY */}
<Form.Item name="secondcategoryId" label="Secondary Category">
  <Select
    labelInValue
    disabled={disabled}
    placeholder="Select Secondary Category"
    onChange={(val) => handleSecondCategoryChange(val?.value)}
  >
    {secondaryCategories.map((sec) => (
      <Option key={sec.id} value={sec.id}>
        {sec.name}
      </Option>
    ))}
  </Select>
</Form.Item>

{/* SUB CATEGORY */}
<Form.Item name="subcategoryId" label="Sub Category">
  <Select
    labelInValue
    disabled={disabled}
    placeholder="Select Sub Category"
  >
    {subCategories.map((sub) => (
      <Option key={sub.id} value={sub.id}>
        {sub.title}
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
          <DatePicker
            className="w-full"
            disabled={disabled}
            format={DATE_DISPLAY_FORMAT}
            placeholder="DD-MM-YYYY"
          />
        </Form.Item>

        <Form.Item
          name="designation"
          label="Current Designation"
          rules={[validationRules.required("Current Designation")]}
        >
          <Input disabled={disabled} placeholder="Enter current designation" />
        </Form.Item>

        <Form.Item
          name="education"
          label="Education"
          rules={[validationRules.required("Education")]}
        >
          <Input disabled={disabled} placeholder="Enter education field" />
        </Form.Item>

        <Form.Item name="placeof_word" label="Current Organisation ">
          <Input disabled={disabled} placeholder="Enter current organisation" />
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

        <Form.Item
          name="skill"
          label="Areas of Expertise 
"
          className="md:col-span-2"
        >
          <Input.TextArea
            rows={4}
            disabled={disabled}
            placeholder="Enter Areas of Expertise 
 separated by commas"
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
          label="AIR / STATE RANK
"
          rules={[validationRules.decimal("AIR/State Rank")]}
        >
          <Input disabled={disabled} placeholder="Enter AIR/State Rank" />
        </Form.Item>
        <Form.Item
          name="year"
          label="Year"
          rules={[validationRules.numbersOnly("Year")]}
        >
          <Input disabled={disabled} placeholder="Enter year" />
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
          label={`Description (${count}/200 words)`}
          help={count > 200 ? "Max 200 words allowed" : ""}
          validateStatus={count > 200 ? "error" : ""}
          className="md:col-span-2 lg:col-span-4"
        >
          <RichTextEditor
            onChange={(value) => {
              const text = value?.replace(/<[^>]+>/g, "") || "";
              const words = text.trim().split(/\s+/).filter(Boolean);
              setCount(words.length);
            }}
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

        <div className="md:col-span-2 lg:col-span-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="mb-4">
            <h4 className="text-base font-semibold text-[#9a2119]">Availability</h4>
            <p className="text-sm text-slate-500">
              Add one or more dates, and assign multiple time slots to each date.
            </p>
          </div>

          <Form.List name="availability">
            {(dateFields, { add: addDate, remove: removeDate }) => (
              <>
                {dateFields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    className="mb-4 rounded-xl border bg-white p-4 last:mb-0"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr_auto] md:items-start">
                      <Form.Item
                        {...restField}
                        name={[name, "date"]}
                        label="Available Date"
                        rules={[validationRules.required("Available date")]}
                        className="mb-0"
                      >
                        <DatePicker
                          className="w-full"
                          disabled={disabled}
                          format={DATE_DISPLAY_FORMAT}
                          placeholder="DD-MM-YYYY"
                        />
                      </Form.Item>

                      <Form.List name={[name, "timeSlots"]}>
                        {(timeFields, { add: addTimeSlot, remove: removeTimeSlot }) => (
                          <div>
                            {renderAvailabilityTimeSlots(timeFields, addTimeSlot, removeTimeSlot)}
                          </div>
                        )}
                      </Form.List>

                      {!disabled && dateFields.length > 1 && (
                        <Button
                          danger
                          type="text"
                          className="mt-8 justify-self-start md:mt-10"
                          icon={<MinusCircleOutlined />}
                          onClick={() => removeDate(name)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {!disabled && (
                  <Button
                    type="dashed"
                    block
                    onClick={() => addDate({ date: null, timeSlots: [[null, null]] })}
                    icon={<PlusOutlined />}
                  >
                    Add Availability Date
                  </Button>
                )}
              </>
            )}
          </Form.List>
        </div>
      </div>

      {!disabled && (
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
          className="mt-4"
        >
          Submit
        </Button>
      )}
    </Form>
  );
}

export default MentorForm;
