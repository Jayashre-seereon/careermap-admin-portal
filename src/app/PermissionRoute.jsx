import { useSessionStore } from "../store/sessionStore";
import UnauthorizedPage from "./UnauthorizedPage";

export default function PermissionRoute({
  module,
  action = "canView",
  children,
}) {
  const loginType = useSessionStore((state) => state.loginType);
  const hasPermission = useSessionStore((state) => state.hasPermission);

  if (loginType === "admin") {
    return children;
  }

  if (!hasPermission(module, action)) {
    return <UnauthorizedPage />;
  }

  return children;
}