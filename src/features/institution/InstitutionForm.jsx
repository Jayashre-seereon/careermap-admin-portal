import React, { useState, useEffect } from "react";
import { Form, Input, Select, Upload, Button, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { validationRules } from "../../utils/formValidation";
import StatusSwitch from "../../components/ui/StatusSwitch";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { DATE_DISPLAY_FORMAT } from "../../utils/date";
import { getIndianStates, getDistrictsByState } from "../../utils/locationHelper";
import { getCategories } from "../../api/category";
import { getSecondaryCategoriesByCategory } from "../../api/secondaryCategory";
import { getSubCategoriesBySecondCategory } from "../../api/subcategory";

import dayjs from "dayjs";
const { Option } = Select;

function InstitutionForm({ onSubmit, initialValues, disabled }) {
  const [countruy, setcountruy] = useState("India");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [secondaryCategories, setSecondaryCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    setStates(getIndianStates());
  }, []);

  const normalizeFile = (event) => {
    if (Array.isArray(event)) return event;
    return event?.fileList || [];
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // isInit=true means this call is part of populating the form from
  // initialValues (edit/view). In that case we must NOT clear the
  // secondcategoryId/subcategoryId fields that were just set.
  const handleCategoryChange = async (categoryId, isInit = false) => {
    try {
      if (!isInit) {
        form.setFieldsValue({
          secondcategoryId: undefined,
          subcategoryId: undefined,
        });
        setSubCategories([]);
      }

      if (!categoryId) {
        setSecondaryCategories([]);
        return;
      }

      const res = await getSecondaryCategoriesByCategory(categoryId);
      setSecondaryCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSecondCategoryChange = async (secondCategoryId, isInit = false) => {
    try {
      if (!isInit) {
        form.setFieldsValue({
          subcategoryId: undefined,
        });
      }

      if (!secondCategoryId) {
        setSubCategories([]);
        return;
      }

      const res = await getSubCategoriesBySecondCategory(secondCategoryId);
      setSubCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStateChange = (value) => {
    const selectedState = states.find((s) => s.name === value);
    if (selectedState) {
      setDistricts(getDistrictsByState(selectedState.isoCode));
    }
  };

  // Populate static fields + build labelInValue-shaped objects for the
  // three cascading dropdowns so they show NAMES instead of raw ids.
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        countruy: initialValues?.countruy ?? initialValues?.country ?? "India",

        // ✅ FIX CATEGORY DROPDOWNS
        categoryId: initialValues?.categoryId
          ? { value: initialValues.categoryId, label: initialValues.categoryName }
          : undefined,
        secondcategoryId: initialValues?.secondcategoryId
          ? { value: initialValues.secondcategoryId, label: initialValues.secondCategoryName }
          : undefined,
        subcategoryId: initialValues?.subcategoryId
          ? { value: initialValues.subcategoryId, label: initialValues.subCategoryName }
          : undefined,

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

  // Load category options, then preload dependent dropdown OPTIONS
  // (not just labels) so the user can immediately reopen and change them.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

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

      {/* SECONDARY CATEGORY */}
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
        <Upload beforeUpload={() => false} maxCount={1} disabled={disabled}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item name="institute_type" label="Institution Type">
        <Input disabled={disabled} />
      </Form.Item>
{/* 
      <Form.Item name="admission_process" label="Admission Process">
        <Input disabled={disabled} />
      </Form.Item> */}

      {/* ROW 2 */}
      {/* <Form.Item name="tentative_date" label="Tentative Date">
        <DatePicker
          disabled={disabled}
          placeholder="DD-MM-YYYY"
          format={DATE_DISPLAY_FORMAT}
          className="w-full"
        />
      </Form.Item> */}

      <Form.Item name="url" label="URL" rules={[validationRules.url("URL")]}>
        <Input disabled={disabled} />
      </Form.Item>

      <Form.Item name="countruy" label="Country"  rules={[{ required: true, message: "Please select country" }]}>
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

      <Form.Item name="state" label="State"  rules={[{ required: true, message: "Please enter/select state" }]}>
        {countruy === "India" ? (
          <Select disabled={disabled} onChange={handleStateChange} showSearch>
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

   
      {/* <Form.Item name="district" label="District">
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
      </Form.Item> */}

      {/* <Form.Item name="city" label="City">
        <Input disabled={disabled} />
      </Form.Item> */}

      {/* <Form.Item name="courses_offered" label="Courses Offered (B.Tech, MBA)">
        <Select
          mode="tags"
          disabled={disabled}
          placeholder="Type and press Enter or comma"
          tokenSeparators={[","]}
          open={false}
        />
      </Form.Item> */}

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

      {/* <Form.Item
        name="about"
        label="About"
        className="md:col-span-2 lg:col-span-4"
      >
        <RichTextEditor disabled={disabled} height={220} />
      </Form.Item> */}

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