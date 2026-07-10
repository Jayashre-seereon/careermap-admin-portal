import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { useSessionStore } from "../../store/sessionStore";
import logoFull from "../../assets/logo_white.png";
import logoCompact from "../../assets/logo_white_small.png";

const navItems = [
  {
    name: "Dashboard",
    path: "/institute/dashboard",
    icon: LayoutDashboard,
  },
];

const getActivePage = (pathname) => {
  if (pathname.startsWith("/institute/dashboard")) {
    return "Dashboard";
  }

  return "Dashboard";
};

export default function InstituteLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentUser = useSessionStore((state) => state.user);
  const clearSession = useSessionStore((state) => state.clearSession);
  const activePage = getActivePage(location.pathname);

  const handleLogout = () => {
    clearSession();
    navigate("/institute/login", { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[linear-gradient(180deg,#f7f1ee_0%,#fdfbfa_45%,#f4ece8_100%)] font-sans">
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full flex-col bg-[linear-gradient(180deg,#4b0f0b_0%,#6e1812_55%,#8f2218_100%)] text-white shadow-2xl transition-all duration-300 lg:z-40 ${
          collapsed ? "w-[76px]" : "w-[260px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className={`flex h-20 items-center gap-3 border-b border-white/10 px-4 ${collapsed ? "justify-between" : ""}`}>
          <div className={`overflow-hidden transition-all duration-300 ${collapsed ? "h-14 w-[46px]" : "h-11 w-[154px]"}`}>
            <img
              src={collapsed ? logoCompact : logoFull}
              alt="Career Map"
              className="h-full w-full object-contain object-left"
            />
          </div>

          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className={`${collapsed ? "" : "ml-auto"} flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20`}
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        <div className="px-4 pb-3 pt-4">
          {!collapsed && (
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">Institute portal</p>
                <p className="mt-1 text-sm font-semibold text-white">{currentUser?.name || "Institute"}</p>
                <p className="mt-1 text-xs text-white/70">{currentUser?.email || "institute@example.com"}</p>
              </div>
            )}
          </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className={`mx-3 mb-2 flex w-[calc(100%-1.5rem)] items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                  isActive ? "bg-white/20 text-white shadow-lg" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Icon size={16} />
                </span>
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div
        className={`flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ${
          collapsed ? "lg:ml-[76px]" : "lg:ml-[260px]"
        }`}
      >
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-[#eaded8] bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8d7d1] text-[#8f2218] transition hover:border-[#8f2218] hover:bg-[#fff5f3] lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight text-[#8f2218]">{activePage}</h1>
              <p className="mt-0.5 text-[11px] tracking-wide text-slate-500">Institute overview</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-[#eaded8] bg-[#fff7f5] px-3 py-1.5 text-xs font-semibold text-[#8f2218] sm:block">
              {currentUser?.name || "Institute"}
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8f2218] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a6291d]"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
