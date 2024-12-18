/* eslint-disable @typescript-eslint/no-explicit-any */
import { Close } from '@mui/icons-material';
import {
  Drawer,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { toggleDrawer } from '@redux/slice/settingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { store } from '@redux/store';
function Sidebar() {
  const dispacth = useDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isShowDrawer = useSelector((store: any) => store.settings.IsShowDrawer);
  console.log('store settings: ', isShowDrawer);
  console.log('isMobile', isMobile);

  const SidebarContent = () => {
    return (
      <div className="flex-col flex gap-4 ">
        {isMobile && (
          <div className="flex justify-between px-[14px] py-2 items-center">
            <img src="/img/Logo2.svg" alt="logo" className="w-8 h-8" />
            <IconButton onClick={() => dispacth(toggleDrawer())}>
              <Close />
            </IconButton>
          </div>
        )}

        <div className="w-64 bg-[#FFFFFF] shadow-4xl text-xxs rounded-[12px] px-[14px] py-3">
          <Link to="/" className="flex p-3  gap-2">
            <img src="/icons/news.svg" alt="" />
            New Feeds
          </Link>
          <Link to="/messages" className="flex p-3 gap-2">
            <img src="/icons/brand-messenger.svg" alt="" />
            Messenger
          </Link>
          <Link to="/friends" className="flex p-3 gap-2">
            <img src="/icons/friends.svg" alt="" />
            Friends
          </Link>
          <Link to="/groups" className="flex p-3 gap-2">
            <img src="/icons/groups.svg" alt="" />
            Groups
          </Link>
        </div>

        <div className="w-64 bg-[#FFFFFF] shadow-4xl text-xxs rounded-[12px]">
          <Typography
            sx={{
              color: '#4B465C',
              fontSize: '15px',
              padding: '19px 30px 5px 30px',
            }}
            className="p-3 text-[12px]"
          >
            Setting
          </Typography>
          <div className="px-[14px]">
            <Link to="/profiles" className="flex p-3  gap-2">
              <img src="/icons/settings.svg" alt="" />
              Account
            </Link>
            <Link to="/languages" className="flex p-3 gap-2">
              <img src="/icons/language.svg" alt="" />
              Languages
            </Link>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isShowDrawer}
          onClose={() => dispacth(toggleDrawer())}
        >
          <SidebarContent />
        </Drawer>
      ) : (
        <SidebarContent />
      )}
    </>
  );
}

export default Sidebar;
