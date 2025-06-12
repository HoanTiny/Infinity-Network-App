/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import generateNotificationMessage from '@libs/utils';
import { AppDispatch } from '@redux/store';
import { notificationsApi } from '@services/notificationApi';
// import { rootApi } from '@services/rootApi';
import { useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUserInfo } from '@hooks/getUserinfo';
import UserAvatar from '@components/UserAvatar';
import { messagesApi } from '@services/messagesApi';

interface SocketProviderProps {
  children: ReactNode;
}

export const socket = io('https://api.holetex.com', {
  autoConnect: false,
  path: '/v1/we-connect/socket.io',
});
function SocketProvider({ children }: SocketProviderProps) {
  const token = useSelector((state: any) => state.auth.accessToken);
  const dispatch = useDispatch<AppDispatch>();
  const infoUser = useUserInfo(); // Ensure user info is fetched

  // console.log('first render SocketProvider', token, infoUser);

  useEffect(() => {
    socket.auth = { token };

    if (token) {
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    socket.on('CREATE_NOTIFICATION_REQUEST', (data: any) => {
      console.log('datacheck 544444444444', data);
      dispatch(
        notificationsApi.util.updateQueryData(
          'getNotifications',
          undefined,
          (draft: any) => {
            draft.notifications.unshift(data);
          }
        )
      );

      if (data?.author?._id !== infoUser?._id) {
        console.log('zô toast', data);
        toast.info(
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: 'Segoe UI, Arial, sans-serif',
              fontWeight: 400,
              fontSize: 15,
              color: '#050505',
              padding: '8px',
              borderRadius: 8,
            }}
          >
            <UserAvatar
              src={data?.author?.image}
              fullName={data?.author?.fullName}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: '#050505', fontSize: 15 }}>
                New notification
              </div>
              <div
                style={{
                  color: '#65676b',
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 260,
                }}
              >
                {generateNotificationMessage(data)}
              </div>
            </div>
          </div>,
          {
            position: 'bottom-right',
            autoClose: 3000,

            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              background: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: 8,
              padding: 0,
              minWidth: 340,
              maxWidth: 420,
              border: '1px solid #e4e6eb',
            },
            icon: false,
            theme: 'light',
            // customProgressBar: true,
          }
        );
      }
      // Hiển thị toast giống Facebook
    });

    socket.on('SEND_MESSAGE', (data) => {
      console.log('SEND_MESSAGE', data);
      dispatch(
        messagesApi.util.updateQueryData(
          'getMessages',
          { userId: data?.sender?._id },
          (draft: any) => {
            draft.messages.push(data);
          }
        )
      );

      dispatch(
        messagesApi.util.updateQueryData(
          'getConversations',
          {},
          (draft: any) => {
            console.log('getConversations: ', JSON.stringify(draft));
            const currentConversationIndex = draft.findIndex((mess: any) => {
              return (
                mess.receiver._id === data.sender._id ||
                mess.sender._id === data.sender._id
              );
            });

            console.log('currecurrentConversation:, ', {
              currentConversationIndex,
            });

            if (currentConversationIndex != -1) {
              draft.splice(currentConversationIndex, 1);
            }

            draft.unshift(data);
          }
        )
      );
    });
    return () => {
      socket.off('CREATE_NOTIFICATION_REQUEST');
    };
  }, [dispatch]);

  return <>{children}</>;
}

export default SocketProvider;
