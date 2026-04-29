import { Tabs } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function SupportTickets() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathToKey = {
    "/support_tickets/all": "1",
    "/support_tickets/pending": "2",
    "/support_tickets/closed": "3",
    "/support_tickets/answered": "4",
  };

  const keyToPath = {
    "1": "/support_tickets/all",
    "2": "/support_tickets/pending",
    "3": "/support_tickets/closed",
    "4": "/support_tickets/answered",
  };

  const activeKey = pathToKey[location.pathname] || "1";

  const items = [
    { label: "All", key: "1" },
    { label: "Pending", key: "2" },
    { label: "Closed", key: "3" },
    { label: "Answered", key: "4" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#9a2119] mb-2">
        Support Tickets
      </h1>

      <Tabs
        className="custom-tabs"
        activeKey={activeKey}
        onChange={(key) => navigate(keyToPath[key])}
        items={items}
      />

      <Outlet />
    </div>
  );
}
