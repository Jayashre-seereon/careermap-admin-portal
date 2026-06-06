import { Navigate, Outlet } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";

export default function PublicOnlyRoute() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
