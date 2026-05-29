import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, TimePicker, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import RichTextEditor from "../../components/ui/RichTextEditor";
import StatusSwitch from "../../components/ui/StatusSwitch";
import {
  getValueFromInput,
  inputSanitizers,
  validationRules,
} from "../../utils/formValidation";

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
  if (!value) {
    return null;
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
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

const normalizeAvailability = (availability = []) => {
  if (!Array.isArray(availability) || availability.length === 0) {
    return [{ date: null, timeSlots: [null] }];
  }

  const normalized = availability
    .map((entry) => {
      const timeSlots = Array.isArray(entry?.timeSlots) && entry.timeSlots.length > 0
        ? entry.timeSlots.map(toTimeValue).filter(Boolean)
        : [null];

      return {
        date: toDateValue(entry?.date),
        timeSlots,
      };
    })
    .filter((entry) => entry.date || entry.timeSlots.some(Boolean));

  return normalized.length > 0 ? normalized : [{ date: null, timeSlots: [null] }];
};

function MentorForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        status: true,
        ...initialValues,
        dateof_birth: toDateValue(initialValues.dateof_birth),
        availability: normalizeAvailability(initialValues.availability),
        image: toUploadFileList(initialValues.image, "mentor-image"),
        resume: toUploadFileList(initialValues.resume, "mentor-resume"),
      });
      return;
    }

    form.resetFields();
    form.setFieldsValue({
      status: true,
      availability: [{ date: null, timeSlots: [null] }],
    });
  }, [form, initialValues]);

  const renderAvailabilityTimeSlots = (timeFields, addTimeSlot, removeTimeSlot) => (
    <>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">Time Slots</span>
        {!disabled && (
          <Button
            type="dashed"
            size="small"
            onClick={() => addTimeSlot(null)}
            icon={<PlusOutlined />}
          >
            Add Time
          </Button>
        )}
      </div>

      {timeFields.map(({ key, name, ...restField }) => (
        <div key={key} className="mb-2 flex items-start gap-2">
          <Form.Item
            {...restField}
            name={name}
            className="mb-0 flex-1"
            rules={[validationRules.required("Time slot")]}
          >
            <TimePicker
              className="w-full"
              popupClassName="mentor-time-picker-popup"
              disabled={disabled}
              format="HH:mm"
              use12Hours={false}
              needConfirm
              showSecond={false}
              showNow={false}
              inputReadOnly
              placeholder="Select time"
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
        <Button type="dashed" block onClick={() => addTimeSlot(null)} icon={<PlusOutlined />}>
          Add Time
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
      initialValues={{ status: true, availability: [{ date: null, timeSlots: [null] }] }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <h3 className="md:col-span-2 lg:col-span-4 mb-1 text-lg font-semibold text-[#9a2119]">
          Mentor Details
        </h3>

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
          <DatePicker className="w-full" disabled={disabled} />
        </Form.Item>

        <Form.Item
          name="designation"
          label="Designation"
          rules={[validationRules.required("Designation")]}
        >
          <Input disabled={disabled} placeholder="Enter designation" />
        </Form.Item>

        <Form.Item
          name="education"
          label="Education"
          rules={[validationRules.required("Education")]}
        >
          <Input disabled={disabled} placeholder="Enter education field" />
        </Form.Item>

        <Form.Item name="placeof_word" label="Place of Work">
          <Input disabled={disabled} placeholder="Enter place of work" />
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
          label="My Skills"
          className="md:col-span-2"
        >
          <Input.TextArea
            rows={4}
            disabled={disabled}
            placeholder="Enter skills separated by commas"
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
          label="Rank"
          rules={[validationRules.decimal("Rank")]}
        >
          <Input disabled={disabled} placeholder="Enter rank" />
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
          label="Description"
          className="md:col-span-2 lg:col-span-3"
        >
          <RichTextEditor
            disabled={disabled}
            placeholder="Enter mentor description"
            height={180}
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
                        <DatePicker className="w-full" disabled={disabled} />
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
                    onClick={() => addDate({ date: null, timeSlots: [null] })}
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
