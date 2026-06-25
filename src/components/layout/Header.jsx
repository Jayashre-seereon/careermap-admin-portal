import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { logoutUser } from "../../features/auth/authStorage";
import { useSessionStore } from "../../store/sessionStore";
import { navSections } from "./navSections";
import { getNotifications } from "../../api/notification";
import { logout } from "../../api/authApi";
const stripHtml = (text = "") =>
  String(text || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const flattenNavItems = (sections) =>
  sections.flatMap((section) =>
    section.items.flatMap((item) => {
      if (item.children?.length) {
        return item.children.map((child) => ({
          name: child.name,
          path: child.path,
          group: item.name,
        }));
      }

      return item.path
        ? [
            {
              name: item.name,
              path: item.path,
              group: section.label,
            },
          ]
        : [];
    })
  );

export default function Header({ activePage, onMenuClick }) {
  const navigate = useNavigate();
  const currentUser = useSessionStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationItems, setNotificationItems] = useState([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  const searchItems = useMemo(() => flattenNavItems(navSections), []);
  const matchedItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return searchItems
      .filter((item) => item.name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [search, searchItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }

      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearch((value) => value);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isNotificationOpen) {
      return;
    }

    let isMounted = true;

    const loadNotifications = async () => {
      try {
        setNotificationLoading(true);
        const response = await getNotifications();
        const list = Array.isArray(response?.data) ? response.data : [];

        if (isMounted) {
          setNotificationItems(list.slice(0, 5));
        }
      } catch {
        if (isMounted) {
          setNotificationItems([]);
        }
      } finally {
        if (isMounted) {
          setNotificationLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [isNotificationOpen]);

const handleLogout = async () => {
  try {
    const { refreshToken } = useSessionStore.getState();

    if (refreshToken) {
      await logout(refreshToken);
    }
  } catch (error) {
    console.error("Logout API Error:", error);
  } finally {
    useSessionStore.getState().clearSession();
    navigate("/login", { replace: true });
  }
};

  const handleGoToProfile = () => {
    setIsUserMenuOpen(false);
    navigate("/profile");
  };

  const handleSearchNavigate = (path) => {
    setSearch("");
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 shadow-sm sm:px-5 lg:flex-nowrap lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-[#9a2119] transition hover:border-[#9a2119] hover:bg-[#fdf2f1] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
        <h1 className="truncate text-lg font-bold tracking-tight text-[#9a2119]">{activePage}</h1>
        <p className="mt-0.5 text-[11px] tracking-wide text-black">Overview & Analytics</p>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto sm:gap-4 lg:flex-nowrap">
        <div ref={searchRef} className="relative hidden min-w-0 md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a2119]" />
          <input
            type="text"
            placeholder="Search sidebar menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[min(18rem,42vw)] min-w-[220px] rounded-lg border border-[#9a2119] py-2 pl-9 pr-3 text-sm text-black placeholder-black/70 focus:outline-none lg:w-72"
          />

          {search.trim() && (
            <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(18rem,80vw)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl lg:w-72">
              {matchedItems.length > 0 ? (
                matchedItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleSearchNavigate(item.path)}
                    className="flex w-full items-start justify-between border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-[#fdf2f1]"
                  >
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-xs text-slate-400">{item.group}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500">No matching sidebar item found.</div>
              )}
            </div>
          )}
        </div>

        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="relative flex h-9 w-9 items-center justify-center text-[#9a2119] transition hover:scale-110"
          >
            <Bell size={18} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#9a2119]" />
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#9a2119]">Notifications</h3>
                <button
                  onClick={() => {
                    setIsNotificationOpen(false);
                    navigate("/notifications");
                  }}
                  className="text-xs font-medium text-[#9a2119] hover:underline"
                >
                  See All
                </button>
              </div>

              {notificationLoading ? (
                <div className="rounded-xl border border-[#f1d6d3] bg-[#fffafa] p-3 text-sm text-slate-500">
                  Loading notifications...
                </div>
              ) : (
                <div className="space-y-3">
                  {notificationItems.length > 0 ? (
                    notificationItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[#f1d6d3] bg-[#fffafa] p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {stripHtml(item.message) || "-"}
                            </p>
                          </div>
                          <span className="whitespace-nowrap text-[11px] text-slate-400">
                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-[#f1d6d3] bg-[#fffafa] p-3 text-sm text-slate-500">
                      No notifications found.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

       
      

        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex max-w-full items-center gap-2 rounded-lg px-2 py-1 transition hover:bg-[#fdf2f1]"
          >
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-[#9a2119] text-xs font-bold text-white">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
              ) : (
                currentUser?.name?.charAt(0)?.toUpperCase() || "A"
              )}
            </div>
            <span className="hidden max-w-[140px] truncate text-sm font-semibold text-[#9a2119] sm:block">
              {currentUser?.name || "Admin"}
            </span>
            <ChevronDown size={14} className="text-[#9a2119]" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
              <button
                onClick={handleGoToProfile}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-[#fdf2f1]"
              >
                <User size={16} className="text-[#9a2119]" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-[#fdf2f1]"
              >
                <LogOut size={16} className="text-[#9a2119]" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
