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
  Plane,
  Settings2,
  Tag,
  Users,
  Video,
} from "lucide-react";

export const navSections = [
  {
    label: "MAIN",
    items: [{ icon: LayoutDashboard, name: "Dashboard", path: "/dashboard" },
        { icon: BookOpen, name: "Modules", path: "/modules" },
   
    ],
    
  },
   {
    label: "BASIC INFORMATION",
    items: [
      { icon: GraduationCap, name: "Mentors", path: "/mentor" },
      { icon: GitBranch, name: "Path Type", path: "/pathtype" },
      { icon: MapPin, name: "Career Path", path: "/careerpath" },
      { icon: ClipboardList, name: "Entrance Exam", path: "/entranceexam" },
      { icon: Building2, name: "Institution", path: "/institution" },
      { icon: Award, name: "Scholarship", path: "/scholarship" },
      { icon: Video, name: "Master Class", path: "/masterclass" },
      { icon: Plane, name: "Study Abroad", path: "/studyabroad" },
      { icon: CreditCard, name: "Plans", path: "/plans" },
      { icon: HelpCircle, name: "Quiz", path: "/quiz" },
  
    ],
  },
  {
    label: "CAREER LIBRARY ",
    items: [
      { icon: Layers, name: "Stream", path: "/stream" },
      { icon: Tag, name: "Categories", path: "/categories" },
      { icon: Layers, name: "Second Categories", path: "/2ndcategories" },
      { icon: FolderTree, name: "Subcategories", path: "/subcategories" },
      { icon: FileText, name: "Details", path: "/details" },
    ],
  },
 {
    label: "USERS DETAILS",
    items: [
      { icon: Users, name: "All Users", path: "/all_users" },
      { icon: BellIcon, name: "Notifications", path: "/notifications" },
      { icon: Bell, name: "Subscribers", path: "/all_users/subscribers" },
      { icon: CalendarCheck, name: "Bookings", path: "/bookings" },
      { icon: IndianRupeeIcon, name: "Transactions", path: "/transactions" },
      { icon: LogInIcon, name: "Login Activities", path: "/loginactivities" },
      { icon: MessageSquare, name: "Support Tickets", path: "/support_tickets" },
  
    ],
  },
  
  // {
  //   label: "ORDERS",
  //   items: [{ icon: ListChecks, name: "All Orders", path: "/all_orders" }],
  // },
  // {
  //   label: "JOB MANAGEMENT",
  //   items: [
  //     { icon: Briefcase, name: "Job", path: "/jobs" },
  //     { icon: FileText, name: "Job Application", path: "/job-applications" },
  //   ],
  // },
 
  {
    label: "PSYCHOMETRIC",
    items: [
      { icon: HelpCircle, name: "Personality Test", path: "/personality-test" },
      { icon: Layers, name: "Domains", path: "/domains" },
      { icon: Briefcase, name: "Careers", path: "/careers" },
      { icon: MapPin, name: "Career Paths", path: "/career-paths" },
      { icon: Tag, name: "Career Categories", path: "/career-categories" },
      { icon: Building2, name: "Institutes", path: "/institutes" },
      { icon: HelpCircle, name: "Questions", path: "/questions" },
      { icon: ClipboardList, name: "Sections", path: "/sections" },
      { icon: Users, name: "Students", path: "/students" },
    ],
  },
  
  // {
  //   label: "SETTINGS",
  //   items: [
  //     { icon: Settings2, name: "Global Settings", path: "/globalsettings" },
  //     { icon: GalleryVerticalIcon, name: "Logo & Favicon", path: "/logo-favicon" },
  // },
];
