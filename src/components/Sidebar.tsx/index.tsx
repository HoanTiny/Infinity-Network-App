import { MoreIcon } from "@components/Icon";
import UserAvatar from "@components/UserAvatar";
import { useUserInfo } from "@hooks/getUserinfo";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const userInfo = useUserInfo();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: "/icons/intagram/home.png", path: "/", title: "Trang chủ" },
    { icon: "/icons/intagram/video.png", path: "/video", title: "Reels" },
    {
      icon: "/icons/intagram/send.png",
      path: "/messages",
      badge: 3,
      title: "Tin nhắn",
    },
    { icon: "/icons/intagram/search.png", path: "/search", title: "Tìm kiếm" },
    {
      icon: "/icons/intagram/heart.png",
      path: "/notifications",
      badge: 10,
      title: "Thông báo",
    },
    {
      icon: "/icons/intagram/more.png",
      path: "/create",
      action: true,
      title: "Tạo bài viết",
    },
  ];

  const bottomNavItems = [
    {
      icon: "/icons/intagram/settings.png",
      path: "settings/account",
      title: "Cài đặt",
    },
    {
      icon: "/icons/intagram/logout.png",
      path: "#",
      action: true,
      title: "Đăng xuất",
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-[72px] flex flex-col items-center py-4">
      {/* Logo */}
      <div className="py-4">
        <Link to="/">
          <img src="/img/Logo2.svg" alt="logo" className="w-6 h-6" />
        </Link>
      </div>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 mt-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="nav-item-wrapper relative p-3 rounded-xl transition-all duration-200 hover:bg-gray-100"
            onClick={(e) => {
              if (item.action) {
                e.preventDefault();
              }
            }}
          >
            <div className="relative">
              <img src={item.icon} alt={item.title} width={24} height={24} />
              {item.badge && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="nav-item-tooltip">{item.title}</span>
          </Link>
        ))}
        <Link to={`/user/${userInfo?._id}`} className="block">
          <div className="w-7 h-7 rounded-full overflow-hidden">
            <UserAvatar isMyAvatar size="sm" />
          </div>
        </Link>
      </div>

      {/* Bottom Actions */}
      <div className="pb-4">
        <div className="relative">
          <button
            className="p-3 rounded-xl transition-all duration-200 hover:bg-gray-100"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
          >
            <MoreIcon width={28} height={28} />
          </button>

          {/* Expanded menu */}
          {isMoreOpen && (
            <div className="absolute bottom-full left-full ml-2 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[180px]">
              {bottomNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block"
                  onClick={(e) => {
                    if (item.action) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div
                    className={`group flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all ${
                      isActive(item.path) ? "bg-gray-50" : ""
                    }`}
                  >
                    <img src={item.icon} alt={item.title} />
                    <span className="text-sm text-gray-700">
                      {item.path === "settings/account"
                        ? "Cài đặt"
                        : "Đăng xuất"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
