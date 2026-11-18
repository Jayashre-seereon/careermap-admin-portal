import { Navigate } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";
import { getHomePath } from "../../utils/authRedirect";

export default function RootRedirect() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const loginType = useSessionStore((state) => state.loginType);
  const hasPermission = useSessionStore((state) => state.hasPermission);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getHomePath(loginType, hasPermission)} replace />;
}
