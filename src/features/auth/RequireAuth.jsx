import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";
import { getHomePath } from "../../utils/authRedirect";

export default function RequireAuth({
  allowedLoginTypes = ["admin", "staff"],
  loginPath = "/login",
}) {
  const location = useLocation();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const loginType = useSessionStore((state) => state.loginType);
  const hasPermission = useSessionStore((state) => state.hasPermission);

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (!allowedLoginTypes.includes(loginType)) {
    return (
      <Navigate to={getHomePath(loginType, hasPermission)} replace />
    );
  }

  return <Outlet />;
}
