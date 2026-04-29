import { Tabs } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AllUsers() {
  const location = useLocation();
  const navigate = useNavigate();

  // map URL → tab key
  const pathToKey = {
    "/all_users": "1",
    "/all_users/active": "2",
    "/all_users/banned": "3",
    "/all_users/email-unverified": "4",
    "/all_users/mobile-unverified": "5",
    "/all_users/subscribers": "6",
    "/all_users/with-balance": "7",
    "/all_users/notification": "9",
  };

  const keyToPath = {
    "1": "/all_users",
    "2": "/all_users/active",
    "3": "/all_users/banned",
    "4": "/all_users/email-unverified",
    "5": "/all_users/mobile-unverified",
    "6": "/all_users/subscribers",
    "7": "/all_users/with-balance",
    "9": "/all_users/notification",
  };

  const activeKey = pathToKey[location.pathname] || "1";

  const items = [
    { label: "All Users", key: "1" },
    { label: "Active", key: "2" },
    { label: "Banned", key: "3" },
    { label: "Email Unverified", key: "4" },
    { label: "Mobile Unverified", key: "5" },
    { label: "Subscribers", key: "6" },
    { label: "With Balance", key: "7" },
    { label: "Notification to User", key: "9" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#9a2119] mb-2">
        Users Management
      </h1>

      <Tabs
        className="custom-tabs"
        activeKey={activeKey}
        onChange={(key) => navigate(keyToPath[key])}
        items={items}
      />

      {/* THIS RENDERS TAB CONTENT */}
      <Outlet />
    </div>
  );
}
