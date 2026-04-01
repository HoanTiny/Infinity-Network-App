import NotificationsPanel from '@components/NotificationsPanel.tsx';
import UserAvatar from '@components/UserAvatar';
import { useUserInfo } from '@hooks/getUserinfo';
import { useMediumScreen } from '@hooks/index';
import { AddBoxOutlined, MailOutline } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const mediumScreen = useMediumScreen();
  const infoUser = useUserInfo();

  // Nếu là mobile, không hiển thị gì vì đã có sidebar drawer
  if (mediumScreen) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 left-60 h-16 bg-white border-b border-gray-100 z-40">
      <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Empty left side */}
        <div className="flex-1"></div>

        {/* Right Icons - Instagram Style */}
        <div className="flex items-center gap-1">
          {/* Create */}
          <Tooltip title="Create" arrow>
            <IconButton
              className="hover:bg-gray-100 transition-colors"
              onClick={() => {
                // Open create post
              }}
            >
              <AddBoxOutlined className="text-gray-800" />
            </IconButton>
          </Tooltip>

          {/* Messages */}
          <Tooltip title="Messages" arrow>
            <IconButton
              className="hover:bg-gray-100 transition-colors relative"
              onClick={() => navigate('/messages')}
            >
              <MailOutline className="text-gray-800" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <NotificationsPanel />

          {/* Profile */}
          <Tooltip title="Profile" arrow>
            <IconButton
              className="hover:bg-gray-100 transition-colors"
              onClick={() => navigate(`/user/${infoUser._id}`)}
            >
              <UserAvatar isMyAvatar={true} size="sm" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default Header;
