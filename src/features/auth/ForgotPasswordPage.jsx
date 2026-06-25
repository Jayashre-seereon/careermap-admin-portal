import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, Button, Form, Input } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { forgotPassword, getApiErrorMessage } from "../../api/authApi";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loginPath = location.pathname.startsWith("/admin") ? "/admin/login" : "/login";

  async function handleSubmit(values) {
    try {
      setIsSubmitting(true);
      setStatus(null);
      const response = await forgotPassword(values.email.trim());
      setStatus({
        type: "success",
        message: response?.message || "If the email exists, a reset link has been sent.",
      });
      form.resetFields();
    } catch (error) {
      setStatus({
        type: "error",
        message: getApiErrorMessage(error, "Failed to send password reset email."),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ width: "100%", padding: "4px 2px"  }}>

      {/* Single Card */}
      <div style={{ maxWidth: 400, margin: "0 auto",  paddingTop:"80px"}}>
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(154,33,25,0.1)",
            borderRadius: 20,
            padding: "28px 24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header inside card */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
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
              <MailOutlined style={{ fontSize: 20, color: "#9a2119" }} />
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Forgot Password?
            </h2>
            <p style={{ marginTop: 6, fontSize: 13, color: "#94a3b8", lineHeight: 1.5, margin: "6px 0 0" }}>
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label={<span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>Email Address</span>}
              name="email"
              style={{ marginBottom: 14 }}
              rules={[
                { required: true, message: "Please enter your email address." },
                { type: "email", message: "Enter a valid email address." },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#9a2119" }} />}
                size="large"
                style={{ borderRadius: 10 }}
                autoComplete="email"
                placeholder="you@example.com"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isSubmitting}
              style={{
                borderRadius: 10,
                background: "#9a2119",
                borderColor: "#9a2119",
                fontWeight: 600,
                height: 44,
                boxShadow: "0 8px 20px rgba(154,33,25,0.25)",
              }}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
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

          {/* Back to login inside card */}
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
      </div>

    </div>
  );
}