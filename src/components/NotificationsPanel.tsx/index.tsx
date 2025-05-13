/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Box,
  IconButton,
  Menu,
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CircleIcon from '@mui/icons-material/FiberManualRecord';
import { useGetNotificationsQuery } from '@services/notificationApi';
import { useState } from 'react';

const NotificationsPanel = () => {
  const { data } = useGetNotificationsQuery() as {
    data: { notifications: any[] };
  };
  const notifications = data?.notifications || [];
  const newCount = notifications.filter((n) => !n.seen).length;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box>
      <IconButton size="large" color="inherit" onClick={handleOpen}>
        <Badge badgeContent={newCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: Paper,
          elevation: 4,
          sx: {
            minWidth: 300,
            maxHeight: 400,
            borderRadius: 2,
            overflow: 'auto',
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
        </Box>

        <List disablePadding>
          {notifications.length === 0 && (
            <ListItemButton
              onClick={handleClose}
              sx={{ justifyContent: 'center' }}
            >
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </ListItemButton>
          )}

          {notifications.map((note) => (
            <Box key={note._id}>
              <ListItemButton
                onClick={() => {
                  // handle click (e.g., mark as seen, navigate)
                  handleClose();
                }}
                sx={{
                  alignItems: 'flex-start',
                  backgroundColor: note.seen
                    ? 'background.paper'
                    : 'action.hover',
                  px: 2,
                  py: 1.5,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{ bgcolor: note.like ? 'error.main' : 'primary.main' }}
                  >
                    {note.like ? (
                      <FavoriteIcon fontSize="small" />
                    ) : (
                      <CircleIcon fontSize="small" />
                    )}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      fontWeight={note.seen ? 400 : 600}
                    >
                      {note.author?.fullName}{' '}
                      {note.like ? 'liked' : 'reacted to'} your post
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.createdAt).toLocaleString()}
                    </Typography>
                  }
                />

                {!note.seen && (
                  <Badge
                    variant="dot"
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': { right: 4, top: 16 },
                      marginLeft: '21px',
                    }}
                  />
                )}
              </ListItemButton>
              <Divider component="li" sx={{ my: 0 }} />
            </Box>
          ))}
        </List>
      </Menu>
    </Box>
  );
};

export default NotificationsPanel;
