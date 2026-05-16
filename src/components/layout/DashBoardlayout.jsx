import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";

const pageNameMap = {
  "/dashboard": "Dashboard",
  "/mentor": "Mentors",
  "/modules": "Modules",
  "/stream": "Stream",
  "/categories": "Categories",
  "/2ndcategories": "Secondary Categories",
  "/subcategories": "Sub Categories",
  "/details": "Details",
  "/salary": "Salary Range",
  "/jobscope": "Job Scope",
  "/pathtype": "Path Type",
  "/careerpath": "Career Path",
  "/entranceexam": "Entrance Exam",
  "/institution": "Institution",
  "/scholarship": "Scholarship",
  "/careerplan": "Career Plan",
  "/bookings": "Bookings",
  "/plans": "Plans",
  "/subscriptions": "Subscriptions",
  "/services": "Services",
  "/allcountries": "All Countries",
  "/states": "States",
  "/districts": "Districts",
  "/transactions": "Transactions",
  "/loginactivities": "Login Activities",
  "/notifications": "Notifications",
  "/logo-favicon": "Logo & Favicon",
  "/email-notification/alltemplates": "All Templates",
  "/email-notification/globaltemplates": "Global Template",
  "/email-notification/emailconfig": "Email Config",
  "/email-notification/smsconfig": "SMS Config",
  "/jobs": "Job",
  "/job-applications": "Job Application",
  "/quiz": "Quiz",
  "/globalsettings": "Global Settings",
  "/profile": "Profile",
  "/language": "Language",
  "/seo": "SEO",
  "/social-credential": "Social Credential",
  "/domains": "Domains",
  "/careers": "Careers",
  "/career-paths": "Career Paths",
  "/career-categories": "Career Categories",
  "/institutes": "Institutes",
  "/questions": "Questions",
  "/sections": "Sections",
  "/students": "Students"
};

function getActivePage(pathname) {
  if (pathname === "/all_users/subscribers") {
    return "Subscribers";
  }

  if (pathname.startsWith("/all_users")) {
    return "All Users";
  }

  if (pathname.startsWith("/all_orders")) {
    return "All Orders";
  }

  if (pathname.startsWith("/support_tickets")) {
    return "Support Tickets";
  }

  if (pathname.startsWith("/email-notification")) {
    return pageNameMap[pathname] || "Email & Notification";
  }

  if (pathname.startsWith("/language")) {
    return "Language";
  }

  if (pathname.startsWith("/jobs")) {
    return "Job";
  }

  if (pathname.startsWith("/details")) {
    return "Details";
  }

  if (pathname.startsWith("/quiz")) {
    return "Quiz";
  }

  return pageNameMap[pathname] || "Dashboard";
}

const DashBoardlayout = () => {
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const activePage = getActivePage(location.pathname);

  return (
   <div className="flex h-screen bg-[#f9fafd] overflow-hidden font-body">
         <Sidebar
           activePage={activePage}
           setActivePage={() => {}}
           collapsed={sidebarCollapsed}
           setCollapsed={setSidebarCollapsed}
           mobileOpen={mobileSidebarOpen}
           onMobileClose={() => setMobileSidebarOpen(false)}
         />
         <div className={`flex min-w-0 flex-col flex-1 overflow-hidden transition-all duration-300 ${
           sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"
         }`}>
           <Header
             activePage={activePage}
             onMenuClick={() => setMobileSidebarOpen(true)}
           />
           <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 lg:p-6">
             <Outlet/>
           </main>
         </div>
       </div>
  )
}

export default DashBoardlayout
