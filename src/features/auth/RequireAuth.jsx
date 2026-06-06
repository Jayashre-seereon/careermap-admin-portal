import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";

export default function RequireAuth() {
  const location = useLocation();
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
