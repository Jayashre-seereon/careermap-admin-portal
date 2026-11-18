import { useSessionStore } from "../store/sessionStore";
import UnauthorizedPage from "./UnauthorizedPage";

// Route guard for pages that only administrators may open (settings,
// credentials, staff/role/permission management ...).
export default function AdminOnly({ children }) {
  const loginType = useSessionStore((state) => state.loginType);

  if (loginType !== "admin") {
    return <UnauthorizedPage />;
  }

  return children;
}
