import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";

const pageNameMap = {
  "/dashboard": "Dashboard",
  "/mentor": "Mentors",
  "/modules": "Modules",
  "/stream": "Stream",
  "/categories": "Categories",
  "/2ndcategories": "2nd Categories",
  "/subcategories": "Subcategories",
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
  "/language": "Language",
  "/seo": "SEO",
  "/social-credential": "Social Credential",
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

  if (pathname.startsWith("/quiz")) {
    return "Quiz";
  }

  return pageNameMap[pathname] || "Dashboard";
}

const DashBoardlayout = () => {
    const location = useLocation();
    const [activePage, setActivePage] = useState("Dashboard");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
      setActivePage(getActivePage(location.pathname));
    }, [location.pathname]);

  return (
   <div className="flex h-screen bg-[#f9fafd] overflow-hidden font-body">
         <Sidebar
           activePage={activePage}
           setActivePage={setActivePage}
           collapsed={sidebarCollapsed}
           setCollapsed={setSidebarCollapsed}
         />
         <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
           sidebarCollapsed ? "ml-[72px]" : "ml-[240px]"
         }`}>
           <Header activePage={activePage} />
           <main className="flex-1 overflow-y-auto p-6">
             <Outlet/>
           </main>
         </div>
       </div>
  )
}

export default DashBoardlayout
