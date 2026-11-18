import useSubmitGuard from "../../hooks/useSubmitGuard";
import React from "react";
import { Form, Select, Checkbox, Button, Tag } from "antd";
import { validationRules } from "../../utils/formValidation";
import { navSections } from "../../components/layout/navSections";

// The module list is exactly the sidebar's modules (single source of truth).
const MODULE_OPTIONS = Array.from(
  new Set(
    navSections
      .flatMap((section) => section.items.map((item) => item.module))
      .filter(Boolean)
  )
);

function PermissionForm({ roles = [], onSubmit, initialValues, disabled }) {
  const [form] = Form.useForm();
  const selectedRoleId = Form.useWatch("roleId", form);
  const selectedRole = roles.find((role) => role.id === selectedRoleId);

  // Sidebar modules, plus any module already saved on this record that is no
  // longer in the sidebar (so old grants stay visible and can be unticked).
  const moduleOptions = React.useMemo(() => {
    const saved = Array.isArray(initialValues?.modules) ? initialValues.modules : [];
    return [...MODULE_OPTIONS, ...saved.filter((m) => !MODULE_OPTIONS.includes(m))];
  }, [initialValues]);

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

  const [guardedSubmit, submitting] = useSubmitGuard(handleFinish);
  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={guardedSubmit}
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
            {moduleOptions.map((item) => (
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
          htmlType="submit" loading={submitting}
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
