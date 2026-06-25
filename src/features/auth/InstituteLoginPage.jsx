import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { instituteLogin } from "../../api/authApi";
import { useSessionStore } from "../../store/sessionStore";

const inputClassName =
  "h-12 w-full rounded-xl border border-[#eadfda] bg-[#fbf9f8] px-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#9a2119] focus:bg-white focus:ring-4 focus:ring-[#9a2119]/10";

const getTokenValue = (data, keys) => {
  for (const key of keys) {
    if (data?.[key]) {
      return data[key];
    }
  }

  return "";
};

export default function InstituteLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const setSession = useSessionStore((state) => state.setSession);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const redirectTo = location.state?.from?.pathname || "/institute/dashboard";

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await instituteLogin(form.email, form.password);
      const payload = response?.data || response || {};
      const accessToken = getTokenValue(payload, ["accessToken", "access_token", "token", "jwt"]);
      const institute = payload.institute || payload.data || null;

      if (!accessToken) {
        throw new Error("Access token not found in login response.");
      }

      setSession({
        accessToken,
        refreshToken: "",
        user: institute
          ? {
              name: institute.name || "Institute",
              email: institute.email || form.email,
              instituteId: institute.id,
            }
          : { name: form.email, email: form.email },
        loginType: "institute",
      });

      messageApi.success("Institute login successful.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      messageApi.error(error.response?.data?.message || error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePortalChange = (value) => {
    if (value !== "institute") {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div>
      {contextHolder}

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-[2.2rem]">Institute Login</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Sign in to view your institute dashboard and student quota.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-slate-500">Password</label>
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
          {loading ? "Logging in..." : "Login"}
          <ArrowRight size={16} />
        </button>

        <div className="mb-2 flex flex-wrap items-center justify-center gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              type="radio"
              name="loginAs"
              checked={false}
              onChange={() => handlePortalChange("admin")}
              className="accent-[#9a2119]"
            />
            Admin
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              type="radio"
              name="loginAs"
              checked={false}
              onChange={() => handlePortalChange("staff")}
              className="accent-[#9a2119]"
            />
            Staff
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              type="radio"
              name="loginAs"
              checked
              readOnly
              className="accent-[#9a2119]"
            />
            Institute
          </label>
        </div>

        <div className="text-center text-xs text-slate-400">
          Need admin access?{" "}
          <Link to="/login" className="font-semibold text-[#9a2119] hover:text-[#b5261d]">
            Back to admin login
          </Link>
        </div>
      </form>
    </div>
  );
}
