import { Navigate } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";

export default function RootRedirect() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}
