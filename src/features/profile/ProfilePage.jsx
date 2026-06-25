import { useEffect, useMemo, useState } from "react";
import { Avatar, Button, Card, Form, Input, Modal, Row, Col, message, Tag, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { changeAdminPassword } from "../../api/authApi";
import { useSessionStore } from "../../store/sessionStore";

const { Text, Title } = Typography;

const infoItems = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
 
];

export default function ProfilePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const currentUser = useSessionStore((state) => state.user);
  const [passwordForm] = Form.useForm();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const displayName = useMemo(() => {
    const firstName = currentUser?.firstName?.trim();
    const lastName = currentUser?.lastName?.trim();
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    return fullName || currentUser?.name || currentUser?.username || currentUser?.email || "Admin User";
  }, [currentUser]);

  useEffect(() => {
    if (!isPasswordModalOpen) {
      passwordForm.resetFields();
    }
  }, [isPasswordModalOpen, passwordForm]);

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      setSubmitting(true);
      const response = await changeAdminPassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      messageApi.success(response?.message || "Password changed successfully.");
      passwordForm.resetFields();
      setIsPasswordModalOpen(false);
    } catch (error) {
      if (error?.errorFields) {
        return;
      }

      messageApi.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to change password right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const profileValue = (key) => currentUser?.[key] || "-";

  return (
    <div className="space-y-6">
      {contextHolder}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Title level={3} className="!mb-1 !text-[#9a2119]">
            Profile
          </Title>
          <Text type="secondary">View your admin details and update your password.</Text>
        </div>

        <Button
          type="primary"
          icon={<LockOutlined />}
          onClick={handleOpenPasswordModal}
          className="!h-10 !rounded-xl !border-none !bg-[#9a2119] hover:!bg-[#b5261d]"
        >
          Change Password
        </Button>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-6">
        <Avatar
          size={72}
          className="bg-[#9a2119] text-xl font-semibold"
          icon={displayName ? undefined : <UserOutlined />}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Title level={4} className="!mb-0">
                {displayName}
              </Title>
              <Tag color="volcano" className="!m-0 capitalize">
                {currentUser?.role || "admin"}
              </Tag>
            </div>
            <Text type="secondary">
              Signed in as {currentUser?.username || currentUser?.email || "admin"}
            </Text>
          </div>
        </div>

        <Row gutter={[16, 16]} className="pt-6">
          {infoItems.map((item) => (
            <Col key={item.key} xs={24} sm={12}>
              <div className="rounded-2xl border border-gray-200 bg-[#faf7f5] p-4">
                <Text className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {item.label}
                </Text>
                <div className="mt-2 text-sm font-semibold text-slate-800">
                  {profileValue(item.key)}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      <Modal
        title="Change Password"
        open={isPasswordModalOpen}
        onCancel={handleClosePasswordModal}
        onOk={handleChangePassword}
        okText="Update Password"
        cancelText="Cancel"
        confirmLoading={submitting}
        centered
        destroyOnClose
      >
        <Form
          form={passwordForm}
          layout="vertical"
          className="mt-4"
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
        >
          <Form.Item
            label="Current Password"
            name="oldPassword"
            rules={[{ required: true, message: "Please enter your current password." }]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter a new password." },
              { min: 6, message: "Password must be at least 6 characters long." },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error("Passwords do not match."));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
