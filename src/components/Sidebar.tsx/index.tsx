/* eslint-disable @typescript-eslint/no-explicit-any */
import UserAvatar from '@components/UserAvatar';
import { useUserInfo } from '@hooks/getUserinfo';
import { useMediumScreen } from '@hooks/index';
import { Close } from '@mui/icons-material';
import { Drawer, IconButton, Typography } from '@mui/material';
import { toggleDrawer } from '@redux/slice/settingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const dispatch = useDispatch();
  const mediumScreen = useMediumScreen();
  const location = useLocation();
  const isShowDrawer = useSelector((store: any) => store.settings.IsShowDrawer);
  const userInfo = useUserInfo();

  console.log('store settings: ', userInfo);

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => {
    return (
      <div className="flex-col flex h-[90vh]">
        {/* Header - chỉ hiện trên mobile */}
        {mediumScreen && (
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <img src="/img/Logo2.svg" alt="logo" className="w-8 h-8" />
              <Typography className="text-lg font-semibold text-gray-800">
                Menu
              </Typography>
            </div>
            <IconButton
              onClick={() => dispatch(toggleDrawer())}
              className="hover:bg-gray-100 transition-colors duration-200"
              size="small"
            >
              <Close className="text-gray-600" />
            </IconButton>
          </div>
        )}

        {/* Main Navigation */}
        <div className="flex-1 py-2">
          {/* User Profile Section */}
          <div className="px-2 mb-4">
            <Link
              to={`/user/${userInfo?._id}`}
              state={{ from: 'sidebar' }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
            >
              <UserAvatar isMyAvatar />
              <Typography className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                {userInfo?.fullName || 'Your Name'}
              </Typography>
            </Link>
          </div>

          {/* Main Menu Items */}
          <div className="px-2 space-y-1">
            <Link
              to="/"
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group ${
                isActive('/')
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  isActive('/')
                    ? 'bg-blue-500'
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}
              >
                <img
                  src="/icons/news.svg"
                  alt="News Feed"
                  className={`w-5 h-5 ${
                    isActive('/') ? 'filter brightness-0 invert' : ''
                  }`}
                />
              </div>
              <Typography
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/')
                    ? 'text-blue-600'
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}
              >
                News Feed
              </Typography>
            </Link>

            <Link
              to="/messages"
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group ${
                isActive('/messages')
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  isActive('/messages')
                    ? 'bg-blue-500'
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}
              >
                <img
                  src="/icons/brand-messenger.svg"
                  alt="Messenger"
                  className={`w-5 h-5 ${
                    isActive('/messages') ? 'filter brightness-0 invert' : ''
                  }`}
                />
              </div>
              <Typography
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/messages')
                    ? 'text-blue-600'
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}
              >
                Messenger
              </Typography>
              {/* Badge for unread messages */}
              <div className="ml-auto">
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  3
                </span>
              </div>
            </Link>

            <Link
              to="/friends"
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group ${
                isActive('/friends')
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  isActive('/friends')
                    ? 'bg-blue-500'
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}
              >
                <img
                  src="/icons/friends.svg"
                  alt="Friends"
                  className={`w-5 h-5 ${
                    isActive('/friends') ? 'filter brightness-0 invert' : ''
                  }`}
                />
              </div>
              <Link to={`/user/${userInfo?._id}/friends`}>
                <Typography
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/friends')
                      ? 'text-blue-600'
                      : 'text-gray-700 group-hover:text-gray-900'
                  }`}
                >
                  Friends
                </Typography>
              </Link>
            </Link>

            <Link
              to="/groups"
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group ${
                isActive('/groups')
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  isActive('/groups')
                    ? 'bg-blue-500'
                    : 'bg-gray-100 group-hover:bg-blue-100'
                }`}
              >
                <img
                  src="/icons/groups.svg"
                  alt="Groups"
                  className={`w-5 h-5 ${
                    isActive('/groups') ? 'filter brightness-0 invert' : ''
                  }`}
                />
              </div>
              <Typography
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/groups')
                    ? 'text-blue-600'
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}
              >
                Groups
              </Typography>
            </Link>
          </div>

          {/* Divider */}
          <div className="mx-4 my-4 border-t border-gray-200"></div>

          {/* Settings Section */}
          <div className="px-2">
            <Typography className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
              Settings & Privacy
            </Typography>

            <div className="space-y-1">
              <Link
                to="/profiles"
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group ${
                  isActive('/profiles')
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isActive('/profiles')
                      ? 'bg-blue-500'
                      : 'bg-gray-100 group-hover:bg-blue-100'
                  }`}
                >
                  <img
                    src="/icons/settings.svg"
                    alt="Account"
                    className={`w-5 h-5 ${
                      isActive('/profiles') ? 'filter brightness-0 invert' : ''
                    }`}
                  />
                </div>
                <Link to={`settings/account`}>
                  <Typography
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive('/profiles')
                        ? 'text-blue-600'
                        : 'text-gray-700 group-hover:text-gray-900'
                    }`}
                  >
                    Account Settings
                  </Typography>
                </Link>
              </Link>

              <Link
                to="/languages"
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group ${
                  isActive('/languages')
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isActive('/languages')
                      ? 'bg-blue-500'
                      : 'bg-gray-100 group-hover:bg-blue-100'
                  }`}
                >
                  <img
                    src="/icons/language.svg"
                    alt="Languages"
                    className={`w-5 h-5 ${
                      isActive('/languages') ? 'filter brightness-0 invert' : ''
                    }`}
                  />
                </div>
                <Typography
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/languages')
                      ? 'text-blue-600'
                      : 'text-gray-700 group-hover:text-gray-900'
                  }`}
                >
                  Language & Region
                </Typography>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer - chỉ hiện trên desktop */}
        {!mediumScreen && (
          <div className="px-4 py-3 border-t border-gray-200">
            <Typography className="text-xs text-gray-500 text-center">
              © 2024 Your App Name
            </Typography>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {mediumScreen ? (
        <Drawer
          variant="temporary"
          open={isShowDrawer}
          onClose={() => dispatch(toggleDrawer())}
          PaperProps={{
            className: 'w-80 border-r border-gray-200',
            style: { width: 320 },
          }}
        >
          <SidebarContent />
        </Drawer>
      ) : (
        <div className="w-80 h-full   sticky top-20">
          <SidebarContent />
        </div>
      )}
    </>
  );
}

export default Sidebar;
