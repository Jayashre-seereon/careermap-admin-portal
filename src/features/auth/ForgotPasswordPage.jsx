import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { Mail, LockKeyhole, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import {
  requestPasswordResetCode,
  resetPasswordWithCode,
  verifyPasswordResetCode,
} from "./authStorage";

const inputClassName =
  "h-12 w-full rounded-xl border border-[#eadfda] bg-[#fbf9f8] px-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#9a2119] focus:bg-white focus:ring-4 focus:ring-[#9a2119]/10";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [sentCode, setSentCode] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendCode = (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = requestPasswordResetCode(form.email);
      setSentCode(response.code);
      setStep(2);
      messageApi.success(`Verification code sent to ${response.email}. Demo code: ${response.code}`);
    } catch (error) {
      messageApi.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      verifyPasswordResetCode({ email: form.email, code: form.code });
      setStep(3);
      messageApi.success("Verification code confirmed.");
    } catch (error) {
      messageApi.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      messageApi.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      resetPasswordWithCode({
        email: form.email,
        code: form.code,
        password: form.password,
      });
      messageApi.success("Password reset successfully.");
      navigate("/login", { replace: true });
    } catch (error) {
      messageApi.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {contextHolder}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-[2.2rem]">Forgot password?</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          We&apos;ll send a verification code to your email, confirm it, then let you create a new password.
        </p>
      </div>

      <div className="mb-5 flex items-center gap-2 rounded-2xl border border-[#f1dfdb] bg-white/80 p-2 shadow-sm">
        {[
          { id: 1, label: "Email", icon: Mail },
          { id: 2, label: "Verify", icon: ShieldCheck },
          { id: 3, label: "Reset", icon: KeyRound },
        ].map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              step === id
                ? "bg-[#9a2119] text-white"
                : "text-slate-500"
            }`}
          >
            <Icon size={15} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <form
          onSubmit={handleSendCode}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-slate-500">Email Address</label>
            <div className="relative">
              <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a2119]" />
              <input
                type="email"
                className={inputClassName}
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#f3e0dc] bg-[#fff7f5] px-4 py-3 text-sm text-slate-600">
            A 6-digit verification code will be generated and shown here like an email delivery preview.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#9a2119] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(154,33,25,0.28)] transition hover:bg-[#b5261d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Sending code..." : "Send Verification Code"}
            <ArrowRight size={16} />
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={handleVerifyCode}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-[#f3e0dc] bg-[#fff7f5] px-4 py-3 text-sm text-slate-600">
            Verification code sent to <span className="font-semibold text-[#9a2119]">{form.email}</span>
            {sentCode ? (
              <span className="mt-1 block font-semibold text-[#9a2119]">Demo email code: {sentCode}</span>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-slate-500">Verification Code</label>
            <div className="relative">
              <ShieldCheck size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a2119]" />
              <input
                type="text"
                className={inputClassName}
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex h-12 flex-1 items-center justify-center rounded-xl border border-[#e7c9c3] text-sm font-semibold text-[#9a2119] transition hover:bg-[#fff7f5]"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#9a2119] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(154,33,25,0.28)] transition hover:bg-[#b5261d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify Code"}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={handleResetPassword}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-[#f3e0dc] bg-[#fff7f5] px-4 py-3 text-sm text-slate-600">
            Code verified for <span className="font-semibold text-[#9a2119]">{form.email}</span>. Create your new password below.
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-slate-500">New Password</label>
            <div className="relative">
              <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a2119]" />
              <input
                type="password"
                className={inputClassName}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-slate-500">Confirm Password</label>
            <div className="relative">
              <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a2119]" />
              <input
                type="password"
                className={inputClassName}
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex h-12 flex-1 items-center justify-center rounded-xl border border-[#e7c9c3] text-sm font-semibold text-[#9a2119] transition hover:bg-[#fff7f5]"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#9a2119] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(154,33,25,0.28)] transition hover:bg-[#b5261d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Updating password..." : "Reset Password"}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Remembered your password?{" "}
        <Link to="/login" className="font-semibold text-[#9a2119] hover:text-[#b5261d]">
          Back to login
        </Link>
      </p>
    </div>
  );
}
