import { Tabs } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AllOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  // map URL → tab key
  const pathToKey = {
   
    "/all_orders/approved": "1",
    "/all_orders/pending": "2",
   
  };

  const keyToPath = {
  
    "1": "/all_orders/approved",
    "2": "/all_orders/pending",
  };

  const activeKey = pathToKey[location.pathname] || "1";

  const items = [
    { label: "Approved", key: "1" },
    { label: "Pending", key: "2" },
  
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#9a2119] mb-2">
        Orders List
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
