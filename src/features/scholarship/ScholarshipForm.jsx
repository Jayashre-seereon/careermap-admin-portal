import { Form, Input, Select, Button, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import RichTextEditor from "../../components/ui/RichTextEditor";
import StatusSwitch from "../../components/ui/StatusSwitch";
import { validationRules } from "../../utils/formValidation";
import { DATE_DISPLAY_FORMAT, parseDateValue } from "../../utils/date";
import { getCategories } from "../../api/category";
import { getSecondaryCategoriesByCategory } from "../../api/secondaryCategory";
import { getSubCategoriesBySecondCategory } from "../../api/subcategory";

const { Option } = Select;

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

export default function ScholarshipForm({ onSubmit, initialValues, mode }) {
  const [form] = Form.useForm();
  const isView = mode === "view";

  const [categories, setCategories] = useState([]);
  const [secondaryCategories, setSecondaryCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

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

useEffect(() => {
  if (initialValues) {
    form.setFieldsValue({
      ...initialValues,
      deadline: parseDateValue(initialValues.deadline),
      image: toUploadFileList(initialValues.image, "scholarship-image"),
      sections:
        Array.isArray(initialValues.sections) && initialValues.sections.length > 0
          ? initialValues.sections
          : [{ title: "", description: "" }], // ← fallback to 1 row even in edit mode

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
  } else {
    form.resetFields();
    form.setFieldsValue({
      is_free: false,
      sections: [{ title: "", description: "" }], // ← 1 empty row for "Add" mode
    });
  }
}, [form, initialValues]);

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
  <h3 className="md:col-span-2 lg:col-span-4 mb-1 text-lg font-semibold text-[#9a2119]">
    Scholarship Details
  </h3>

  {/* CATEGORY */}
  <Form.Item name="categoryId" label="Category">
    <Select
      labelInValue
      disabled={isView}
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
      disabled={isView}
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
    <Select labelInValue disabled={isView} placeholder="Select Sub Category">
      {subCategories.map((sub) => (
        <Option key={sub.id} value={sub.id}>
          {sub.title}
        </Option>
      ))}
    </Select>
  </Form.Item>

  <Form.Item name="type" label="Type" rules={[validationRules.required("Type")]}>
    <Select disabled={isView}>
      <Option value="Government">Government</Option>
      <Option value="Private">Private</Option>
      <Option value="State">State</Option>
    </Select>
  </Form.Item>

  <Form.Item name="name" label="Name" rules={[validationRules.required("Name")]}>
    <Input disabled={isView} />
  </Form.Item>

  <Form.Item name="url" label="URL" rules={[validationRules.url("URL")]}>
    <Input disabled={isView} />
  </Form.Item>

  <Form.Item
    name="price"
    label="Amount"
    rules={[
      {
        pattern: /^\d+(\.\d{1,2})?$/,
        message: "Please enter a valid price.",
      },
    ]}
  >
    <Input disabled={isView} />
  </Form.Item>

  <Form.Item name="deadline" label="Deadline">
    <DatePicker
      className="w-full"
      disabled={isView}
      format={DATE_DISPLAY_FORMAT}
      placeholder="DD-MM-YYYY"
    />
  </Form.Item>

  {/* <Form.Item
    name="image"
    label="Image"
    valuePropName="fileList"
    getValueFromEvent={normalizeFile}
  >
    <Upload beforeUpload={() => false} maxCount={1} disabled={isView} listType="picture">
      <Button icon={<UploadOutlined />}>Upload Image</Button>
    </Upload>
  </Form.Item> */}

  {/* FULL WIDTH FIELDS */}
  {/* <Form.Item
    name="eligibility"
    label="Eligibility"
    className="md:col-span-2 lg:col-span-4"
  >
    <Input.TextArea rows={3} disabled={isView} />
  </Form.Item> */}

  <Form.Item
    name="requirement"
    label="Requirement"
    className="md:col-span-2 lg:col-span-4"
  >
    <Input.TextArea rows={3} disabled={isView} />
  </Form.Item>
{/* SECTIONS (repeatable title + description) */}
<div className="md:col-span-2 lg:col-span-4">
  <label className="block mb-2 font-medium">Sections</label>

<Form.List name="sections">
  {(fields, { add, remove }) => (
    <div className="space-y-4">
      {fields.map(({ key, name, ...restField }) => (
        <div
          key={key}
          className="border border-gray-200 rounded-md p-3 relative space-y-3"
        >
          <Form.Item
            {...restField}
            name={[name, "title"]}
            label="Title"
            rules={[validationRules.required("Title")]}
          >
            <Input disabled={isView} placeholder="e.g. Eligibility" />
          </Form.Item>

          <Form.Item
            {...restField}
            name={[name, "description"]}
            label="Description"
          >
            <RichTextEditor disabled={isView} />
          </Form.Item>

          {!isView && (
            <Button danger type="link" onClick={() => remove(name)}>
              Remove Section
            </Button>
          )}
        </div>
      ))}

      {!isView && (
        <Button type="dashed" onClick={() => add()} block>
          + Add Section
        </Button>
      )}
    </div>
  )}
</Form.List>
</div>

  {/* <Form.Item
    name="description"
    label="Description"
    className="md:col-span-2 lg:col-span-4"
  >
    <RichTextEditor disabled={isView} height={220} />
  </Form.Item> */}

  {!isView && (
    <Button
      htmlType="submit"
      className="md:col-span-2 lg:col-span-4 bg-[#9a2119] text-white"
    >
      {mode === "edit" ? "Update" : "Submit"}
    </Button>
  )}
</Form>
  );
}