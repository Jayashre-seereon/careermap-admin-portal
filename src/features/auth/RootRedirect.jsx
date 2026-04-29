import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./authStorage";

export default function RootRedirect() {
  const user = getCurrentUser();

  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}
