import {
  Award,
  Bell,
  BellIcon,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileText,
  FolderTree,
  GalleryVerticalIcon,
  GitBranch,
  GraduationCap,
  HelpCircle,
  IndianRupeeIcon,
  Layers,
  LayoutDashboard,
  ListChecks,
  LogInIcon,
  MapPin,
  MessageSquare,
  Settings2,
  Tag,
  Users,
} from "lucide-react";

export const navSections = [
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
    label: "CAREER LIBRARY ",
    items: [
      { icon: BookOpen, name: "Modules", path: "/modules" },
      { icon: Layers, name: "Stream", path: "/stream" },
      { icon: Tag, name: "Categories", path: "/categories" },
      { icon: Layers, name: "Second Categories", path: "/2ndcategories" },
      { icon: FolderTree, name: "Subcategories", path: "/subcategories" },
      { icon: FileText, name: "Details", path: "/details" },
    ],
  },
  {
    label: "CONTENT",
    items: [
     
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
      { icon: Bell, name: "Subscribers", path: "/all_users/subscribers" },
      { icon: CalendarCheck, name: "Bookings", path: "/bookings" },
      { icon: CreditCard, name: "Plans", path: "/plans" },
      { icon: HelpCircle, name: "Quiz", path: "/quiz" },
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
    ],
  },
];
