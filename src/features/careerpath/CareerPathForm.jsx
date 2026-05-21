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
  const selectedCategoryId = Form.useWatch("categoryId", form);
  const selectedSecondCategoryId = Form.useWatch("secondcategoryId", form);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

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
        name="moduleId"
        label="Select Module"
        rules={[validationRules.required("Module")]}
      >
        <Select disabled={isView} placeholder="Select module">
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
        <Select disabled={isView} placeholder="Select category">
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
        rules={[validationRules.required("2nd category")]}
      >
        <Select disabled={isView} placeholder="Select 2nd category">
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
        rules={[validationRules.required("Subcategory")]}
      >
        <Select disabled={isView} placeholder="Select subcategory">
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
