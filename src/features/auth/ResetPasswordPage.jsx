import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { getApiErrorMessage, resetPassword } from "../../api/authApi";
import { useParams, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = params.token || searchParams.get("token") || searchParams.get("resetToken") || "";
  const isAdminRoute = location.pathname.startsWith("/admin");
  const loginPath = isAdminRoute ? "/admin/login" : "/login";

  async function handleSubmit(values) {
    if (!token) {
      setStatus({
        type: "error",
        message: "Reset token is missing or invalid. Please open the link from your email again.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus(null);
      const response = await resetPassword(token, values.password);
      form.resetFields();
      navigate(loginPath, {
        replace: true,
        state: {
          passwordResetSuccess: response?.message || "Password reset successful.",
        },
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: getApiErrorMessage(error, "Failed to reset password."),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ width: "100%", padding: "4px 2px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "rgba(154,33,25,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}
        >
          <LockOutlined style={{ fontSize: 20, color: "#9a2119" }} />
        </div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
          Reset Password
        </h2>
        <p style={{ marginTop: 6, fontSize: 13, color: "#94a3b8", lineHeight: 1.5, margin: "6px 0 0" }}>
          Create a new password for your account.
        </p>
      </div>

      {/* Card */}
      <div style={{ maxWidth: 360, margin: "0 auto" }}>
        <div
         
        >
          {!token && (
            <Alert
              type="error"
              showIcon
              message="Missing reset token"
              description="Please use the link from your email or request a new one."
              style={{ borderRadius: 10, marginBottom: 16, fontSize: 13 }}
            />
          )}

          <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label={<span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>New Password</span>}
              name="password"
              style={{ marginBottom: 14 }}
              rules={[
                { required: true, message: "Please enter a new password." },
                { min: 6, message: "Password must be at least 6 characters." },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#9a2119" }} />}
                iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor="#9a2119" /> : <EyeInvisibleOutlined />)}
                size="large"
                style={{ borderRadius: 10 }}
                autoComplete="new-password"
                placeholder="Enter new password"
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>Confirm Password</span>}
              name="confirmPassword"
              style={{ marginBottom: 14 }}
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your new password." },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match."));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#9a2119" }} />}
                iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor="#9a2119" /> : <EyeInvisibleOutlined />)}
                size="large"
                style={{ borderRadius: 10 }}
                autoComplete="new-password"
                placeholder="Confirm new password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isSubmitting}
              disabled={!token}
              style={{
                borderRadius: 10,
                background: "#9a2119",
                borderColor: "#9a2119",
                fontWeight: 600,
                height: 44,
                boxShadow: "0 8px 20px rgba(154,33,25,0.25)",
              }}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </Form>

          {status && (
            <Alert
              type={status.type}
              message={status.message}
              showIcon
              style={{ borderRadius: 10, marginTop: 14, fontSize: 13 }}
            />
          )}
        </div>
      </div>

      {/* Back to login */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          type="button"
          onClick={() => navigate(loginPath, { replace: true })}
          style={{
            border: "none",
            background: "transparent",
            color: "#9a2119",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 13,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <ArrowLeftOutlined style={{ fontSize: 12 }} />
          Back to login
        </button>
      </div>

    </div>
  );
}