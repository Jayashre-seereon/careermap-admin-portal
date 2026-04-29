import {
  Award,
  Bell,
  BellIcon,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileText,
  FolderTree,
  GalleryVerticalIcon,
  GitBranch,
  Globe2,
  GraduationCap,
  HelpCircle,
  IndianRupeeIcon,
  Languages,
  Layers,
  LayoutDashboard,
  ListChecks,
  LogInIcon,
  MapPin,
  MessageSquare,
  Repeat,
  Search,
  Settings2,
  Tag,
  Tags,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoFull from "../../assets/logo_white.png";
import logoCompact from "../../assets/logo_white_small.png";

const navSections = [
  {
    label: "MAIN",
    items: [{ icon: LayoutDashboard, name: "Dashboard", path: "/dashboard" }],
  },
  {
    label: "USERS",
    items: [
      { icon: GraduationCap, name: "Mentors", path: "/mentor" },
      { icon: Users, name: "All Users", path: "/all_users" },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { icon: BookOpen, name: "Modules", path: "/modules" },
      { icon: Layers, name: "Stream", path: "/stream" },
      { icon: Tag, name: "Categories", path: "/categories" },
      { icon: Layers, name: "Second Categories", path: "/2ndcategories" },
      { icon: FolderTree, name: "Subcategories", path: "/subcategories" },
    ],
  },
  {
    label: "CAREER",
    items: [
      { icon: DollarSign, name: "Salary Range", path: "/salary" },
      { icon: Briefcase, name: "Job Scope", path: "/jobscope" },
      { icon: GitBranch, name: "Path Type", path: "/pathtype" },
      { icon: MapPin, name: "Career Path", path: "/careerpath" },
      { icon: ClipboardList, name: "Entrance Exam", path: "/entranceexam" },
      { icon: Building2, name: "Institution", path: "/institution" },
      { icon: Award, name: "Scholarship", path: "/scholarship" },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { icon: MapPin, name: "Career Plan", path: "/careerplan" },
      { icon: Bell, name: "Subscribers", path: "/all_users/subscribers" },
      { icon: CalendarCheck, name: "Bookings", path: "/bookings" },
      { icon: CreditCard, name: "Plans", path: "/plans" },
      { icon: HelpCircle, name: "Quiz", path: "/quiz" },
      { icon: Repeat, name: "Subscriptions" },
      { icon: Wrench, name: "Services", path: "/services" },
    ],
  },
  {
    label: "COUNTRIES",
    items: [
      { icon: Globe2, name: "All Countries", path: "/allcountries" },
      { icon: MapPin, name: "States", path: "/states" },
      { icon: MapPin, name: "Districts", path: "/districts" },
    ],
  },
  {
    label: "REPORT",
    items: [
      { icon: IndianRupeeIcon, name: "Transactions", path: "/transactions" },
      { icon: LogInIcon, name: "Login Activities", path: "/loginactivities" },
      { icon: BellIcon, name: "Notifications", path: "/notifications" },
    ],
  },
  {
    label: "ORDERS",
    items: [{ icon: ListChecks, name: "All Orders", path: "/all_orders" }],
  },
  {
    label: "JOB MANAGEMENT",
    items: [
      { icon: Briefcase, name: "Job", path: "/jobs" },
      { icon: FileText, name: "Job Application", path: "/job-applications" },
    ],
  },
  {
    label: "SUPPORT",
    items: [{ icon: MessageSquare, name: "Support Tickets", path: "/support_tickets" }],
  },
  {
    label: "SETTINGS",
    items: [
      { icon: Settings2, name: "Global Settings", path: "/globalsettings" },
      { icon: GalleryVerticalIcon, name: "Logo & Favicon", path: "/logo-favicon" },
      { icon: Languages, name: "Language", path: "/language" },
     {
  icon: BellIcon,
  name: "Email & Notification",
  children: [
    { name: "All Templates", path: "/email-notification/alltemplates" },
    { name: "Global Template", path: "/email-notification/globaltemplates" },
    { name: "Email Config", path: "/email-notification/emailconfig" },
    { name: "SMS Config", path: "/email-notification/smsconfig" },
  ],
},
      { icon: Settings2, name: "Social Credential", path: "/social-credential" },
      { icon: Search, name: "SEO", path: "/seo" },
    ],
  },
];

export default function Sidebar({ activePage, setActivePage, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  // Track which accordion items are open by their name
  const [openAccordions, setOpenAccordions] = useState({ "Email & Notification": true });

  const toggleAccordion = (name) => {
    setOpenAccordions((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 flex h-full flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
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
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-gray-400">admin@careermap.io</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}