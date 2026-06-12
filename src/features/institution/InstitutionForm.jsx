import React, { useState, useEffect } from "react";
import { Form, Input, Select, Upload, Button, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { validationRules } from "../../utils/formValidation";
import StatusSwitch from "../../components/ui/StatusSwitch";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { DATE_DISPLAY_FORMAT } from "../../utils/date";
import { getIndianStates, getDistrictsByState } from "../../utils/locationHelper";
import dayjs from "dayjs";
const { Option } = Select;

function InstitutionForm({ onSubmit, initialValues, disabled }) {
  const [countruy, setcountruy] = useState("India");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    setStates(getIndianStates());
  }, []);

  const normalizeFile = (event) => {
    if (Array.isArray(event)) return event;
    return event?.fileList || [];
  };

  const handleStateChange = (value) => {
    const selectedState = states.find((s) => s.name === value);
    if (selectedState) {
      setDistricts(getDistrictsByState(selectedState.isoCode));
    }
  };

useEffect(() => {
  if (initialValues) {
    form.setFieldsValue({
      ...initialValues,
      countruy: initialValues?.countruy ?? initialValues?.country ?? "India",

      // ✅ FIX LOGO
      logo: initialValues?.logo
        ? [
            {
              uid: "-1",
              name: "logo.png",
              status: "done",
              url: initialValues.logo,
            },
          ]
        : [],

      // ✅ FIX DATE
      tentative_date: initialValues?.tentative_date
        ? dayjs(initialValues.tentative_date, DATE_DISPLAY_FORMAT)
        : null,
    });
  }
}, [initialValues, form]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {/* HEADER */}
      <h3 className="md:col-span-2 lg:col-span-4 text-lg font-semibold text-[#9a2119]">
        Institution Details
      </h3>

      {/* ROW 1 */}
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
        <Upload
          beforeUpload={() => false}
          maxCount={1}
          disabled={disabled}
          
          
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item name="institute_type" label="Institution Type">
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item name="admission_process" label="Admission Process">
        <Input disabled={disabled} />
      </Form.Item>

      {/* ROW 2 */}
      <Form.Item name="tentative_date" label="Tentative Date">
        <DatePicker
          disabled={disabled}
          placeholder="DD-MM-YYYY"
          format={DATE_DISPLAY_FORMAT}
          className="w-full"
        />
      </Form.Item>

      <Form.Item name="url" label="URL" rules={[validationRules.url("URL")]}>
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item name="countruy" label="Country">
        <Select
          disabled={disabled}
          onChange={(val) => {
            setcountruy(val);
            form.setFieldsValue({
              countruy: val,
              state: undefined,
              district: undefined,
            });
          }}
        >
          <Option value="India">India</Option>
          <Option value="Other">Other</Option>
        </Select>
      </Form.Item>

      <Form.Item name="state" label="State">
        {countruy === "India" ? (
          <Select
            disabled={disabled}
            onChange={handleStateChange}
            showSearch
          >
            {states.map((state) => (
              <Option key={state.isoCode} value={state.name}>
                {state.name}
              </Option>
            ))}
          </Select>
        ) : (
          <Input disabled={disabled} />
        )}
      </Form.Item>

      {/* ROW 3 */}
      <Form.Item name="district" label="District">
        {countruy === "India" ? (
          <Select disabled={disabled} showSearch>
            {districts.map((d) => (
              <Option key={d.name} value={d.name}>
                {d.name}
              </Option>
            ))}
          </Select>
        ) : (
          <Input disabled={disabled} />
        )}
      </Form.Item>

      <Form.Item name="city" label="City">
        <Input disabled={disabled} />
      </Form.Item>
 <Form.Item
        name="courses_offered"
        label="Courses Offered (B.Tech, MBA)"
      >
        <Select
          mode="tags"
          disabled={disabled}
          placeholder="Type and press Enter or comma"
          tokenSeparators={[","]}
          open={false}
        />
      </Form.Item>
      <Form.Item name="is_top" label="Is Top" valuePropName="checked">
        <StatusSwitch disabled={disabled} />
      </Form.Item>

     

      {/* FULL WIDTH */}
      <Form.Item
        name="address"
        label="Address"
        className="md:col-span-2 lg:col-span-4"
      >
        <Input.TextArea rows={2} disabled={disabled} />
      </Form.Item>

      <Form.Item
        name="about"
        label="About"
        className="md:col-span-2 lg:col-span-4"
      >
        <RichTextEditor disabled={disabled} height={220} />
      </Form.Item>

      {/* SUBMIT */}
      {!disabled && (
        <div className="md:col-span-2 lg:col-span-4">
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