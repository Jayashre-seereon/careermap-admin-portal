import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { loginUser } from "./authStorage";

const inputClassName =
  "h-12 w-full rounded-xl border border-[#eadfda] bg-[#fbf9f8] px-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#9a2119] focus:bg-white focus:ring-4 focus:ring-[#9a2119]/10";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const [form, setForm] = useState({
    email: "admin@careermap.io",
    password: "Admin@123",
  });
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      loginUser(form);
      messageApi.success("Login successful.");
      navigate(redirectTo, { replace: true });
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
        <h2 className="text-3xl text- font-bold text-slate-900 sm:text-[2.2rem]">Sign in</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Enter your details to access your account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
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
              placeholder="admin@careermap.io"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-slate-500">Password</label>
            <Link to="/forgot-password" className="text-[13px] font-semibold text-[#9a2119] hover:text-[#b5261d]">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a2119]" />
            <input
              type="password"
              className={inputClassName}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#9a2119] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(154,33,25,0.28)] transition hover:bg-[#b5261d] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign in"}
          <ArrowRight size={16} />
        </button>

        <div className="pt-1 text-center text-xs text-slate-500">
          Demo login:
          <span className="ml-1 font-semibold text-[#9a2119]">admin@careermap.io / Admin@123</span>
        </div>
      </form>

     
    </div>
  );
}
