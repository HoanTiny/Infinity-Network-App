/* eslint-disable @typescript-eslint/no-explicit-any */
import UserAvatar from '@components/UserAvatar';
import { useUserInfo } from '@hooks/getUserinfo';
import { IconButton } from '@mui/material';
import { useGetMessagesQuery } from '@services/messagesApi';
import { useParams } from 'react-router-dom';
import MessageCreation from '../MessageCreation';
import { useGetUserProfileQuery } from '@services/userApi';
import { useRef, useState } from 'react';
import dayjs from 'dayjs';

const ChatDetail = () => {
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const { userId } = useParams<{ userId: string }>();
  const { data: userData } = useGetUserProfileQuery(userId);
  const textEndRef = useRef<HTMLDivElement>(null);
  console.log('User Data:', userData);
  const infoUser = useUserInfo();
  const currentUserId = infoUser?._id;
  const { data = { messages: [], pagination: {} } } = useGetMessagesQuery({
    userId,
    offset: 0,
    limit: 20,
  });

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

  console.log('groupedMessages:', groupedMessages);

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
        <div className="flex-1 overflow-y-auto">
          {Object.entries(groupedMessages).map(([date, messages]: any) => (
            <div key={date} className="mb-4">
              <div className="text-gray-500 text-sm mb-2 text-center p-4">
                {date}
              </div>
              {messages.map((message: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-start mb-2 gap-2 ${
                    message.sender._id === currentUserId ? 'justify-end' : ''
                  }`}
                >
                  {message.sender._id !== currentUserId && (
                    <UserAvatar src={message.sender.image} />
                  )}
                  <div
                    className={`ml-2 p-2 rounded-lg max-w-lg relative ${
                      message.sender._id === currentUserId
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}
                    onMouseEnter={() => setActiveHover(message._id)}
                    onMouseLeave={() => setActiveHover(null)}
                  >
                    <p>{message.message}</p>
                    {activeHover === message._id && (
                      <div
                        className={`absolute top-0  bg-gray-200 p-3 rounded-lg text-xs text-gray-400 ${
                          message.sender._id !== currentUserId
                            ? 'right-[-150%]'
                            : '-left-[58px]'
                        }`}
                      >
                        {/* Example hover actions or info */}
                        <span>
                          {dayjs().diff(dayjs(message.createdAt), 'day') > 0
                            ? dayjs(message.createdAt).format(
                                'DD:MM:YYYY, HH:mm'
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

        {/* <div className="flex-1 overflow-y-auto">
          {data.messages.map((message: any, index: number) => {
            return (
              <div className="mb-4 flex-1">
                <div
                  key={index}
                  className={`flex items-start mb-2 gap-2 ${
                    message.sender._id === currentUserId ? 'justify-end' : ''
                  }`}
                >
                  {message.sender._id !== currentUserId && (
                    <UserAvatar src={message.sender.image} />
                  )}
                  <div
                    className={`ml-2 p-2 rounded-lg max-w-lg ${
                      message.sender._id === currentUserId
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    <p>{message.message}</p>
                  </div>
                </div>
                <div ref={textEndRef} />
              </div>
            );
          })}
        </div> */}
        <MessageCreation userId={userId} ref={textEndRef} />
      </div>
    </div>
  );
};

export default ChatDetail;
