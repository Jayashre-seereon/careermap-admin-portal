import { navSections } from "../components/layout/navSections";

const flatNavItems = navSections.flatMap((section) => section.items || []);

// Default landing page for a signed-in user.
//  - institute: institute dashboard
//  - admin: dashboard
//  - staff: Dashboard if permitted, otherwise the first module the staff may view
export const getHomePath = (loginType, hasPermission) => {
  if (loginType === "institute") return "/institute/dashboard";
  if (loginType !== "staff") return "/dashboard";
  const can = (module) => (typeof hasPermission === "function" ? hasPermission(module, "canView") : true);
  if (can("Dashboard")) return "/dashboard";
  const first = flatNavItems.find((item) => !item.adminOnly && item.path && can(item.module));
  return first?.path || "/dashboard";
};

const matchNavItem = (pathname) =>
  flatNavItems
    .filter((item) => item.path && (pathname === item.path || pathname.startsWith(`${item.path}/`)))
    .sort((a, b) => b.path.length - a.path.length)[0];

// Build "pathname + search + hash" from a router location, only when that path is valid for the role.
// Falls back to the role's home path.
export const resolveRedirectTarget = (from, loginType, hasPermission) => {
  const home = getHomePath(loginType, hasPermission);
  const pathname = from?.pathname;
  if (!pathname || pathname === "/" || /^\/(admin\/)?(login|forgot-password|reset-password)/.test(pathname) || pathname.startsWith("/institute/login")) {
    return home;
  }

  const isInstitutePath = pathname.startsWith("/institute");
  if (loginType === "institute" ? !isInstitutePath : isInstitutePath) return home;

  if (loginType === "staff") {
    const item = matchNavItem(pathname);
    if (item && (item.adminOnly || !hasPermission(item.module, "canView"))) return home;
  }

  return `${pathname}${from.search || ""}${from.hash || ""}`;
};
