import React, { useEffect } from "react";
import { Form, Select, Input, Button } from "antd";
import { validationRules } from "../../utils/formValidation";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

function JobScopeForm({ onSubmit, initialValues, viewMode }) {
  const [form] = Form.useForm();

useEffect(() => {
  if (initialValues) {
    form.setFieldsValue({
      ...initialValues,
      names: initialValues.names || [""], // ✅ important
    });
  } else {
    form.setFieldsValue({
      names: [""],
    });
  }
}, [form, initialValues]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
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
        Job Scope Details
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
          <Option value="ALLIED & PARA MEDICAL COURSES/DEGREES">
            ALLIED & PARA MEDICAL COURSES/DEGREES
          </Option>
        </Select>
      </Form.Item>

      {/* Subcategory */}
      <Form.Item name="subcategory" label="Sub Categories">
        <Select disabled={viewMode}>
          <Option value="N/A">N/A</Option>
          <Option value="RADIOLOGY">RADIOLOGY</Option>
        </Select>
      </Form.Item>

      {/* Name */}
      <Form.List name="names">
        {(fields, { add, remove }) => (
          <>
            <label className="md:col-span-1 font-medium">Names</label>

            {fields.map(({ key, name, ...restField }) => (
              <Form.Item key={key} className="md:col-span-1">
                <div className="flex gap-1 items-center">

                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[
                      validationRules.required("Name"),
                      validationRules.charactersOnly("Name"),
                    ]}
                    noStyle
                  >
                    <Input
                      placeholder="Enter Name"
                      disabled={viewMode}
                      style={{ width: "95%" }}
                    />
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
                  Add Name
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

export default JobScopeForm;
