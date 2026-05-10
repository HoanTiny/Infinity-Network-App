/* eslint-disable @typescript-eslint/no-explicit-any */
import TimeAgo from '@components/TimeAgo';
import UserAvatar from '@components/UserAvatar';
import { useUserInfo } from '@hooks/getUserinfo';
import { ChevronDown, MessageCircle, Search, SquarePen } from 'lucide-react';
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

  return (
    <div className="w-[350px] shrink-0 border-r border-ig-border h-screen flex flex-col bg-ig-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-8 pb-2">
        <button className="flex items-center gap-1 group">
          <span className="text-ig-text text-[16px] font-bold leading-tight">
            {infoUser?.fullName}
          </span>
          <ChevronDown size={16} className="text-ig-text mt-0.5" />
        </button>
        <button className="p-2 rounded-full hover:bg-ig-hover transition-colors">
          <SquarePen size={22} className="text-ig-text" />
        </button>
      </div>

      {/* Search bar */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-ig-hover rounded-full px-4 py-2">
          <Search size={14} className="text-ig-muted shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="bg-transparent text-[13px] text-ig-text placeholder:text-ig-muted outline-none flex-1"
          />
        </div>
      </div>

      {/* Row header */}
      <div className="flex items-center justify-between px-5 py-2">
        <span className="text-ig-text text-[14px] font-semibold">Tin nhắn</span>
        <button className="text-ig-accent text-[13px] font-medium hover:opacity-80 transition-opacity">
          Tin nhắn đang chờ
        </button>
      </div>

      {/* Conversation list */}
      <ul className="flex-1 overflow-y-auto list-none p-0">
        {/* Skeleton loading */}
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
              <div className="w-14 h-14 rounded-full bg-ig-hover shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 bg-ig-hover rounded-full w-2/3" />
                <div className="h-3 bg-ig-hover rounded-full w-1/2" />
              </div>
            </li>
          ))}

        {error && (
          <li className="px-4 py-3 text-[13px] text-red-500">
            Không thể tải cuộc trò chuyện.
          </li>
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
                  className="block no-underline"
                >
                  <li
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors relative ${
                      isActive ? 'bg-ig-hover' : 'hover:bg-ig-hover/60'
                    }`}
                  >
                    {/* Avatar with optional unread gradient ring */}
                    {isUnread ? (
                      <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shrink-0">
                        <div className="p-[2px] rounded-full bg-ig-bg">
                          <UserAvatar src={partner.image} size="lg" />
                        </div>
                      </div>
                    ) : (
                      <div className="shrink-0">
                        <UserAvatar src={partner.image} size="lg" />
                      </div>
                    )}

                    {/* Text content */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[14px] font-semibold text-ig-text leading-tight truncate">
                        {partner.fullName}
                      </span>
                      <div className="flex items-center gap-1 min-w-0">
                        <span
                          className={`text-[13px] truncate flex-1 ${
                            isUnread
                              ? 'font-semibold text-ig-text'
                              : 'text-ig-muted'
                          }`}
                        >
                          {infoUser._id === conversation.sender._id
                            ? `You: ${conversation.message}`
                            : conversation.message || 'Chưa có tin nhắn'}
                        </span>
                        {conversation.message && (
                          <>
                            <span className="text-ig-muted text-[13px] shrink-0">·</span>
                            <span className="text-ig-muted text-[13px] shrink-0">
                              <TimeAgo date={conversation.createdAt} message />
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Unread blue dot */}
                    {isUnread && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3897F0] shrink-0" />
                    )}
                  </li>
                </Link>
              );
            })
          : !isLoading && (
              <li className="px-4 py-3 text-[13px] text-ig-muted flex flex-col items-center gap-2 pt-10">
                <MessageCircle size={32} strokeWidth={1.5} className="text-ig-muted" />
                <span>Không có cuộc trò chuyện nào.</span>
              </li>
            )}
      </ul>
    </div>
  );
};

export default ListConverstation;
