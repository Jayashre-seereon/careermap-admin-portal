import { useState } from "react";
import "antd/dist/reset.css";
import Sidebar from "./components/layout/Sidebar";
import Header  from "./components/layout/Header";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [collapsed,  setCollapsed]  = useState(false);

  return (
    <div className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-base)", fontFamily: "'DM Sans',sans-serif" }}>
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300
        ${collapsed ? "ml-[72px]" : "ml-[240px]"}`}>
        <Header activePage={activePage} />
        <main className="flex-1 overflow-y-auto p-6">
          <DashboardPage />
        </main>
      </div>
    </div>
  );
}