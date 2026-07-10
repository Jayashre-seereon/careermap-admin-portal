import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";

export default function RequireAuth({
  allowedLoginTypes = ["admin", "staff"],
  loginPath = "/login",
}) {
  const location = useLocation();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const loginType = useSessionStore((state) => state.loginType);

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (!allowedLoginTypes.includes(loginType)) {
    return (
      <Navigate
        to={loginType === "institute" ? "/institute/dashboard" : "/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
}
