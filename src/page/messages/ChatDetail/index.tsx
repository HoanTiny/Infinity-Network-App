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

const ChatDetail = () => {
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const { userId } = useParams<{ userId: string }>();
  const { data: userData } = useGetUserProfileQuery(userId);
  const textEndRef = useRef<HTMLDivElement>(null);
  const infoUser = useUserInfo();
  const currentUserId = infoUser?._id;
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data = { messages: [], pagination: {} } } = useGetMessagesQuery({
    userId,
    offset: offset,
    limit: limit,
  });

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const groupedMessages = data.messages.reduce((acc: any, message: any) => {
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
    if (textEndRef.current) {
      textEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [userId, data]);

  const loadMore = useCallback(async () => {
    setOffset((offset) => offset + limit);
  }, []);

  const handleScroll = useMemo(() => {
    return throttle(() => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          messagesContainerRef.current;
        console.log('Chat scroll:', scrollTop, clientHeight, scrollHeight);
        // Xử lý logic ở đây, ví dụ: load thêm tin nhắn khi scroll lên đầu

        if (scrollTop < 100 && offset) {
          loadMore();
        }
      }
    }, 300);
  }, [offset]);
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

        <MessageCreation userId={userId} ref={textEndRef} />
      </div>
    </div>
  );
};

export default ChatDetail;
