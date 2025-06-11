/* eslint-disable @typescript-eslint/no-explicit-any */
import TimeAgo from '@components/TimeAgo';
import UserAvatar from '@components/UserAvatar';
import { useUserInfo } from '@hooks/getUserinfo';
import { Circle } from '@mui/icons-material';
import {
  useGetConversationsQuery,
  useMarkConversationAsSeenMutation,
} from '@services/messagesApi';
import { Link, useParams } from 'react-router-dom';

const ListConverstation = () => {
  const { data, isLoading, error } = useGetConversationsQuery({});
  const infoUser = useUserInfo();
  const { userId: activeUserId } = useParams<{ userId: string }>();
  const [markConversationAsSeen] = useMarkConversationAsSeenMutation();
  console.log('Data conversations:', data, infoUser);
  return (
    <div className="card ">
      {/* Searhc Messages */}
      <div className="flex items-center justify-between  rounded-lg ">
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        {/* <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Search
          </button> */}
      </div>
      <div>
        <h3 className="p-2">Chats</h3>
        {/* List of friends or chats */}
        <ul className="list-none p-0">
          {isLoading && <li className="p-2 text-gray-500">Loading...</li>}
          {error && (
            <li className="p-2 text-red-500">Failed to load conversations.</li>
          )}
          {Array.isArray(data) && data.length > 0
            ? data.map((conversation: any, index: number) => {
                const partner =
                  conversation.sender._id === infoUser._id
                    ? conversation.receiver
                    : conversation.sender;
                const isActive = activeUserId === partner._id;
                const isUnread =
                  conversation.seen === false &&
                  conversation.sender._id !== infoUser._id;
                return (
                  <Link
                    to={`/messages/${partner._id}`}
                    onClick={() => {
                      if (isUnread) {
                        markConversationAsSeen({
                          sender: conversation.sender._id,
                        });
                      }
                    }}
                    key={index}
                    className="relative"
                  >
                    <li
                      key={conversation.id}
                      className={`p-2  cursor-pointer flex justify-start items-start gap-2 rounded-lg ${
                        isActive ? 'bg-[#f2f2f2] transition-all' : ''
                      }`}
                    >
                      <UserAvatar src={partner.image} />
                      <div className="flex justify-between flex-col flex-1">
                        <span>{conversation.sender.fullName}</span>
                        <span
                          className={`text-gray-500 text-sm line-clamp-1 truncate max-w-xs  ${
                            isUnread ? 'font-bold !text-black' : ''
                          }`}
                        >
                          {infoUser._id === conversation.sender._id
                            ? `You: ${conversation.message} `
                            : conversation.message || 'No messages yet.'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">
                          {conversation.message ? (
                            <TimeAgo date={conversation.createdAt} message />
                          ) : (
                            ''
                          )}
                        </span>
                      </div>
                      <div
                        className={`absolute top-7 right-2 ${
                          isUnread ? 'block' : 'hidden'
                        }`}
                      >
                        <Circle
                          className={`${isUnread ? 'text-[#3096e0]' : ''} ml-1`}
                          style={{ fontSize: '10px' }}
                        />
                      </div>
                    </li>
                  </Link>
                );
              })
            : !isLoading && (
                <li className="p-2 text-gray-500">No conversations found.</li>
              )}
        </ul>
      </div>
    </div>
  );
};

export default ListConverstation;
