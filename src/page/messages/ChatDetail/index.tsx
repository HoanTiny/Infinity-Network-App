/* eslint-disable @typescript-eslint/no-explicit-any */
import UserAvatar from '@components/UserAvatar';
import { useUserInfo } from '@hooks/getUserinfo';
import { IconButton } from '@mui/material';
import { useGetMessagesQuery } from '@services/messagesApi';
import { useParams } from 'react-router-dom';
import MessageCreation from '../MessageCreation';
import { useGetUserProfileQuery } from '@services/userApi';
import { useRef } from 'react';
// import dayjs from 'dayjs';

const ChatDetail = () => {
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
        </div>
        <MessageCreation userId={userId} ref={textEndRef} />
      </div>
    </div>
  );
};

export default ChatDetail;
