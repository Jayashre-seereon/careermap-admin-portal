import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../../store/sessionStore";
import logoFull from "../../assets/logo_white.png";
import logoCompact from "../../assets/logo_white_small.png";
import { navSections } from "./navSections";

export default function Sidebar({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  mobileOpen = false,
  onMobileClose,
}) {
  const navigate = useNavigate();
  const currentUser = useSessionStore((state) => state.user);
  // Track which accordion items are open by their name
  const [openAccordions, setOpenAccordions] = useState({ "Email & Notification": true });

  const toggleAccordion = (name) => {
    setOpenAccordions((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
    <div
      onClick={onMobileClose}
      className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden ${
        mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    />
    <aside
      className={`fixed top-0 left-0 z-50 flex h-full flex-col transition-all duration-300 lg:z-40 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      style={{ background: "#fff", borderRight: "1px solid #eee" }}
    >
      {/* Logo */}
      <div
        className={`flex h-20 items-center gap-3 border-b px-4 ${
          collapsed ? "justify-between" : ""
        }`}
      >
        <div
          className={`overflow-hidden transition-all duration-300 ${
            collapsed ? "h-16 w-[50px]" : "h-12 w-[150px]"
          }`}
        >
          <img
            src={collapsed ? logoCompact : logoFull}
            alt="Career Map"
            className={`h-full transition-all duration-300 ${
              collapsed ? "w-full object-contain" : "w-full object-contain object-left"
            }`}
          />
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`${collapsed ? "" : "ml-auto"} flex h-6 w-6 items-center justify-center rounded-md`}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="scrollbar-hide flex-1 overflow-y-auto py-4">
        {navSections.map((section) => (
          <div key={section.label} className="mb-3">
            {!collapsed && (
              <p className="mb-2 px-4 text-[10px] font-semibold tracking-widest text-slate-500">
                {section.label}
              </p>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.name;
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openAccordions[item.name];

              // Item has children → render accordion
              if (hasChildren) {
                return (
                  <div key={item.name}>
                    {/* Accordion trigger */}
                    <button
                      onClick={() => {
                        if (!collapsed) toggleAccordion(item.name);
                        setActivePage(item.name);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition ${
                        isActive || isOpen
                          ? "bg-[#eef2ff] text-[#9a2119]"
                          : "text-gray-600 hover:text-[#9a2119]"
                      }`}
                    >
                      <span className="flex h-6 w-6 items-center justify-center">
                        <Icon size={15} />
                      </span>
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          <span className="ml-auto">
                            {isOpen ? (
                              <ChevronUp size={13} />
                            ) : (
                              <ChevronDown size={13} />
                            )}
                          </span>
                        </>
                      )}
                    </button>

                    {/* Children */}
                    {!collapsed && isOpen && (
                      <div className="ml-4 border-l border-gray-200 pl-3">
                        {item.children.map((child) => {
                          const isChildActive = activePage === child.name;
                          return (
                            <button
                              key={child.name}
                              onClick={() => {
                                setActivePage(child.name);
                                onMobileClose?.();
                                if (child.path) navigate(child.path);
                              }}
                              className={`flex w-full items-center gap-2 px-3 py-[7px] text-sm transition ${
                                isChildActive
                                  ? "text-[#9a2119] font-medium"
                                  : "text-gray-500 hover:text-[#9a2119]"
                              }`}
                            >
                              {/* Small chevron bullet matching the image */}
                              <ChevronRight
                                size={12}
                                className={
                                  isChildActive ? "text-[#9a2119]" : "text-gray-400"
                                }
                              />
                              <span>{child.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Normal item
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActivePage(item.name);
                    onMobileClose?.();
                    if (item.path) navigate(item.path);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition ${
                    isActive
                      ? "text-[#9a2119]"
                      : "text-gray-600 hover:text-[#9a2119]"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center">
                    <Icon size={15} />
                  </span>
                  {!collapsed && <span>{item.name}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#9a2119] text-white">
              A
            </div>
            <div>
              <p className="text-sm font-semibold">{currentUser?.name || "Admin"}</p>
              <p className="text-xs text-gray-400">{currentUser?.email || "admin@careermap.io"}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
    </>
  );
}
