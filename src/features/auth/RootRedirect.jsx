import { Navigate } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";

export default function RootRedirect() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const loginType = useSessionStore((state) => state.loginType);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={loginType === "institute" ? "/institute/dashboard" : "/dashboard"} replace />;
}
