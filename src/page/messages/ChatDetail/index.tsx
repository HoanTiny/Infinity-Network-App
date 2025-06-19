/* eslint-disable @typescript-eslint/no-explicit-any */
import UserAvatar from '@components/UserAvatar';
import { useUserInfo } from '@hooks/getUserinfo';
import { IconButton } from '@mui/material';
import { useGetMessagesQuery } from '@services/messagesApi';
import { useParams } from 'react-router-dom';
import MessageCreation from '../MessageCreation';
import { useGetUserProfileQuery } from '@services/userApi';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { throttle } from 'lodash';
import { socket } from '@context/SocketProvider';

const ChatDetail = () => {
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const { userId } = useParams<{ userId: string }>();
  const { data: userData } = useGetUserProfileQuery(userId);
  const textEndRef = useRef<HTMLDivElement>(null);
  const infoUser = useUserInfo();
  const currentUserId = infoUser?._id;
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [newMessageLoad, setNewMessageLoad] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [newMessagesNotification, setNewMessagesNotification] = useState(false);
  const {
    data = { messages: [], pagination: {} },
    isFetching,
    refetch,
  } = useGetMessagesQuery({
    userId,
    offset: offset,
    limit: limit,
  });

  useEffect(() => {
    console.log('offset', offset);
    if (textEndRef.current && offset === 0) {
      console.log('first scrollTop', textEndRef.current.scrollTop);
      textEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [userId, allMessages, offset]);

  useEffect(() => {
    console.log('oset', offset);

    refetch();
  }, [offset, refetch]);
  const loadMore = useCallback(async () => {
    setOffset((offset) => offset + limit);
  }, []);

  // Khi fetch thêm tin nhắn cũ
  useEffect(() => {
    if (data?.messages?.length && !newMessageLoad && hasMore) {
      setAllMessages((prev) => {
        // Tránh lặp tin nhắn
        const ids = new Set(prev.map((m) => m._id));
        const newMsgs = data.messages.filter((m: any) => !ids.has(m._id));
        // Nối vào đầu (vì load thêm tin nhắn cũ)
        const merged = [...newMsgs, ...prev];
        // Sắp xếp theo thời gian tăng dần
        return merged.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      if (allMessages.length >= data.pagination.total) {
        setHasMore(false);
      }
    }
  }, [data, userId, hasMore, allMessages.length, newMessageLoad]);

  // Khi gửi tin nhắn mới thành công
  const handleSendMessageSuccess = (newMessage: any) => {
    setAllMessages((prev) => {
      // Tránh lặp tin nhắn
      if (prev.some((m) => m._id === newMessage._id)) return prev;
      const merged = [...prev, newMessage];
      // Sắp xếp lại
      return merged.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
    setTimeout(() => {
      textEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const container = messagesContainerRef.current;
        if (!container || isFetching || !hasMore) return;
        if (container.scrollTop < 200) {
          loadMore();
          // Giữ vị trí cuộn hợp lý khi load thêm tin nhắn
          if (offset !== 0) {
            container.scrollTop += 400;
          }
        }
      }, 300),
    [isFetching, hasMore, loadMore, offset]
  );

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const groupedMessages = allMessages.reduce((acc: any, message: any) => {
    // Format time in 5-minute intervals
    const createdAt = dayjs(message.createdAt);
    const roundedMinutes = Math.floor(createdAt.minute() / 5) * 5;
    const formattedDateHour = createdAt
      .minute(roundedMinutes)
      .second(0)
      .format('HH:mm');

    const formattedDateDay = dayjs(message.createdAt).format('YYYY-MM-DD');

    const diff = dayjs(message.createdAt).diff(dayjs(), 'day');
    const date = diff === 0 ? formattedDateHour : formattedDateDay;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);

    return acc;
  }, {});

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      handleScroll.cancel();
    };
  }, [handleScroll]);

  useEffect(() => {
    console.log('allMessages', allMessages);
  }, [allMessages]);

  socket.on('SEND_MESSAGE', () => {
    if (messagesContainerRef.current) {
      setNewMessagesNotification(true);
    }
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between p-4 mb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-3">
          <UserAvatar src={userData?.image} />
          <h3>{userData?.fullName}</h3>
        </div>
        <div className="flex items-center gap-2">
          <IconButton>
            <img src="/icons/phone-call.svg" alt="Phone" className="w-6 h-6" />
          </IconButton>
          <IconButton>
            <img src="/icons/video.svg" alt="Video" className="w-6 h-6" />
          </IconButton>
        </div>
      </div>
      <div className="rounded-lg p-4 overflow-y-auto flex flex-col  flex-1">
        {/* Messages will go here */}
        <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
          {isFetching && offset > 0 && (
            <div className="text-center text-gray-400 py-2">
              Đang tải tin nhắn...
            </div>
          )}
          {Object.entries(groupedMessages).map(([date, messages]: any) => (
            <div key={date} className="mb-4">
              <div className="text-gray-500 text-sm mb-2 text-center p-4">
                {date}
              </div>
              {messages.map((message: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-start mb-2 gap-2  ${
                    message.sender._id === currentUserId ? 'justify-end' : ''
                  }`}
                >
                  {message.sender._id !== currentUserId && (
                    <UserAvatar src={message.sender.image} />
                  )}
                  <div
                    className={`ml-2 p-2 px-3 rounded-3xl max-w-lg relative min-w-[50px] ${
                      message.sender._id === currentUserId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100'
                    }`}
                    onMouseEnter={() => setActiveHover(message._id)}
                    onMouseLeave={() => setActiveHover(null)}
                  >
                    <p className="w-full">{message.message}</p>
                    {activeHover === message._id && (
                      <div
                        className={`absolute top-0  bg-gray-200 p-3 rounded-lg text-xs text-gray-400 ${
                          message.sender._id !== currentUserId
                            ? 'right-[-128px]'
                            : '-left-[58px]'
                        }`}
                      >
                        {/* Example hover actions or info */}
                        <span>
                          {dayjs().diff(dayjs(message.createdAt), 'day') > 0
                            ? dayjs(message.createdAt).format(
                                ' HH:mm, DD:MM:YYYY'
                              )
                            : dayjs(message.createdAt).format('HH:mm')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={textEndRef} />
        </div>

        {newMessagesNotification && (
          <div
            className="fixed bottom-20 right-4 bg-blue-300 text-white
          p-3 rounded-xl shadow-lg z-50"
            onClick={() => {
              setNewMessagesNotification(false);
              textEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
              });
            }}
          >
            New messages received ⬇️
          </div>
        )}

        <MessageCreation
          userId={userId}
          ref={textEndRef}
          setNewMessageLoad={setNewMessageLoad}
          onSendSuccess={handleSendMessageSuccess}
        />
      </div>
    </div>
  );
};

export default ChatDetail;
