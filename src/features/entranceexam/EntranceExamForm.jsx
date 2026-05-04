import { Form, Input, Select, Button, DatePicker } from "antd";
import { useEffect } from "react";
import { validationRules } from "../../utils/formValidation";

const { Option } = Select;

export default function EntranceExamForm({
  onSubmit,
  initialValues,
  viewMode,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [form, initialValues]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      validateTrigger={["onChange", "onBlur"]}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <h3 className="md:col-span-2 mb-1 text-lg font-semibold text-[#9a2119]">
        Entrance Exam Details
      </h3>

      <Form.Item name="module" label="Select Module">
        <Select disabled={viewMode}>
          <Option value="Career Library">Career Library</Option>
        </Select>
      </Form.Item>

      <Form.Item name="stream" label="Stream" rules={[validationRules.charactersOnly("Stream")]}>
        <Select disabled={viewMode} placeholder="Select Stream">
          <Option value="Science">Science</Option>
        </Select>
      </Form.Item>

      <Form.Item name="category" label="Select Category">
        <Select disabled={viewMode}>
          <Option value="Railways">Railways</Option>
        </Select>
      </Form.Item>

      <Form.Item name="secondCategory" label="2nd Category">
        <Select disabled={viewMode} placeholder="Select 2nd Category">
          <Option value="GENERAL COURSES/DEGREES">
            GENERAL COURSES/DEGREES
          </Option>
        </Select>
      </Form.Item>

      <Form.Item name="subcategory" label="Select Subcategory">
        <Select disabled={viewMode} placeholder="Select Subcategory">
          <Option value="MBBS">MBBS</Option>
        </Select>
      </Form.Item>

      <Form.Item name="exam" label="Exam Name" rules={[validationRules.required("Exam name")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      <Form.Item name="issue" label="Issue Date">
        <DatePicker className="w-full" disabled={viewMode} />
      </Form.Item>

      <Form.Item name="last" label="Last Date">
        <DatePicker className="w-full" disabled={viewMode} />
      </Form.Item>

      <Form.Item name="url" label="URL" className="md:col-span-2" rules={[validationRules.url("URL")]}>
        <Input disabled={viewMode} />
      </Form.Item>

      {!viewMode && (
        <div className="md:col-span-2">
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
