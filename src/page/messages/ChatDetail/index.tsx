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
import { useVirtualizer } from '@tanstack/react-virtual';

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
  const [hasMore, setHasMore] = useState(true);
  const [newMessagesNotification, setNewMessagesNotification] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [refetchData, setRefetchData] = useState<any>(null);

  const {
    data = { messages: [], pagination: {} },
    isFetching,
    refetch,
  } = useGetMessagesQuery({
    userId,
    offset,
    limit,
  });

  // Reset state khi userId đổi
  useEffect(() => {
    setAllMessages([]);
    setOffset(0);
    setHasMore(true);
    setRefetchData(true);
  }, [userId, setRefetchData]);

  // Khi data mới về, cập nhật refetchData để tránh lỗi stale-while-revalidate
  useEffect(() => {
    if (refetchData) {
      refetch();
      setOffset(0);

      setRefetchData(null);
    }
  }, [refetchData, refetch]);

  // Khi data mới về và offset = 0 (lần đầu load hoặc đổi userId), cập nhật allMessages
  useEffect(() => {
    if (
      offset === 0 &&
      data?.messages &&
      (allMessages.length !== data.messages.length ||
        allMessages[0]?._id !== data.messages[0]?._id)
    ) {
      setAllMessages(data.messages);
      setHasMore((data.pagination?.total || 0) > data.messages.length);
    }
    // eslint-disable-next-line
  }, [offset, data.messages]);

  // Khi offset > 0 (load more), merge thêm messages vào đầu danh sách
  useEffect(() => {
    if (offset > 0 && data?.messages?.length) {
      setAllMessages((prev) => {
        const ids = new Set(prev.map((m) => m._id));
        const newMsgs = data.messages.filter((m: any) => !ids.has(m._id));
        const merged = [...newMsgs, ...prev];
        return merged.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      // Kiểm tra còn load nữa không
      if ((data.pagination?.total || 0) <= offset + data.messages.length) {
        setHasMore(false);
      }
    }
    // eslint-disable-next-line
  }, [data, offset]);

  // Khi offset > 0, chỉ gọi refetch nếu hasMore vẫn còn true
  useEffect(() => {
    if (offset > 0 && hasMore) {
      refetch();
    }
  }, [offset, hasMore, refetch]);

  // Scroll xuống cuối khi đổi userId hoặc gửi tin nhắn mới
  useEffect(() => {
    if (textEndRef.current && offset === 0) {
      textEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, [allMessages, offset, userId]);

  const loadMore = useCallback(() => {
    setOffset((prev) => prev + limit);
  }, []);

  // Throttled scroll handler for loading more messages
  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const container = messagesContainerRef.current;
        if (!container || isFetching || !hasMore) return;
        if (container.scrollTop < 200) {
          loadMore();
          setTimeout(() => {
            if (container) container.scrollTop += 400;
          }, 100);
        }
      }, 300),
    [isFetching, hasMore, loadMore]
  );

  // Group messages by day or 5-minute interval
  const groupedMessages = useMemo(() => {
    return allMessages.reduce((acc: any, message: any) => {
      const createdAt = dayjs(message.createdAt);
      const roundedMinutes = Math.floor(createdAt.minute() / 5) * 5;
      const formattedDateHour = createdAt
        .minute(roundedMinutes)
        .second(0)
        .format('HH:mm');
      const formattedDateDay = createdAt.format('YYYY-MM-DD');
      const diff = createdAt.diff(dayjs(), 'day');
      const date = diff === 0 ? formattedDateHour : formattedDateDay;
      if (!acc[date]) acc[date] = [];
      acc[date].push(message);
      return acc;
    }, {});
  }, [allMessages]);

  // Flatten groupedMessages thành 1 mảng để virtualize
  const flatMessages = useMemo(() => {
    const arr: any[] = [];
    Object.entries(groupedMessages).forEach(([date, messages]: any) => {
      arr.push({ type: 'date', date });
      messages.forEach((msg: any) => arr.push({ type: 'msg', ...msg }));
    });
    return arr;
  }, [groupedMessages]);

  // TanStack Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: flatMessages.length,
    getScrollElement: () => messagesContainerRef.current,
    estimateSize: () => 72,
    overscan: 10,
  });

  // Tự động scroll tới cuối khi mở chat hoặc đổi userId
  useEffect(() => {
    if (offset === 0 && flatMessages.length > 0) {
      rowVirtualizer.scrollToIndex(flatMessages.length - 1, { align: 'end' });
    }
  }, [flatMessages.length, offset, userId]);

  // Attach/detach scroll event
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

  // Listen for new messages via socket
  useEffect(() => {
    const handleSocketMessage = () => {
      setNewMessagesNotification(true);
    };

    socket.on('SEND_MESSAGE', handleSocketMessage);
    return () => {
      socket.off('SEND_MESSAGE', handleSocketMessage);
    };
  }, []);

  // Handle sending new message
  // const handleSendMessageSuccess = (newMessage: any) => {
  //   // setAllMessages((prev) => {
  //   //   if (prev.some((m) => m._id === newMessage._id)) return prev;
  //   //   const merged = [...prev, newMessage];
  //   //   return merged.sort(
  //   //     (a, b) =>
  //   //       new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  //   //   );
  //   // });

  //   console.log('Có tin nhắn mới:', newMessage);
  //   setTimeout(() => {
  //     if (textEndRef.current) {
  //       console.log('vô scroll vào cuối');
  //       textEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
  //     }
  //   }, 100);
  // };

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
      <div className="rounded-lg p-4 overflow-y-auto flex flex-col flex-1">
        <div
          className="flex-1 overflow-y-auto relative"
          ref={messagesContainerRef}
          style={{ height: '100%' }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
              width: '100%',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = flatMessages[virtualRow.index];
              if (item.type === 'date') {
                return (
                  <div
                    key={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                      zIndex: 1,
                    }}
                    className="text-gray-500 text-sm mb-2 text-center p-4"
                  >
                    {item.date}
                  </div>
                );
              }
              // Render message như cũ
              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={`flex items-start mb-2 gap-2  ${
                    item.sender._id === currentUserId ? 'justify-end' : ''
                  }`}
                >
                  {item.sender._id !== currentUserId && (
                    <UserAvatar src={item.sender.image} />
                  )}
                  <div
                    className={`ml-2 p-2 px-3 rounded-3xl max-w-lg relative min-w-[50px] ${
                      item.sender._id === currentUserId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100'
                    }`}
                    onMouseEnter={() => setActiveHover(item._id)}
                    onMouseLeave={() => setActiveHover(null)}
                  >
                    <p className="w-full">{item.message}</p>
                    {activeHover === item._id && (
                      <div
                        className={`absolute top-0  bg-gray-200 p-3 rounded-lg text-xs text-gray-400 ${
                          item.sender._id !== currentUserId
                            ? 'right-[-128px]'
                            : '-left-[58px]'
                        }`}
                      >
                        <span>
                          {dayjs().diff(dayjs(item.createdAt), 'day') > 0
                            ? dayjs(item.createdAt).format(' HH:mm, DD:MM:YYYY')
                            : dayjs(item.createdAt).format('HH:mm')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
          // onSendSuccess={handleSendMessageSuccess}
        />
      </div>
    </div>
  );
};

export default ChatDetail;
