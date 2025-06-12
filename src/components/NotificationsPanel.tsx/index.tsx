/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  Badge,
  Box,
  IconButton,
  Menu,
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useGetNotificationsQuery } from '@services/notificationApi';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserAvatar from '@components/UserAvatar';
import TimeAgo from '@components/TimeAgo';
import { useUserInfo } from '@hooks/getUserinfo';

const NotificationsPanel = () => {
  const userInfo = useUserInfo();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useGetNotificationsQuery() as {
    data: { notifications: any[] };
    refetch: () => void;
  };
  const notifications = data?.notifications || [];
  const newCount = notifications.filter(
    (n) => n.author._id !== userInfo._id
  ).length;
  console.log('notifications', notifications, location);
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

          {notifications.map(
            (note) =>
              note.author._id !== userInfo?._id && (
                <Box key={note._id}>
                  <ListItemButton
                    onClick={() => {
                      // dispatch(
                      //   openDialog({
                      //     title: `Bài viết của ${note.author?.fullName}`,
                      //     content: 'POST_DETAIL_DIALOG',
                      //     data: note,

                      //     actions: 'Post',
                      //     maxWidth: 'md',
                      //     fullWidth: true,
                      //   })
                      // );
                      handleClose();
                      if (note.like || note.comment) {
                        navigate(`/posts/${note.post}`, {
                          state: { background: location }, // Lưu lại trang hiện tại
                        });
                      } else {
                        navigate(`messages/${note.author._id}`);
                      }
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
                      <UserAvatar
                        src={note.author?.image}
                        fullName={note.author?.fullName}
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          fontWeight={note.seen ? 400 : 600}
                        >
                          <Link
                            to={`/user/${note.author?._id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                          >
                            {note.author?.fullName}{' '}
                            {note.like
                              ? 'liked your post'
                              : note.comment
                              ? 'commented on your post'
                              : note.message
                              ? 'sent you a message'
                              : 'reacted to your post'}{' '}
                          </Link>
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {/* {new Date(note.createdAt).toLocaleString()} */}
                          <TimeAgo date={note.createdAt} />
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
              )
          )}
        </List>
      </Menu>
    </Box>
  );
};

export default NotificationsPanel;
