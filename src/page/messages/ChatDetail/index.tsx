/* eslint-disable @typescript-eslint/no-explicit-any */
import UserAvatar from '@components/UserAvatar';
import { useUserInfo } from '@hooks/getUserinfo';
import {
  ChevronLeft,
  ChevronDown,
  Info,
  Phone,
  Video,
  Smile,
  CornerUpLeft,
  MoreHorizontal,
} from 'lucide-react';
import { useGetMessagesQuery } from '@services/messagesApi';
import { useParams, useNavigate } from 'react-router-dom';
import MessageCreation from '../MessageCreation';
import { useGetUserProfileQuery } from '@services/userApi';
import { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { socket } from '@context/SocketProvider';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

const LIMIT = 15;
const PREPEND_OFFSET = 100_000;
const QUICK_EMOJIS = ['❤️', '😂', '😮', '😢', '🙏', '👍'];

// ─── Sub-components ──────────────────────────────────────────────────────────

const MessageSkeleton = ({ right = false }: { right?: boolean }) => (
  <div
    className={`flex items-end gap-2 px-4 py-1 animate-pulse ${
      right ? 'justify-end' : 'justify-start'
    }`}
  >
    {!right && <div className="w-8 h-8 rounded-full bg-ig-hover shrink-0" />}
    <div
      className={`rounded-2xl bg-ig-hover ${right ? 'w-44 h-10' : 'w-36 h-10'}`}
    />
  </div>
);

const DateSeparator = ({ date }: { date: string }) => {
  const d = dayjs(date);
  const diff = dayjs().diff(d, 'day');
  const label =
    diff === 0 ? 'Hôm nay' : diff === 1 ? 'Hôm qua' : d.format('DD/MM/YYYY');
  return (
    <div className="flex items-center justify-center gap-3 px-6 py-4 select-none">
      <span className="text-[11px] font-medium text-ig-muted tracking-wide px-1">
        {label}
      </span>
    </div>
  );
};

const EmojiPicker = ({
  onSelect,
  isSent,
}: {
  onSelect: (e: string) => void;
  isSent: boolean;
}) => (
  <div
    onClick={(e) => e.stopPropagation()}
    className={`absolute bottom-full mb-2 z-30 bg-ig-bg border border-ig-border rounded-full shadow-xl px-2.5 py-1.5 flex items-center gap-0.5 ${
      isSent ? 'right-0' : 'left-0'
    }`}
  >
    {QUICK_EMOJIS.map((emoji) => (
      <button
        key={emoji}
        onClick={() => onSelect(emoji)}
        className="text-[20px] hover:scale-125 transition-transform duration-150 leading-none px-0.5"
      >
        {emoji}
      </button>
    ))}
  </div>
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getBubbleRadius = (
  isSent: boolean,
  _isFirst: boolean,
  isLast: boolean,
): React.CSSProperties => {
  const R = 20;
  const S = 5;
  if (isSent) {
    return {
      borderTopLeftRadius: R,
      borderTopRightRadius: isLast ? R : S,
      borderBottomRightRadius: S,
      borderBottomLeftRadius: R,
    };
  }
  return {
    borderTopLeftRadius: isLast ? R : S,
    borderTopRightRadius: R,
    borderBottomRightRadius: R,
    borderBottomLeftRadius: S,
  };
};

// ─── Main Component ──────────────────────────────────────────────────────────

const ChatDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: userData } = useGetUserProfileQuery(userId);
  const infoUser = useUserInfo();
  const currentUserId = infoUser?._id;
  const navigate = useNavigate();

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  // Ref-based lock: prevents followOutput from firing during old-message prepend
  const loadingOlderRef = useRef(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [prevUserId, setPrevUserId] = useState(userId);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [emojiPickerFor, setEmojiPickerFor] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<string, string[]>>({});

  // Reset offset synchronously during render to prevent stale-offset query on userId change
  if (prevUserId !== userId) {
    setPrevUserId(userId);
    setCurrentOffset(0);
  }

  const {
    data = { messages: [], pagination: {} },
    isFetching,
    isLoading,
  } = useGetMessagesQuery(
    { userId, offset: currentOffset, limit: LIMIT },
    { skip: !userId },
  );

  const messages: any[] = data.messages || [];
  const total: number = data.pagination?.total ?? 0;
  const hasMore = total > messages.length;
  const firstItemIndex = PREPEND_OFFSET - messages.length;

  // Reset UI state when switching conversation
  useEffect(() => {
    setIsAtBottom(true);
    setNewMessageCount(0);
    setReplyingTo(null);
    setEmojiPickerFor(null);
    setIsLoadingOlder(false);
    loadingOlderRef.current = false;
    clearTimeout(loadingTimerRef.current);
  }, [userId]);

  // Close emoji picker on outside click
  useEffect(() => {
    if (!emojiPickerFor) return;
    const close = () => setEmojiPickerFor(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [emojiPickerFor]);

  // Show unread badge when incoming message arrives while scrolled up
  useEffect(() => {
    const handleIncoming = (msg: any) => {
      const inThisConversation =
        msg?.sender?._id === userId || msg?.receiver?._id === userId;
      const fromOther = msg?.sender?._id !== currentUserId;
      if (inThisConversation && fromOther && !isAtBottom) {
        setNewMessageCount((n) => n + 1);
      }
    };
    socket.on('SEND_MESSAGE', handleIncoming);
    return () => {
      socket.off('SEND_MESSAGE', handleIncoming);
    };
  }, [userId, currentUserId, isAtBottom]);

  // Release lock once the API fetch finishes
  useEffect(() => {
    if (!isFetching) {
      loadingOlderRef.current = false;
      setIsLoadingOlder(false);
    }
  }, [isFetching]);

  const handleStartReached = useCallback(() => {
    if (!hasMore || loadingOlderRef.current) return;
    loadingOlderRef.current = true;
    setIsLoadingOlder(true); // show spinner immediately
    // 1s simulated delay before the actual fetch — friendlier on slow connections
    loadingTimerRef.current = setTimeout(() => {
      setCurrentOffset((prev) => prev + LIMIT);
    }, 1000);
  }, [hasMore]);

  const scrollToBottom = useCallback(() => {
    virtuosoRef.current?.scrollToIndex({ index: 'LAST', behavior: 'smooth' });
    setNewMessageCount(0);
  }, []);

  const handleSendSuccess = useCallback(() => {
    // Use 'auto' (instant) so it doesn't race with followOutput's smooth animation
    virtuosoRef.current?.scrollToIndex({ index: 'LAST', behavior: 'auto' });
    setIsAtBottom(true);
    setNewMessageCount(0);
    setReplyingTo(null);
  }, []);

  const handleReact = useCallback((msgId: string, emoji: string) => {
    setReactions((prev) => {
      const current = prev[msgId] || [];
      const has = current.includes(emoji);
      return {
        ...prev,
        [msgId]: has ? current.filter((e) => e !== emoji) : [...current, emoji],
      };
    });
    setEmojiPickerFor(null);
  }, []);

  if (!userId) return null;

  return (
    <div className="h-screen flex flex-col bg-ig-bg">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-ig-border bg-ig-bg shadow-sm flex items-center gap-3 shrink-0">
        <button
          onClick={() => navigate('/messages')}
          className="sm:hidden p-2 rounded-full hover:bg-ig-hover transition-colors"
        >
          <ChevronLeft size={20} className="text-ig-text" />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative shrink-0">
            <UserAvatar src={userData?.image} size="md" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-ig-bg shadow-sm" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-ig-text text-[15px] font-bold leading-tight truncate">
              {userData?.fullName}
            </span>
            <span className="text-green-500 text-[12px] leading-tight font-medium">
              Đang hoạt động
            </span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <button className="p-2.5 rounded-full hover:bg-ig-hover transition-colors text-[#3897F0]">
            <Phone size={19} />
          </button>
          <button className="p-2.5 rounded-full hover:bg-ig-hover transition-colors text-[#3897F0]">
            <Video size={19} />
          </button>
          <button className="p-2.5 rounded-full hover:bg-ig-hover transition-colors text-ig-muted hover:text-ig-text">
            <Info size={19} />
          </button>
        </div>
      </div>

      {/* ── Messages area ──────────────────────────────── */}
      <div className="flex-1 relative min-h-0">
        {isLoading && messages.length === 0 ? (
          <div className="h-full flex flex-col justify-end gap-1 pb-4 px-2">
            {[false, true, false, false, true, true, false, true].map(
              (right, i) => (
                <MessageSkeleton key={i} right={right} />
              ),
            )}
          </div>
        ) : (
          <>
            {/* Spinner floats outside Virtuoso so it never changes the scroll area height */}
            {(isLoadingOlder || isFetching) && (
              <div className="absolute top-3 left-0 right-0 flex justify-center z-20 pointer-events-none">
                <div className="flex items-center gap-2 bg-ig-bg/90 backdrop-blur-sm border border-ig-border px-3 py-1.5 rounded-full shadow-sm">
                  <div className="w-3.5 h-3.5 border-2 border-[#3897F0] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[12px] text-ig-muted">Đang tải...</span>
                </div>
              </div>
            )}

          <Virtuoso
            key={userId}
            ref={virtuosoRef}
            style={{ height: '100%' }}
            firstItemIndex={firstItemIndex}
            initialTopMostItemIndex={
              messages.length > 0 ? messages.length - 1 : 0
            }
            alignToBottom
            increaseViewportBy={{ top: 400, bottom: 200 }}
            defaultItemHeight={56}
            data={messages}
            computeItemKey={(_, msg: any) => msg._id}
            startReached={handleStartReached}
            followOutput={(atBottom) => {
              if (loadingOlderRef.current) return false;
              return atBottom ? 'smooth' : false;
            }}
            atBottomStateChange={(atBottom) => {
              setIsAtBottom(atBottom);
              if (atBottom) setNewMessageCount(0);
            }}
            atBottomThreshold={100}
            overscan={400}
            itemContent={(index, message: any) => {
              const i = index - firstItemIndex;
              const prevMsg = messages[i - 1];
              const nextMsg = messages[i + 1];
              const isSent = message.sender._id === currentUserId;

              const showDate =
                !prevMsg ||
                dayjs(message.createdAt).format('YYYY-MM-DD') !==
                  dayjs(prevMsg.createdAt).format('YYYY-MM-DD');

              const sameAsPrev =
                !!prevMsg &&
                prevMsg.sender._id === message.sender._id &&
                dayjs(message.createdAt).diff(
                  dayjs(prevMsg.createdAt),
                  'minute',
                ) < 5;

              const sameAsNext =
                !!nextMsg &&
                nextMsg.sender._id === message.sender._id &&
                dayjs(nextMsg.createdAt).diff(
                  dayjs(message.createdAt),
                  'minute',
                ) < 5;

              const isFirst = !sameAsPrev;
              const isLast = !sameAsNext;
              const showAvatar = !isSent && isLast;
              const msgReactions = reactions[message._id] || [];

              return (
                <div style={{ paddingTop: isFirst ? 10 : 2 }}>
                  {showDate && <DateSeparator date={message.createdAt} />}

                  {/* Message row with group hover */}
                  <div
                    className={`group flex items-end gap-3 px-4 pb-0.5 ${
                      isSent ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Avatar (received side) */}
                    {!isSent && (
                      <div className="w-7 h-7 shrink-0 mb-1">
                        {showAvatar && (
                          <UserAvatar src={message.sender.image} size="sm" />
                        )}
                      </div>
                    )}

                    {/* Actions for SENT — appear before the bubble */}
                    {isSent && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mb-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEmojiPickerFor(
                              emojiPickerFor === message._id
                                ? null
                                : message._id,
                            );
                          }}
                          className="p-1.5 rounded-full hover:bg-ig-hover text-ig-muted hover:text-ig-text transition-colors"
                        >
                          <Smile size={15} />
                        </button>
                        <button
                          onClick={() => setReplyingTo(message)}
                          className="p-1.5 rounded-full hover:bg-ig-hover text-ig-muted hover:text-ig-text transition-colors"
                        >
                          <CornerUpLeft size={15} />
                        </button>
                      </div>
                    )}

                    {/* Bubble + reactions */}
                    <div
                      className={`flex flex-col relative ${isSent ? 'items-end' : 'items-start'}`}
                    >
                      {/* Reply quote */}
                      {message.replyTo && (
                        <div
                          className={`mb-1 px-3 py-1.5 rounded-xl text-[12px] max-w-[90%] truncate border-l-2 ${
                            isSent
                              ? 'bg-white/20 text-white border-white/50'
                              : 'bg-ig-bg text-ig-muted border-ig-border'
                          }`}
                        >
                          <span className="font-semibold mr-1">
                            {message.replyTo.sender?.fullName}:
                          </span>
                          {message.replyTo.message}
                        </div>
                      )}

                      {/* Main bubble */}
                      <div
                        className={`relative text-[14px] px-4 py-2.5 max-w-[65vw] break-words leading-relaxed select-text ${
                          isSent
                            ? 'bg-gradient-to-br from-[#3897F0] to-[#1d7de8] text-white shadow-[0_2px_8px_rgba(56,151,240,0.28)]'
                            : 'bg-ig-hover text-ig-text shadow-[0_1px_3px_rgba(0,0,0,0.07)]'
                        }`}
                        style={getBubbleRadius(isSent, isFirst, isLast)}
                      >
                        <p className="w-full whitespace-pre-wrap">
                          {message.message}
                        </p>

                        {/* Emoji picker popup */}
                        {emojiPickerFor === message._id && (
                          <EmojiPicker
                            onSelect={(emoji) =>
                              handleReact(message._id, emoji)
                            }
                            isSent={isSent}
                          />
                        )}
                      </div>

                      {/* Reactions display */}
                      {msgReactions.length > 0 && (
                        <div
                          className={`flex items-center gap-0.5 -mt-1 z-10 bg-ig-bg rounded-full px-2 py-0.5 shadow-md border border-ig-border text-[14px] leading-none ${
                            isSent ? 'mr-1' : 'ml-1'
                          }`}
                        >
                          {msgReactions.map((e, idx) => (
                            <span key={idx}>{e}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions for RECEIVED — appear after the bubble */}
                    {!isSent && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mb-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEmojiPickerFor(
                              emojiPickerFor === message._id
                                ? null
                                : message._id,
                            );
                          }}
                          className="p-1.5 rounded-full hover:bg-ig-hover text-ig-muted hover:text-ig-text transition-colors"
                        >
                          <Smile size={15} />
                        </button>
                        <button
                          onClick={() => setReplyingTo(message)}
                          className="p-1.5 rounded-full hover:bg-ig-hover text-ig-muted hover:text-ig-text transition-colors"
                        >
                          <CornerUpLeft size={15} />
                        </button>
                        <button className="p-1.5 rounded-full hover:bg-ig-hover text-ig-muted hover:text-ig-text transition-colors">
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
          </>
        )}

        {/* New messages badge */}
        {newMessageCount > 0 && !isAtBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-[#3897F0] text-white text-[12px] font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-[#1877F2] transition-colors z-10"
          >
            <ChevronDown size={13} />
            {newMessageCount} tin nhắn mới
          </button>
        )}
      </div>

      {/* ── Input ──────────────────────────────────────── */}
      <MessageCreation
        userId={userId}
        replyTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        onSendSuccess={handleSendSuccess}
      />
    </div>
  );
};

export default ChatDetail;
