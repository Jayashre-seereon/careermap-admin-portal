import { useState } from "react";
import { Avatar, Button, Form, Input, Upload, message } from "antd";
import { LockOutlined, SaveOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
  changeCurrentUserPassword,
  getCurrentUser,
  updateCurrentUserProfile,
} from "../auth/authStorage";

export default function ProfilePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");

  const uploadProps = {
    accept: "image/*",
    showUploadList: false,
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result || "");
      };
      reader.readAsDataURL(file);
      return false;
    },
  };

  const handleSaveProfile = async () => {
    const values = await profileForm.validateFields();
    const nextUser = updateCurrentUserProfile({
      name: values.name,
      email: values.email,
      avatar,
    });
    setCurrentUser(nextUser);
    messageApi.success("Profile saved successfully.");
  };

  const handleChangePassword = async () => {
    const values = await passwordForm.validateFields();
    changeCurrentUserPassword(values);
    passwordForm.resetFields();
    messageApi.success("Password changed successfully.");
  };

  return (
    <div className="space-y-6">
      {contextHolder}

      <div>
        <h1 className="text-2xl font-bold text-[#9a2119]">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update your admin profile details, image, and password.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <Avatar
              size={72}
              src={avatar || undefined}
              icon={!avatar ? <UserOutlined /> : undefined}
              className="bg-[#9a2119]"
            />
            <div>
              <p className="text-lg font-semibold text-slate-800">
                {currentUser?.name || "Admin User"}
              </p>
              <p className="text-sm text-slate-500">{currentUser?.email || "admin@careermap.io"}</p>
            </div>
          </div>

          <Form
            form={profileForm}
            layout="vertical"
            initialValues={{
              name: currentUser?.name || "",
              email: currentUser?.email || "",
            }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name." }]}
            >
              <Input placeholder="Enter name" className="h-10" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email." },
                { type: "email", message: "Please enter a valid email." },
              ]}
            >
              <Input placeholder="Enter email" className="h-10" />
            </Form.Item>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">Upload Image</label>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} className="h-10">
                  Upload profile image
                </Button>
              </Upload>
            </div>

            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveProfile}
              className="h-10 border-none bg-[#9a2119] px-5 hover:!bg-[#c4392e]"
            >
              Save Profile
            </Button>
          </Form>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <LockOutlined className="text-[#9a2119]" />
            <h2 className="text-lg font-semibold text-[#9a2119]">Change Password</h2>
          </div>

          <Form form={passwordForm} layout="vertical">
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[{ required: true, message: "Please enter current password." }]}
            >
              <Input.Password placeholder="Enter current password" className="h-10" />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter new password." },
                { min: 6, message: "Use at least 6 characters." },
              ]}
            >
              <Input.Password placeholder="Enter new password" className="h-10" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm the new password." },
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
              <Input.Password placeholder="Confirm new password" className="h-10" />
            </Form.Item>

            <Button
              type="primary"
              onClick={handleChangePassword}
              className="h-10 border-none bg-[#9a2119] px-5 hover:!bg-[#c4392e]"
            >
              Save Password
            </Button>
          </Form>
        </section>
      </div>
    </div>
  );
}
