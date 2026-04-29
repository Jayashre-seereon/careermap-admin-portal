import { Bell, Search, Settings, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../features/auth/authStorage";

export default function Header({ activePage }) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-6 shadow-sm">

      {/* LEFT */}
      <div>
        <h1 className="text-lg font-bold tracking-tight text-[#9a2119]">
          {activePage}
        </h1>
        <p className="mt-0.5 text-[11px] tracking-wide text-black">
          Overview & Analytics
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div className="relative hidden items-center md:flex">
          <Search size={10} className="absolute left-3 text-[#9a2119]" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-50 rounded-lg border border-[#9a2119] py-1 pl-9 pr-3 text-sm text-black placeholder-black/70 focus:outline-none"
          />
         
        </div>

        {/* NOTIFICATION */}
        <button className="relative flex h-9 w-9 items-center justify-center text-[#9a2119] transition hover:scale-110">
          <Bell size={18} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#9a2119]" />
        </button>

        {/* SETTINGS */}
        <button className="flex h-9 w-9 items-center justify-center text-[#9a2119] transition hover:scale-110">
          <Settings size={18} />
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="hidden items-center gap-2 text-sm font-semibold text-[#9a2119] transition hover:underline md:flex"
        >
          <LogOut size={16} />
          Logout
        </button>

        {/* USER / ADMIN */}
        <button className="flex items-center gap-2 px-2 py-1 rounded-lg transition hover:scale-105">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#9a2119] text-xs font-bold text-white">
            {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <span className="text-sm font-semibold text-[#9a2119]">
            {currentUser?.name || "Admin"}
          </span>
          <ChevronDown size={14} className="text-[#9a2119]" />
        </button>

      </div>
    </header>
  );
}