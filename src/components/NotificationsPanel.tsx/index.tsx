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
  Tooltip,
} from '@mui/material';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';
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
      <Tooltip title="Notifications" arrow>
        <IconButton size="large" onClick={handleOpen} className="hover:bg-gray-100 transition-colors">
          <Badge badgeContent={newCount} color="error">
            <NotificationsNoneOutlined className="text-gray-800" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: Paper,
          elevation: 4,
          sx: {
            minWidth: 368,
            maxHeight: 500,
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #dbdbdb',
            mt: 1.5,
            '& .MuiMenu-list': {
              p: 0,
            },
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #efefef' }}>
          <Typography variant="h6" fontWeight={600} fontSize={16}>
            Notifications
          </Typography>
        </Box>

        <List disablePadding sx={{ p: 0 }}>
          {notifications.length === 0 && (
            <ListItemButton
              onClick={handleClose}
              sx={{ justifyContent: 'center', py: 4 }}
            >
              <Typography variant="body2" color="text.secondary" fontSize={14}>
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
                      handleClose();
                      if (note.like || note.comment) {
                        navigate(`/posts/${note.post}`, {
                          state: { background: location },
                        });
                      } else {
                        navigate(`messages/${note.author._id}`);
                      }
                    }}
                    sx={{
                      alignItems: 'flex-start',
                      backgroundColor: note.seen ? '#fff' : '#fafafa',
                      px: 3,
                      py: 2,
                      '&:hover': {
                        backgroundColor: note.seen ? '#fafafa' : '#f0f0f0',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <div className="story-ring p-0.5">
                        <div className="bg-white p-0.5 rounded-full">
                          <UserAvatar
                            src={note.author?.image}
                            fullName={note.author?.fullName}
                            size="md"
                          />
                        </div>
                      </div>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          fontWeight={note.seen ? 400 : 600}
                          fontSize={14}
                          sx={{
                            display: 'inline',
                          }}
                        >
                          <Link
                            to={`/user/${note.author?._id}`}
                            style={{ textDecoration: 'none', color: 'inherit', fontWeight: note.seen ? 400 : 600 }}
                          >
                            {note.author?.fullName}{' '}
                          </Link>
                          <Typography
                            component="span"
                            variant="body2"
                            fontWeight={note.seen ? 400 : 600}
                            fontSize={14}
                          >
                            {note.like
                              ? 'liked your post'
                              : note.comment
                              ? 'commented on your post'
                              : note.message
                              ? 'sent you a message'
                              : 'reacted to your post'}{' '}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="primary"
                            fontSize={12}
                            sx={{
                              ml: 0.5,
                              textDecoration: 'none',
                            }}
                          >
                            View
                          </Typography>
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" fontSize={12}>
                          <TimeAgo date={note.createdAt} />
                        </Typography>
                      }
                      sx={{
                        ml: 2,
                        '& .MuiListItemText-secondary': {
                          mt: 0.5,
                        },
                      }}
                    />

                    {!note.seen && (
                      <Badge
                        variant="dot"
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': { right: 4, top: 16 },
                          marginLeft: 'auto',
                        }}
                      />
                    )}
                  </ListItemButton>
                  <Divider component="li" sx={{ my: 0, ml: 14 }} />
                </Box>
              )
          )}
        </List>
      </Menu>
    </Box>
  );
};

export default NotificationsPanel;
