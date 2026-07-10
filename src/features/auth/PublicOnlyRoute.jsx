import { Navigate, Outlet } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";

export default function PublicOnlyRoute() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const loginType = useSessionStore((state) => state.loginType);

  if (isAuthenticated) {
    return (
      <Navigate
        to={loginType === "institute" ? "/institute/dashboard" : "/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
}
