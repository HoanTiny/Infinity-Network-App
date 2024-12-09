import { useUserInfo } from '@hooks/getUserinfo';
import { useLogout } from '@hooks/useLogout';
import { Search } from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Input,
  Menu,
  MenuItem,
  //   TextField,
  Toolbar,
} from '@mui/material';
import React from 'react';
function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const infoUser = useUserInfo();
  const logout = useLogout();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem
        onClick={() => {
          logout();
        }}
      >
        Log out
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" className="">
        <Toolbar className="!min-h-fit justify-between">
          {/* Logo1 */}
          <div className="flex items-center gap-4">
            <img src="/img/Logo2.svg" alt="logo" className="w-8 h-8" />
            <div className="flex items-center gap-1">
              <Search />
              <Input placeholder="Search" />
            </div>
          </div>

          <div>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ bgcolor: '#246AA3 ' }}>
                {infoUser.fullName?.[0]}
              </Avatar>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
}

export default Header;
