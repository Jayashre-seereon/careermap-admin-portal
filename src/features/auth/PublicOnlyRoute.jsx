import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "./authStorage";

export default function PublicOnlyRoute() {
  const user = getCurrentUser();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
