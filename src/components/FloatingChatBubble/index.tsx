/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useMarkConversationAsSeenMutation,
} from '@services/messagesApi';
import { useUserInfo } from '@hooks/getUserinfo';
import {
  ChevronLeft,
  Edit,
  ExternalLink,
  Maximize2,
  MessageCircle,
  X,
} from 'lucide-react';
import { Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import TimeAgo from '@components/TimeAgo';
import MessageCreation from '@page/messages/MessageCreation';
import dayjs from 'dayjs';

// ── Bubble border-radius helper (mirrors ChatDetail) ─────────────────────────
const getBubbleRadius = (
  isSent: boolean,
  isLast: boolean,
): React.CSSProperties => {
  const R = 18;
  const S = 5;
  if (isSent)
    return {
      borderTopLeftRadius: R,
      borderTopRightRadius: isLast ? R : S,
      borderBottomRightRadius: S,
      borderBottomLeftRadius: R,
    };
  return {
    borderTopLeftRadius: isLast ? R : S,
    borderTopRightRadius: R,
    borderBottomRightRadius: R,
    borderBottomLeftRadius: S,
  };
};

const MINI_LIMIT = 15;

// ── Mini chat panel ───────────────────────────────────────────────────────────
const MiniChatPanel = ({
  partnerId,
  partnerInfo,
  onBack,
  onClose,
  onExpand,
}: {
  partnerId: string;
  partnerInfo: any;
  onBack: () => void;
  onClose: () => void;
  onExpand: () => void;
}) => {
  const infoUser = useUserInfo();
  const currentUserId = infoUser?._id;

  const [currentOffset, setCurrentOffset] = useState(0);
  const [prevPartnerId, setPrevPartnerId] = useState(partnerId);

  // Reset offset synchronously when switching partner (mirrors ChatDetail pattern)
  if (prevPartnerId !== partnerId) {
    setPrevPartnerId(partnerId);
    setCurrentOffset(0);
  }

  const { data = { messages: [], pagination: {} }, isLoading, isFetching } =
    useGetMessagesQuery(
      { userId: partnerId, offset: currentOffset, limit: MINI_LIMIT },
      { skip: !partnerId },
    );

  const messages: any[] = data.messages ?? [];
  const total: number = (data.pagination as any)?.total ?? 0;
  const hasMore = total > messages.length;

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // Saved scrollHeight right before we trigger a load-older fetch
  const prevScrollHeightRef = useRef(0);
  // Guards against triggering multiple fetches before the first resolves
  const isLoadingOlderRef = useRef(false);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // ── Scroll to bottom on initial load ──────────────────────────────────────
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // ── Restore scroll position after older messages are prepended ────────────
  useEffect(() => {
    if (!isFetching && isLoadingOlderRef.current && scrollRef.current) {
      const diff = scrollRef.current.scrollHeight - prevScrollHeightRef.current;
      scrollRef.current.scrollTop = diff;
      isLoadingOlderRef.current = false;
    }
  }, [isFetching]);

  // ── Auto-scroll to bottom when new outgoing/incoming message arrives ──────
  const prevLengthRef = useRef(0);
  useEffect(() => {
    // Only scroll when a genuinely NEW message arrived (not a prepend of old ones)
    if (messages.length > prevLengthRef.current && isAtBottom && !isLoadingOlderRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = messages.length;
  }, [messages.length, isAtBottom]);

  // ── Scroll handler: track bottom position + trigger load-older ────────────
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setIsAtBottom(atBottom);

    if (el.scrollTop <= 60 && hasMore && !isLoadingOlderRef.current && !isFetching) {
      isLoadingOlderRef.current = true;
      prevScrollHeightRef.current = el.scrollHeight;
      setCurrentOffset((prev) => prev + MINI_LIMIT);
    }
  }, [hasMore, isFetching]);

  const handleSendSuccess = useCallback(() => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
      50,
    );
    setReplyingTo(null);
    setIsAtBottom(true);
  }, []);

  return (
    <div
      className="w-[320px] bg-ig-bg border border-ig-border rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-chat-bubble-in origin-bottom-right"
      style={{ height: 440 }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-ig-border bg-ig-bg shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-ig-hover transition-colors shrink-0"
          aria-label="Quay lại"
        >
          <ChevronLeft size={16} className="text-ig-text" />
        </button>

        <Avatar
          src={partnerInfo?.image}
          alt={partnerInfo?.fullName}
          sx={{ width: 34, height: 34, fontSize: 13 }}
        >
          {partnerInfo?.fullName?.charAt(0).toUpperCase() ?? 'U'}
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-ig-text leading-tight truncate">
            {partnerInfo?.fullName}
          </p>
          <p className="text-[11px] text-green-500 leading-tight font-medium">
            Đang hoạt động
          </p>
        </div>

        <button
          onClick={onExpand}
          className="p-1.5 rounded-full hover:bg-ig-hover transition-colors shrink-0"
          aria-label="Mở trang chat"
        >
          <Maximize2 size={14} className="text-ig-muted" />
        </button>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-ig-hover transition-colors shrink-0"
          aria-label="Đóng"
        >
          <X size={14} className="text-ig-muted" />
        </button>
      </div>

      {/* ── Messages ───────────────────────────────────── */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto min-h-0 py-2">
        {/* Spinner when loading older messages */}
        {isFetching && currentOffset > 0 && (
          <div className="flex justify-center py-2">
            <div className="flex items-center gap-1.5 bg-ig-bg/90 border border-ig-border px-3 py-1 rounded-full shadow-sm">
              <div className="w-3 h-3 border-2 border-[#3897F0] border-t-transparent rounded-full animate-spin" />
              <span className="text-[11px] text-ig-muted">Đang tải...</span>
            </div>
          </div>
        )}

        {/* Skeleton on first load */}
        {isLoading && (
          <div className="flex flex-col gap-2 px-3 py-2 animate-pulse">
            {[false, true, false, true, true, false].map((right, i) => (
              <div
                key={i}
                className={`flex items-end gap-1.5 ${right ? 'justify-end' : 'justify-start'}`}
              >
                {!right && (
                  <div className="w-6 h-6 rounded-full bg-ig-hover shrink-0" />
                )}
                <div
                  className={`rounded-2xl bg-ig-hover ${right ? 'w-32 h-8' : 'w-24 h-8'}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-ig-muted">
            <MessageCircle size={28} strokeWidth={1.5} />
            <span className="text-[12px]">Hãy bắt đầu cuộc trò chuyện!</span>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((message: any, i: number) => {
          const isSent = message.sender._id === currentUserId;
          const prevMsg = messages[i - 1];
          const nextMsg = messages[i + 1];

          const showDate =
            !prevMsg ||
            dayjs(message.createdAt).format('YYYY-MM-DD') !==
              dayjs(prevMsg?.createdAt).format('YYYY-MM-DD');

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

          const isLast = !sameAsNext;

          return (
            <div key={message._id} style={{ paddingTop: !sameAsPrev ? 6 : 1 }}>
              {/* Date separator */}
              {showDate && (
                <div className="flex justify-center py-2">
                  <span className="text-[10px] text-ig-muted">
                    {dayjs().diff(dayjs(message.createdAt), 'day') === 0
                      ? 'Hôm nay'
                      : dayjs().diff(dayjs(message.createdAt), 'day') === 1
                        ? 'Hôm qua'
                        : dayjs(message.createdAt).format('DD/MM/YYYY')}
                  </span>
                </div>
              )}

              {/* Row */}
              <div
                className={`flex items-end gap-1.5 px-3 pb-0.5 ${
                  isSent ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Received avatar */}
                {!isSent && (
                  <div className="w-6 h-6 shrink-0 mb-0.5">
                    {isLast && (
                      <Avatar
                        src={message.sender.image}
                        alt={message.sender.fullName}
                        sx={{ width: 24, height: 24, fontSize: 10 }}
                      >
                        {message.sender.fullName?.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`text-[13px] px-3 py-1.5 max-w-[72%] break-words leading-relaxed whitespace-pre-wrap ${
                    isSent
                      ? 'bg-gradient-to-br from-[#3897F0] to-[#1d7de8] text-white shadow-[0_2px_6px_rgba(56,151,240,0.25)]'
                      : 'bg-ig-hover text-ig-text'
                  }`}
                  style={getBubbleRadius(isSent, isLast)}
                >
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ──────────────────────────────────────── */}
      <MessageCreation
        userId={partnerId}
        replyTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        onSendSuccess={handleSendSuccess}
      />
    </div>
  );
};

// ── Main floating bubble ──────────────────────────────────────────────────────
const FloatingChatBubble = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const infoUser = useUserInfo();
  const { data: conversations, isLoading } = useGetConversationsQuery({});
  const [markConversationAsSeen] = useMarkConversationAsSeenMutation();

  const [open, setOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<{
    partnerId: string;
    partnerInfo: any;
  } | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveChat(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
    setActiveChat(null);
  }, [location.pathname]);

  if (location.pathname.startsWith('/messages')) return null;

  const unreadCount = Array.isArray(conversations)
    ? conversations.filter(
        (c: any) => c.seen === false && c.sender._id !== infoUser?._id,
      ).length
    : 0;

  const latestConversation =
    Array.isArray(conversations) && conversations.length > 0
      ? conversations[0]
      : null;

  const latestPartner = latestConversation
    ? latestConversation.sender._id === infoUser?._id
      ? latestConversation.receiver
      : latestConversation.sender
    : null;

  const handleConversationClick = (conversation: any) => {
    const partner =
      conversation.sender._id === infoUser?._id
        ? conversation.receiver
        : conversation.sender;
    const isUnread =
      conversation.seen === false && conversation.sender._id !== infoUser?._id;
    if (isUnread) {
      markConversationAsSeen({ sender: conversation.sender._id });
    }
    setActiveChat({ partnerId: partner._id, partnerInfo: partner });
  };

  const handleClose = () => {
    setOpen(false);
    setActiveChat(null);
  };

  const handleExpand = () => {
    if (activeChat) {
      navigate(`/messages/${activeChat.partnerId}`);
    } else {
      navigate('/messages');
    }
    handleClose();
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {/* ── Popup panel ──────────────────────────────── */}
      {open && (
        <>
          {/* Mini chat view */}
          {activeChat ? (
            <MiniChatPanel
              partnerId={activeChat.partnerId}
              partnerInfo={activeChat.partnerInfo}
              onBack={() => setActiveChat(null)}
              onClose={handleClose}
              onExpand={handleExpand}
            />
          ) : (
            /* Conversation list view */
            <div className="w-[320px] bg-ig-bg border border-ig-border rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] overflow-hidden animate-chat-bubble-in origin-bottom-right">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <span className="text-[16px] font-bold text-ig-text">
                  Tin nhắn
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleExpand}
                    className="p-1.5 rounded-full hover:bg-ig-hover transition-colors"
                    aria-label="Mở trang tin nhắn"
                  >
                    <ExternalLink size={16} className="text-ig-text" />
                  </button>
                  <button
                    onClick={handleExpand}
                    className="p-1.5 rounded-full hover:bg-ig-hover transition-colors"
                    aria-label="Tạo cuộc trò chuyện"
                  >
                    <Edit size={16} className="text-ig-text" />
                  </button>
                </div>
              </div>

              {/* List */}
              <ul className="max-h-[340px] overflow-y-auto list-none p-0">
                {isLoading &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 px-4 py-2.5 animate-pulse"
                    >
                      <div className="w-11 h-11 rounded-full bg-ig-hover shrink-0" />
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="h-2.5 bg-ig-hover rounded-full w-3/5" />
                        <div className="h-2.5 bg-ig-hover rounded-full w-2/5" />
                      </div>
                    </li>
                  ))}

                {Array.isArray(conversations) &&
                  conversations.length === 0 &&
                  !isLoading && (
                    <li className="px-4 py-8 flex flex-col items-center gap-2 text-ig-muted">
                      <MessageCircle size={28} strokeWidth={1.5} />
                      <span className="text-[13px]">
                        Chưa có cuộc trò chuyện nào
                      </span>
                    </li>
                  )}

                {Array.isArray(conversations) &&
                  conversations.slice(0, 8).map((conversation: any, index: number) => {
                    const partner =
                      conversation.sender._id === infoUser?._id
                        ? conversation.receiver
                        : conversation.sender;
                    const isUnread =
                      conversation.seen === false &&
                      conversation.sender._id !== infoUser?._id;

                    return (
                      <li key={index}>
                        <button
                          className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-ig-hover/70 transition-colors text-left ${
                            isUnread ? 'bg-ig-hover/30' : ''
                          }`}
                          onClick={() => handleConversationClick(conversation)}
                        >
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            {isUnread ? (
                              <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                                <div className="p-[1.5px] rounded-full bg-ig-bg">
                                  <Avatar
                                    src={partner.image}
                                    alt={partner.fullName}
                                    sx={{ width: 44, height: 44, fontSize: 16 }}
                                  >
                                    {partner.fullName?.charAt(0).toUpperCase() ??
                                      'U'}
                                  </Avatar>
                                </div>
                              </div>
                            ) : (
                              <Avatar
                                src={partner.image}
                                alt={partner.fullName}
                                sx={{ width: 44, height: 44, fontSize: 16 }}
                              >
                                {partner.fullName?.charAt(0).toUpperCase() ?? 'U'}
                              </Avatar>
                            )}
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0 flex flex-col">
                            <span
                              className={`text-[13px] leading-tight truncate ${
                                isUnread
                                  ? 'font-bold text-ig-text'
                                  : 'font-semibold text-ig-text'
                              }`}
                            >
                              {partner.fullName}
                            </span>
                            <div className="flex items-center gap-1 min-w-0">
                              <span
                                className={`text-[12px] truncate ${
                                  isUnread
                                    ? 'font-semibold text-ig-text'
                                    : 'text-ig-muted'
                                }`}
                              >
                                {infoUser?._id === conversation.sender._id
                                  ? `Bạn: ${conversation.message}`
                                  : conversation.message || 'Chưa có tin nhắn'}
                              </span>
                              {conversation.createdAt && (
                                <>
                                  <span className="text-ig-muted text-[11px] shrink-0">
                                    ·
                                  </span>
                                  <span className="text-ig-muted text-[11px] shrink-0">
                                    <TimeAgo
                                      date={conversation.createdAt}
                                      message
                                    />
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Unread dot */}
                          {isUnread && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#3897F0] shrink-0" />
                          )}
                        </button>
                      </li>
                    );
                  })}
              </ul>

              {/* Footer */}
              {Array.isArray(conversations) && conversations.length > 0 && (
                <div className="border-t border-ig-border px-4 py-2.5">
                  <button
                    onClick={handleExpand}
                    className="w-full text-center text-[13px] font-semibold text-[#3897F0] hover:opacity-80 transition-opacity"
                  >
                    Xem tất cả tin nhắn
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Floating pill button ──────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2.5 bg-ig-bg border border-ig-border rounded-full pl-3.5 pr-2 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.18)] hover:scale-[1.04] transition-all duration-200 cursor-pointer animate-chat-bubble-in ${
          open ? 'ring-2 ring-[#3897F0]/40' : ''
        }`}
        aria-label="Tin nhắn"
        aria-expanded={open}
      >
        <MessageCircle
          size={19}
          strokeWidth={2}
          className="text-[#3897F0] shrink-0"
        />

        <span className="relative text-[13px] font-semibold text-ig-text leading-none pr-1">
          Tin nhắn
          {unreadCount > 0 && (
            <span className="absolute -top-2.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] px-[3px] flex items-center justify-center leading-none ring-[1.5px] ring-ig-bg">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </span>

        {latestPartner ? (
          <Avatar
            src={latestPartner.image}
            alt={latestPartner.fullName}
            sx={{ width: 26, height: 26, fontSize: 11 }}
          >
            {latestPartner.fullName?.charAt(0).toUpperCase() ?? 'U'}
          </Avatar>
        ) : (
          <div className="w-[26px] h-[26px] rounded-full bg-ig-hover" />
        )}
      </button>
    </div>
  );
};

export default FloatingChatBubble;
