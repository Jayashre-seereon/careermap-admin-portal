import { Tabs } from "antd";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NotificationToUser from "./tabs/NotificationToUser";
import UserDetails from "./tabs/UserDetails";

export default function AllUsers() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [notificationUser, setNotificationUser] = useState(null);

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
  const isNotificationRoute = location.pathname === "/all_users/notification";

  const handleTabChange = (key) => {
    setSelectedUser(null);

    if (key !== "9") {
      setNotificationUser(null);
    }

    navigate(keyToPath[key]);
  };

  const handleBackFromDetails = () => {
    setSelectedUser(null);
  };

  const handleNotifyUser = (user) => {
    setNotificationUser(user);
    navigate("/all_users/notification");
  };

  const items = [
    { label: "All Users", key: "1" },
    { label: "Active", key: "2" },
    { label: "Banned", key: "3" },
    // { label: "Email Unverified", key: "4" },
    // { label: "Mobile Unverified", key: "5" },
    // { label: "Subscribers", key: "6" },
    // { label: "With Balance", key: "7" },
    // { label: "Notification to User", key: "9" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#9a2119] mb-2">
        Users Management
      </h1>

      <Tabs
        className="custom-tabs"
        activeKey={activeKey}
        onChange={handleTabChange}
        items={items}
      />

      {selectedUser ? (
        <UserDetails
          user={selectedUser}
          onBack={handleBackFromDetails}
          onNotify={handleNotifyUser}
        />
      ) : isNotificationRoute ? (
        <NotificationToUser user={notificationUser} />
      ) : (
        <Outlet
          context={{
            setSelectedUser,
            selectedUser,
            notificationUser,
            setNotificationUser,
          }}
        />
      )}
    </div>
  );
}
