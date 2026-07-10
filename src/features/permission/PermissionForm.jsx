import React from "react";
import { Form, Select, Checkbox, Button, Tag } from "antd";
import { validationRules } from "../../utils/formValidation";

const MODULE_OPTIONS = [
  "Dashboard",
  "Modules",
  "Permissions",
  "Staff",
  "Roles",
  "Mentors",
  "Path Type",
  "Career Path",
  "Entrance Exam",
  "Institution",
  "Scholarship",
  "Master Class",
  "Study Abroad",
  "PlansQuiz",
  "Stream",
  "Categories",
  "Second Categories",
  "Subcategories",
  "Details",
  "All Users",
  "Notifications",
  "Subscribers",
  "Bookings",
  "Transactions",
  "Login Activities",
  "Support Tickets",
  "Counseling",
  "Personality",
  "Test",
  "Domains",
  "Careers",
  "Career Paths",
  "Career Categories",
  "Institutes",
  "Questions",
  "Sections",
  "Students",
];

function PermissionForm({ roles = [], onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();
  const selectedRoleId = Form.useWatch("roleId", form);
  const selectedRole = roles.find((role) => role.id === selectedRoleId);

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = async (values) => {
    try {
      await onSubmit(values);
      form.resetFields();
    } catch (err) {
      // keep values so the user can retry
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      validateTrigger={["onChange", "onBlur"]}
      initialValues={{ modules: [] }}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <h3 className="mb-1 text-lg font-semibold text-[#9a2119] md:col-span-2">
          Permission Details
        </h3>

        <Form.Item
          name="roleId"
          label="Role"
          rules={[validationRules.required("Role")]}
        >
          <Select
            placeholder="Select role"
            disabled={disabled}
            options={roles.map((role) => ({ label: role.name, value: role.id }))}
          />
        </Form.Item>

        <Form.Item
          name="modules"
          label="Modules"
          className="md:col-span-2"
          rules={[
            {
              validator: (_, value) =>
                value && value.length > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Please select at least one module")),
            },
          ]}
        >
          <Checkbox.Group
            disabled={disabled}
            className="grid max-h-96 grid-cols-2 gap-2 overflow-y-auto rounded-lg border p-4 sm:grid-cols-3"
          >
            {MODULE_OPTIONS.map((item) => (
              <Checkbox key={item} value={item}>
                {item}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

       
      </div>

      {!disabled && (
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ background: "#9a2119", borderColor: "#9a2119" }}
        >
          Submit
        </Button>
      )}
    </Form>
  );
}

export default PermissionForm;
