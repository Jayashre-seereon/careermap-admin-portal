import React, { useEffect, useMemo } from "react";
import { Form, Select, Input, Button } from "antd";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

export default function CareerPathForm({
  onSubmit,
  initialValues,
  mode,
  moduleOptions = [],
  categoryOptions = [],
  secondCategoryOptions = [],
  subcategoryOptions = [],
  pathOptions = [],
}) {
  const [form] = Form.useForm();
  const isView = mode === "view";
  const careerLibraryModule = useMemo(
    () =>
      moduleOptions.find(
        (item) => item.label?.trim().toLowerCase() === "career library"
      ),
    [moduleOptions]
  );
  const selectedCategoryId = Form.useWatch("categoryId", form);
  const selectedSecondCategoryId = Form.useWatch("secondcategoryId", form);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        moduleId: initialValues.moduleId || careerLibraryModule?.id,
      });
    } else {
      form.resetFields();
      if (careerLibraryModule?.id) {
        form.setFieldsValue({ moduleId: careerLibraryModule.id });
      }
    }
  }, [careerLibraryModule?.id, form, initialValues]);

  const filteredSecondCategories = useMemo(() => {
    if (!selectedCategoryId) {
      return secondCategoryOptions;
    }

    return secondCategoryOptions.filter(
      (item) => !item.categoryId || item.categoryId === selectedCategoryId
    );
  }, [secondCategoryOptions, selectedCategoryId]);

  const filteredSubcategories = useMemo(() => {
    return subcategoryOptions.filter((item) => {
      const matchesCategory =
        !selectedCategoryId || !item.categoryId || item.categoryId === selectedCategoryId;
      const matchesSecondCategory =
        !selectedSecondCategoryId ||
        !item.secondcategoryId ||
        item.secondcategoryId === selectedSecondCategoryId;

      return matchesCategory && matchesSecondCategory;
    });
  }, [subcategoryOptions, selectedCategoryId, selectedSecondCategoryId]);

  useEffect(() => {
    const currentSecondCategoryId = form.getFieldValue("secondcategoryId");
    const hasSecondCategory = filteredSecondCategories.some(
      (item) => item.id === currentSecondCategoryId
    );

    if (currentSecondCategoryId && !hasSecondCategory) {
      form.setFieldsValue({
        secondcategoryId: undefined,
        subcategoryId: undefined,
      });
    }
  }, [filteredSecondCategories, form]);

  useEffect(() => {
    const currentSubcategoryId = form.getFieldValue("subcategoryId");
    const hasSubcategory = filteredSubcategories.some(
      (item) => item.id === currentSubcategoryId
    );

    if (currentSubcategoryId && !hasSubcategory) {
      form.setFieldsValue({
        subcategoryId: undefined,
      });
    }
  }, [filteredSubcategories, form]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
        Career Path Details
      </h3>

      <Form.Item
        name="pathName"
        label="Name"
        rules={[validationRules.required("Path name")]}
      >
        <Input disabled={isView} placeholder="Enter path name" />
      </Form.Item>

      <Form.Item
        name="moduleId"
        label="Select Module"
        rules={[validationRules.required("Module")]}
      >
        <Select disabled placeholder="Select module">
          {moduleOptions.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

     

      <Form.Item
        name="categoryId"
        label="Category"
        rules={[validationRules.required("Category")]}
      >
        <Select
          disabled={isView}
          placeholder="Select category"
          onChange={() =>
            form.setFieldsValue({
              secondcategoryId: undefined,
              subcategoryId: undefined,
            })
          }
        >
          {categoryOptions.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="secondcategoryId"
        label="2nd Category"
      >
        <Select
          disabled={isView}
          placeholder="Select 2nd category"
          onChange={() =>
            form.setFieldsValue({
              subcategoryId: undefined,
            })
          }
          allowClear
        >
          {filteredSecondCategories.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="subcategoryId"
        label="Subcategory"
      >
        <Select disabled={isView} placeholder="Select subcategory" allowClear>
          {filteredSubcategories.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="pathId"
        label="Select Path"
        rules={[validationRules.required("Path type")]}
      >
        <Select disabled={isView} placeholder="Select path type">
          {pathOptions.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="graduation" label="Graduation">
        <Input disabled={isView} />
      </Form.Item>

      <Form.Item name="aftergraduation" label="After Graduation">
        <Input disabled={isView} />
      </Form.Item>

      <Form.Item name="afterpostgraduation" label="After Post Graduation">
        <Input disabled={isView} />
      </Form.Item>

      <Form.Item name="anyother" label="Any Other">
        <Input disabled={isView} />
      </Form.Item>

      {!isView && (
        <div className="md:col-span-2 text-right">
          <Button
            htmlType="submit"
            block
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </div>
      )}
    </Form>
  );
}
