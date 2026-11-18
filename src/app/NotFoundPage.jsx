import { Link } from "react-router-dom";
import { useSessionStore } from "../store/sessionStore";

export default function NotFoundPage() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const loginType = useSessionStore((state) => state.loginType);

  const home = !isAuthenticated
    ? "/login"
    : loginType === "institute"
      ? "/institute/dashboard"
      : "/dashboard";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-semibold text-slate-900">404</p>
        <p className="mt-3 text-base text-slate-500">
          The page you are looking for does not exist.
        </p>
        <Link
          to={home}
          className="mt-6 inline-block rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "#9A2119" }}
        >
          {isAuthenticated ? "Back to dashboard" : "Back to login"}
        </Link>
      </div>
    </div>
  );
}
