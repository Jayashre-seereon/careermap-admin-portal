import React, { useEffect } from "react";
import { Form, Select, Input, Button } from "antd";
import { validationRules } from "../../utils/formValidation";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

function SalaryForm({ onSubmit, initialValues, viewMode }) {
  const [form] = Form.useForm();

 useEffect(() => {
  if (initialValues) {
    form.resetFields(); // ✅ clears errors
    form.setFieldsValue(initialValues);
  } else {
    form.resetFields();
  }

}, [form, initialValues]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
    console.log(form.getFieldValue("subcategory"));
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
        Salary Range Details
      </h3>

      {/* Stream */}
      <Form.Item name="stream" label="Stream" rules={[{ required: true }]}>
        <Select disabled={viewMode}>
          <Option value="Science">Science</Option>
        </Select>
      </Form.Item>

      {/* Category */}
      <Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select disabled={viewMode}>
          <Option value="Medical">Medical</Option>
        </Select>
      </Form.Item>

      {/* 2nd Category */}
      <Form.Item name="secondCategory" label="2nd Category">
        <Select disabled={viewMode}>
          <Option value="GENERAL COURSES/DEGREES">
            GENERAL COURSES/DEGREES
          </Option>
        </Select>
      </Form.Item>

      {/* Sub Category */}
    <Form.Item
  name="subcategory"
  label="Sub Categories"
  rules={[{ required: true, message: "Subcategory is required" }]}
>
  <Select
    disabled={viewMode}
    allowClear
    onChange={() => form.validateFields(["subcategory"])}
  >
    <Option value="MBBS">MBBS</Option>
  </Select>
</Form.Item>

      {/* Salary */}
   <Form.List name="salaryRanges">
  {(fields, { add, remove }) => (
    <>
      <label className="md:col-span-2 font-medium">Salary Ranges</label>

      {/* ✅ ADD HERE */}
      <div className="flex gap-2 md:col-span-2 font-medium text-gray-600">
        <div style={{ width: "50%" }}>Minimum</div>
        <div style={{ width: "50%" }}>Maximum</div>
        <div style={{ width: "20px" }}></div>
      </div>

      {fields.map(({ key, name, ...restField }) => (
        <Form.Item key={key} className="md:col-span-2">
          <div className="flex gap-2">
            
            <Form.Item
              {...restField}
              name={[name, "min"]}
              rules={[{ required: true, message: "Min salary required" }]}
              noStyle
            >
              <Input placeholder="Min Salary (e.g. 3 LPA)" style={{ width: "50%" }} />
            </Form.Item>

            <Form.Item
              {...restField}
              name={[name, "max"]}
              rules={[{ required: true, message: "Max salary required" }]}
              noStyle
            >
              <Input placeholder="Max Salary (e.g. 10 LPA)" style={{ width: "50%" }} />
            </Form.Item>

            {!viewMode && (
              <MinusCircleOutlined
                onClick={() => remove(name)}
                style={{ marginTop: 8 }}
              />
            )}
          </div>
        </Form.Item>
      ))}

      {!viewMode && (
        <Form.Item className="md:col-span-2">
          <Button
            type="dashed"
            onClick={() => add()}
            block
            icon={<PlusOutlined />}
          >
            Add Salary Range
          </Button>
        </Form.Item>
      )}
    </>
  )}
</Form.List>

      {/* Submit */}
      {!viewMode && (
        <div className="md:col-span-2 text-right">
          <Button
            htmlType="submit"
            block
            style={{ background: "#9a2119", borderColor: "#9a2119" }}
            className="text-white"
          >
            Create
          </Button>
        </div>
      )}
    </Form>
  );
}

export default SalaryForm;
