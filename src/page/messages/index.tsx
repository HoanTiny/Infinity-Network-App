import ListConverstation from './ListConverstation';
import { Outlet, useParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const Messages = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div className="flex h-screen overflow-hidden bg-ig-bg">
      {/* Conversation list — hidden on mobile when a chat is open */}
      <div
        className={`${
          userId ? 'hidden sm:flex' : 'flex'
        } w-full sm:w-[350px] shrink-0 flex-col`}
      >
        <ListConverstation />
      </div>

      {/* Chat area — hidden on mobile when no chat selected */}
      <div
        className={`${
          userId ? 'flex' : 'hidden sm:flex'
        } flex-1 flex-col min-w-0`}
      >
        {userId ? (
          <Outlet />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-ig-muted">
            <div className="w-20 h-20 rounded-full border-2 border-ig-border flex items-center justify-center">
              <MessageCircle
                size={40}
                strokeWidth={1.5}
                className="text-ig-text"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-ig-text text-[16px] font-semibold">
                Chọn một tin nhắn
              </span>
              <span className="text-ig-muted text-[13px]">
                Bắt đầu cuộc trò chuyện với bạn bè
              </span>
            </div>
            <button className="mt-2 px-5 py-2 bg-[#3897F0] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1877F2] transition-colors">
              Bắt đầu cuộc trò chuyện
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
