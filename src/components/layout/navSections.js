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
  GitBranch,
  GraduationCap,
  HelpCircle,
  IndianRupeeIcon,
  Layers,
  LayoutDashboard,
  LogInIcon,
  MapPin,
  MessageSquare,
  Tag,
  Users,
  Video,
  Key,

} from "lucide-react";

export const navSections = [
  {
    label: "MAIN",
    items: [
      {
        icon: LayoutDashboard,
        name: "Dashboard",
        path: "/dashboard",
        module: "Dashboard",
      },
      {
        icon: BookOpen,
        name: "Modules",
        path: "/modules",
        module: "Modules",
      },
       {
        icon: Users,
        name: "Roles",
        path: "/roles",
        module: "Roles",
      },
      {
        icon: Key,
        name: "Permissions",
        path: "/permissions",
        module: "Permissions",
      },
      {
        icon: Users,
        name: "Staff",
        path: "/staff",
        module: "Staff",
      },
     
    ],
  },

  {
    label: "BASIC INFORMATION",
    items: [
      {
        icon: GraduationCap,
        name: "Mentors",
        path: "/mentor",
        module: "Mentors",
      },
      {
        icon: GitBranch,
        name: "Path Type",
        path: "/pathtype",
        module: "Path Type",
      },
      {
        icon: MapPin,
        name: "Career Path",
        path: "/careerpath",
        module: "Career Path",
      },
      {
        icon: ClipboardList,
        name: "Entrance Exam",
        path: "/entranceexam",
        module: "Entrance Exam",
      },
      {
        icon: Building2,
        name: "Institution",
        path: "/institution",
        module: "Institution",
      },
      {
        icon: Award,
        name: "Scholarship",
        path: "/scholarship",
        module: "Scholarship",
      },
      {
        icon: Video,
        name: "Master Class",
        path: "/masterclass",
        module: "Master Class",
      },
      {
        icon: CreditCard,
        name: "Plans",
        path: "/plans",
        module: "PlansQuiz",
      },
      {
        icon: HelpCircle,
        name: "Quiz",
        path: "/quiz",
        module: "PlansQuiz",
      },
    ],
  },

  {
    label: "CAREER LIBRARY",
    items: [
      {
        icon: Layers,
        name: "Stream",
        path: "/stream",
        module: "Stream",
      },
      {
        icon: Tag,
        name: "Categories",
        path: "/categories",
        module: "Categories",
      },
      {
        icon: Layers,
        name: "Second Categories",
        path: "/2ndcategories",
        module: "Second Categories",
      },
      {
        icon: FolderTree,
        name: "Subcategories",
        path: "/subcategories",
        module: "Subcategories",
      },
      {
        icon: FileText,
        name: "Details",
        path: "/details",
        module: "Details",
      },
    ],
  },

  {
    label: "USERS DETAILS",
    items: [
      {
        icon: Users,
        name: "All Users",
        path: "/all_users",
        module: "All Users",
      },
      {
        icon: BellIcon,
        name: "Notifications",
        path: "/notifications",
        module: "Notifications",
      },
      {
        icon: Bell,
        name: "Subscribers",
        path: "/subscribers",
        module: "Subscribers",
      },
      {
        icon: CalendarCheck,
        name: "Bookings",
        path: "/bookings",
        module: "Bookings",
      },
      {
        icon: IndianRupeeIcon,
        name: "Transactions",
        path: "/transactions",
        module: "Transactions",
      },
      {
        icon: LogInIcon,
        name: "Login Activities",
        path: "/loginactivities",
        module: "Login Activities",
      },
      {
        icon: MessageSquare,
        name: "Support Tickets",
        path: "/support_tickets",
        module: "Support Tickets",
      },
    ],
  },

  {
    label: "COUNSELING",
    items: [
      {
        icon: HelpCircle,
        name: "Counseling",
        path: "/counseling",
        module: "Counseling",
      },
    ],
  },

  {
    label: "PSYCHOMETRIC",
    items: [
      {
        icon: HelpCircle,
        name: "Personality Test",
        path: "/personality-test",
        module: "Personality Test",
      },
      {
        icon: Layers,
        name: "Domains",
        path: "/domains",
        module: "Domains",
      },
      {
        icon: Briefcase,
        name: "Careers",
        path: "/careers",
        module: "Careers",
      },
      {
        icon: MapPin,
        name: "Career Paths",
        path: "/career-paths",
        module: "Career Paths",
      },
      {
        icon: Tag,
        name: "Career Categories",
        path: "/career-categories",
        module: "Career Categories",
      },
      {
        icon: Building2,
        name: "Institutes",
        path: "/institutes",
        module: "Institutes",
      },
      {
        icon: HelpCircle,
        name: "Questions",
        path: "/questions",
        module: "Questions",
      },
      {
        icon: ClipboardList,
        name: "Sections",
        path: "/sections",
        module: "Sections",
      },
      {
        icon: Users,
        name: "Students",
        path: "/students",
        module: "Students",
      },
    ],
  },
];
