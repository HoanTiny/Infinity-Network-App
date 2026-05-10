import UserAvatar from '@components/UserAvatar';
import { useUserInfo } from '@hooks/getUserinfo';
import { useTheme } from '@hooks/useTheme';
import { logOut } from '@redux/slice/authSlice';
import { openDialog } from '@redux/slice/dialogSlice';
import {
  Compass,
  Film,
  Heart,
  Home,
  LogOut,
  type LucideIcon,
  Menu,
  MessageCircle,
  Monitor,
  Moon,
  Search,
  Settings,
  SquarePlus,
  Sun,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type NavItem = {
  icon: LucideIcon;
  label: string;
  path?: string;
  badge?: number;
  onClick?: () => void;
};

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useUserInfo();
  const { theme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const isActive = (path?: string) =>
    !!path &&
    (path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path));

  const openCreateDialog = () => {
    dispatch(
      openDialog({
        title: 'TITLE_CREATE_POST',
        content: 'NEW_CONTENT_DIALOG',
        actions: 'Post',
        maxWidth: 'md',
        fullWidth: true,
      }),
    );
  };

  const navItems: NavItem[] = [
    { icon: Home, label: 'Trang chủ', path: '/' },
    { icon: Search, label: 'Tìm kiếm', path: '/search/users' },
    { icon: Compass, label: 'Khám phá', path: '/explore' },
    { icon: Film, label: 'Reels', path: '/reels' },
    { icon: MessageCircle, label: 'Tin nhắn', path: '/messages', badge: 3 },
    { icon: Heart, label: 'Thông báo', path: '/notifications', badge: 10 },
    { icon: SquarePlus, label: 'Tạo bài viết', onClick: openCreateDialog },
  ];

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] flex flex-col items-center py-4 bg-ig-bg border-ig-border z-40">
      <Link to="/" className="py-3" aria-label="Trang chủ">
        <img src="/img/Logo2.svg" alt="logo" className="w-7 h-7" />
      </Link>

      <nav className="flex-1 flex justify-center flex-col items-center gap-2 mt-6 w-full">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          const inner = (
            <span className="relative inline-flex">
              <Icon
                size={22}
                strokeWidth={active ? 2.25 : 1.75}
                className="text-ig-text"
              />
              {item.badge ? (
                <span className="absolute -top-1.5 -right-2 bg-ig-heart text-white text-[8px] font-semibold rounded-full min-w-[14px] h-[14px] px-1 flex items-center justify-center leading-none ring-2 ring-ig-bg">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : null}
            </span>
          );

          const className = `group relative p-3 rounded-lg transition-colors hover:bg-ig-hover ${
            active ? 'bg-ig-hover' : ''
          }`;

          const tooltip = (
            <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ig-bg border border-ig-border px-3 py-1.5 text-[13px] font-medium text-ig-text shadow-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out z-50">
              {item.label}
            </span>
          );

          return item.path ? (
            <Link
              key={item.label}
              to={item.path}
              className={className}
              aria-label={item.label}
            >
              {inner}
              {tooltip}
            </Link>
          ) : (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className={className}
              aria-label={item.label}
            >
              {inner}
              {tooltip}
            </button>
          );
        })}

        <div className="group relative p-2 mt-1">
          <Link
            to={`/user/${userInfo?._id}`}
            className={`block rounded-full transition-colors hover:bg-ig-hover ${
              isActive(`/user/${userInfo?._id}`)
                ? 'ring-2 ring-ig-text ring-offset-2 ring-offset-ig-bg'
                : ''
            }`}
            aria-label="Trang cá nhân"
          >
            <UserAvatar isMyAvatar size="sm" />
          </Link>
          <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ig-bg border border-ig-border px-3 py-1.5 text-[13px] font-medium text-ig-text shadow-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out z-50">
            Trang cá nhân
          </span>
        </div>
      </nav>

      <div className="relative pb-2" ref={menuRef}>
        <button
          type="button"
          className="group relative p-3 rounded-lg transition-colors hover:bg-ig-hover"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Tùy chọn khác"
          aria-expanded={menuOpen}
        >
          <Menu size={26} strokeWidth={1.75} className="text-ig-text" />
          <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ig-bg border border-ig-border px-3 py-1.5 text-[13px] font-medium text-ig-text shadow-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out z-50">
            Xem thêm
          </span>
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute bottom-0 left-full ml-3 w-[266px] bg-ig-bg border border-ig-border rounded-2xl shadow-lg overflow-hidden py-2"
          >
            <MenuRow
              icon={Settings}
              label="Cài đặt"
              onClick={() => {
                navigate('/settings/account');
                setMenuOpen(false);
              }}
            />

            <ThemeMenuRow theme={theme} setTheme={setTheme} />

            <div className="my-2 h-px bg-ig-border" />

            <MenuRow
              icon={LogOut}
              label="Đăng xuất"
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
            />
          </div>
        )}
      </div>
    </aside>
  );
}

function MenuRow({
  icon: Icon,
  label,
  onClick,
  trailing,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-left text-ig-text hover:bg-ig-hover transition-colors"
      role="menuitem"
    >
      <Icon size={20} strokeWidth={1.75} />
      <span className="flex-1 text-[14px] font-medium">{label}</span>
      {trailing}
    </button>
  );
}

function ThemeMenuRow({
  theme,
  setTheme,
}: {
  theme: 'light' | 'dark' | 'system';
  setTheme: (t: 'light' | 'dark' | 'system') => void;
}) {
  const [open, setOpen] = useState(false);
  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left text-ig-text hover:bg-ig-hover transition-colors"
        role="menuitem"
        aria-expanded={open}
      >
        <Icon size={20} strokeWidth={1.75} />
        <span className="flex-1 text-[14px] font-medium">Giao diện</span>
        <span className="text-[12px] text-ig-muted capitalize">
          {theme === 'system' ? 'Hệ thống' : theme === 'dark' ? 'Tối' : 'Sáng'}
        </span>
      </button>

      {open && (
        <div className="px-2 pb-2">
          {(
            [
              { value: 'light', label: 'Sáng', icon: Sun },
              { value: 'dark', label: 'Tối', icon: Moon },
              { value: 'system', label: 'Hệ thống', icon: Monitor },
            ] as const
          ).map(({ value, label, icon: ThemeIcon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-[13px] transition-colors hover:bg-ig-hover ${
                theme === value ? 'text-ig-text font-semibold' : 'text-ig-muted'
              }`}
            >
              <ThemeIcon size={16} strokeWidth={1.75} />
              {label}
              {theme === value && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-ig-accent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
