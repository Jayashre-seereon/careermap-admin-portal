import React, { useEffect } from "react";
import { Form, Input, Select, Upload, Button, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { validationRules } from "../../utils/formValidation";
import StatusSwitch from "../../components/ui/StatusSwitch";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { DATE_DISPLAY_FORMAT, parseDateValue } from "../../utils/date";
const { Option } = Select;

function InstitutionForm({ onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();

  const normalizeFile = (event) => {
    if (Array.isArray(event)) {
      return event;
    }

    return event?.fileList || [];
  };

 useEffect(() => {
  if (initialValues) {
    form.setFieldsValue({
      ...initialValues,
      logo: [],
      courses_offered: Array.isArray(initialValues.courses_offered)
        ? initialValues.courses_offered
        : [],
      tentative_date: parseDateValue(initialValues.tentative_date),
    });
  } else {
    form.resetFields();
  }
}, [form, initialValues]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <h3 className="md:col-span-2 lg:col-span-3 mb-1 text-lg font-semibold text-[#9a2119]">
        Institution Details
      </h3>

      <Form.Item
        name="name"
        label="Institution Name"
        rules={[validationRules.required("Institution name")]}
      >
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item
        name="logo"
        label="Logo"
        valuePropName="fileList"
        getValueFromEvent={normalizeFile}
      >
        <Upload beforeUpload={() => false} maxCount={1} disabled={disabled}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      {initialValues?.logo && typeof initialValues.logo === "string" ? (
        <div className="mb-4">
          <img
            src={initialValues.logo}
            alt={initialValues.name}
            className="h-20 w-20 rounded-lg border object-cover"
          />
        </div>
      ) : null}

      <Form.Item name="institute_type" label="Institution Type">
        <Input disabled={disabled}/>
          
        
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        className="md:col-span-2 lg:col-span-3"
      >
        <Input.TextArea rows={2} disabled={disabled} />
      </Form.Item>

      <Form.Item name="admission_process" label="Admission Process">
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item
        name="about"
        label="About"
        className="md:col-span-2 lg:col-span-3"
      >
        <RichTextEditor disabled={disabled} height={220} />
      </Form.Item>

      <Form.Item
        name="courses_offered"
        label="Courses Offered"
        className="md:col-span-2 lg:col-span-3"
      >
        <Select
          mode="tags"
          disabled={disabled}
          placeholder="Add courses offered"
          tokenSeparators={[","]}
          open={false}
        />
      </Form.Item>

      <Form.Item name="tentative_date" label="Tentative Date">
        <DatePicker
          disabled={disabled}
          placeholder="DD-MM-YYYY"
          format={DATE_DISPLAY_FORMAT}
        />
      </Form.Item>

      <Form.Item name="url" label="URL" rules={[validationRules.url("URL")]}>
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item
        name="country"
        label="Country"
        rules={[validationRules.charactersOnly("Country")]}
      >
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item
        name="state"
        label="State"
        rules={[validationRules.charactersOnly("State")]}
      >
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item
        name="city"
        label="City"
        rules={[validationRules.charactersOnly("City")]}
      >
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item
        name="district"
        label="District"
        rules={[validationRules.charactersOnly("District")]}
      >
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item name="is_top" label="Is Top" valuePropName="checked">
        <StatusSwitch disabled={disabled} checkedChildren="Yes" unCheckedChildren="No" />
      </Form.Item>

      {!disabled && (
        <div className="md:col-span-2 lg:col-span-3">
          <Button
            htmlType="submit"
            block
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            Submit
          </Button>
        </div>
      )}
    </Form>
  );
}

export default InstitutionForm;
