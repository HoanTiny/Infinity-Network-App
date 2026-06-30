/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from '@services/notificationApi';
import {
  useGetUserAllFriendsQuery,
  useGetPendingFriendsRequestQuery,
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
} from '@services/friendApi';
import { useUserInfo } from '@hooks/getUserinfo';
import UserAvatar from '@components/UserAvatar';
import TimeAgo from '@components/TimeAgo';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import dayjs from 'dayjs';

type Tab = 'all' | 'following' | 'comment' | 'like' | 'requests';

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'following', label: 'Người mà bạn theo dõi' },
  { key: 'comment', label: 'Bình luận' },
  { key: 'like', label: 'Lượt thích' },
  { key: 'requests', label: 'Lời mời kết bạn' },
];

type Notification = {
  _id: string;
  author: { _id: string; fullName: string; image?: string };
  like?: boolean;
  comment?: boolean;
  message?: boolean;
  follow?: boolean;
  seen?: boolean;
  createdAt: string;
  post?: string;
};

type NotificationsPanelProps = {
  open: boolean;
  onClose: () => void;
};

const NotificationsPanel = ({ open, onClose }: NotificationsPanelProps) => {
  const userInfo = useUserInfo();
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const [activeTab, setActiveTab] = useState<Tab>('all');

  const { data } = useGetNotificationsQuery() as {
    data: { notifications: Notification[] } | undefined;
  };
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const { data: friendsData } = useGetUserAllFriendsQuery({}) as {
    data: { friends?: any[] } | any[] | undefined;
  };
  const { data: pendingRequests = [] } = useGetPendingFriendsRequestQuery() as {
    data: any[];
  };

  // Normalise friends array (API may return array or {friends:[]})
  const friendsList: any[] = Array.isArray(friendsData)
    ? friendsData
    : (friendsData as any)?.friends ?? [];

  const notifications = (data?.notifications || []).filter(
    (n) => n.author._id !== userInfo._id,
  );

  // For non-following tabs: filter notifications normally
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'like') return n.like;
    if (activeTab === 'comment') return n.comment;
    return true;
  });

  // Split notifications into "this month" and "previous"
  const startOfMonth = dayjs().startOf('month');
  const thisMonth = filteredNotifications.filter((n) =>
    dayjs(n.createdAt).isAfter(startOfMonth),
  );
  const previous = filteredNotifications.filter((n) =>
    dayjs(n.createdAt).isBefore(startOfMonth),
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  const handleNoteClick = (note: Notification) => {
    if (!note.seen) markAsRead(note._id);
    onClose();
    if (note.like || note.comment) {
      navigate(`/posts/${note.post}`, { state: { background: location } });
    } else if (note.message) {
      navigate(`/messages/${note.author._id}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.seen).length;
  const handleMarkAllAsRead = () => {
    notifications
      .filter((n) => !n.seen)
      .forEach((n) => markAsRead(n._id));
  };

  const getActionText = (note: Notification) => {
    if (note.follow) return 'đã bắt đầu theo dõi bạn.';
    if (note.like) return 'đã thích bài viết của bạn.';
    if (note.comment) return 'đã bình luận về bài viết của bạn.';
    if (note.message) return 'đã gửi tin nhắn cho bạn.';
    return 'đã tương tác với bài viết của bạn.';
  };

  return (
    <>
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Thông báo"
        className="fixed top-0 left-0 h-screen z-50 flex flex-col"
        style={{
          width: 320,
          background: 'var(--ig-bg)',
          borderRight: '1px solid var(--ig-border)',
          boxShadow: open ? '8px 0 40px rgba(0,0,0,0.18)' : 'none',
          transform: open ? 'translateX(72px)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5"
          style={{ paddingTop: 20, paddingBottom: 14, flexShrink: 0 }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--ig-text)',
              letterSpacing: '-0.2px',
            }}
          >
            Thông báo
          </span>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors"
                style={{
                  background: 'transparent',
                  color: 'var(--ig-accent)',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    'var(--ig-hover)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    'transparent')
                }
              >
                Đọc tất cả
              </button>
            )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 transition-colors"
            style={{ background: 'var(--ig-hover)' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                'var(--ig-border)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background =
                'var(--ig-hover)')
            }
            aria-label="Đóng thông báo"
          >
            <X size={18} color="var(--ig-text)" strokeWidth={2.5} />
          </button>
          </div>
        </div>

        {/* Tabs — drag-to-scroll, right-fade hint */}
        <div
          className="relative flex-shrink-0"
          style={{ borderBottom: '1px solid var(--ig-border)' }}
        >
          <div
            ref={tabsRef}
            className="flex gap-2 pl-4 overflow-x-auto"
            style={{
              paddingBottom: 10,
              paddingRight: 8,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              cursor: 'grab',
              userSelect: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            onMouseDown={(e) => {
              isDragging.current = true;
              dragStartX.current = e.pageX - (tabsRef.current?.offsetLeft ?? 0);
              dragScrollLeft.current = tabsRef.current?.scrollLeft ?? 0;
              if (tabsRef.current) tabsRef.current.style.cursor = 'grabbing';
            }}
            onMouseLeave={() => {
              isDragging.current = false;
              if (tabsRef.current) tabsRef.current.style.cursor = 'grab';
            }}
            onMouseUp={() => {
              isDragging.current = false;
              if (tabsRef.current) tabsRef.current.style.cursor = 'grab';
            }}
            onMouseMove={(e) => {
              if (!isDragging.current || !tabsRef.current) return;
              e.preventDefault();
              const x = e.pageX - (tabsRef.current.offsetLeft ?? 0);
              const walk = (x - dragStartX.current) * 1.2;
              tabsRef.current.scrollLeft = dragScrollLeft.current - walk;
            }}
            /* Clip the scroll area so ~1/3 of the 3rd tab peeks through */
            /* Panel is 320px; px-4 = 16px left; ~2.33 tabs visible at ~88px each ≈ 204px + 16px left = 220px clip */
            /* We rely on overflow-x:auto + the gradient to create the peek effect naturally */
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={(e) => {
                    // Prevent click firing after a drag gesture
                    const dist = Math.abs(
                      e.pageX -
                        (dragStartX.current + (tabsRef.current?.offsetLeft ?? 0)),
                    );
                    if (dist > 5) return;
                    setActiveTab(tab.key);
                  }}
                  className="flex-shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold transition-all"
                  style={{
                    background: active ? 'var(--ig-text)' : 'var(--ig-hover)',
                    color: active ? 'var(--ig-bg)' : 'var(--ig-muted)',
                    whiteSpace: 'nowrap',
                    border: 'none',
                    pointerEvents: 'auto',
                  }}
                  aria-pressed={active}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Gradient fade — wider so partial tab is clearly "faded" */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-full"
            style={{
              width: 64,
              background:
                'linear-gradient(to right, transparent, var(--ig-bg) 75%)',
            }}
          />
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* ── Following tab: show friends list ── */}
          {activeTab === 'following' ? (
            friendsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2">
                <span style={{ fontSize: 32 }}>👥</span>
                <p style={{ color: 'var(--ig-muted)', fontSize: 13 }}>
                  Bạn chưa theo dõi ai
                </p>
              </div>
            ) : (
              <section>
                <SectionLabel>Người mà bạn theo dõi</SectionLabel>
                {friendsList.map((friend: any) => (
                  <FriendRow
                    key={friend._id}
                    friend={friend}
                    onClose={onClose}
                  />
                ))}
              </section>
            )
          ) : activeTab === 'requests' ? (
            /* ── Requests tab: pending friend requests ── */
            pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-2">
                <span style={{ fontSize: 32 }}>🤝</span>
                <p style={{ color: 'var(--ig-muted)', fontSize: 13 }}>
                  Không có lời mời kết bạn nào
                </p>
              </div>
            ) : (
              <section>
                <SectionLabel>
                  Lời mời kết bạn · {pendingRequests.length}
                </SectionLabel>
                {pendingRequests.map((item: any) => (
                  <FriendRequestRow key={item._id} item={item} />
                ))}
              </section>
            )
          ) : (
          /* ── Other tabs: show notifications ── */
          filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2">
              <span style={{ fontSize: 32 }}>🔔</span>
              <p style={{ color: 'var(--ig-muted)', fontSize: 13 }}>
                Chưa có thông báo nào
              </p>
            </div>
          ) : (
            <>
              {/* Tháng này */}
              {thisMonth.length > 0 && (
                <section>
                  <SectionLabel>Tháng này</SectionLabel>
                  {thisMonth.map((note) => (
                    <NotificationItem
                      key={note._id}
                      note={note}
                      onClick={() => handleNoteClick(note)}
                      actionText={getActionText(note)}
                    />
                  ))}
                </section>
              )}

              {/* Trước đó */}
              {previous.length > 0 && (
                <section>
                  <SectionLabel>Trước đó</SectionLabel>
                  {previous.map((note) => (
                    <NotificationItem
                      key={note._id}
                      note={note}
                      onClick={() => handleNoteClick(note)}
                      actionText={getActionText(note)}
                    />
                  ))}
                </section>
              )}
            </>
          ))}
        </div>
      </div>
    </>
  );
};

/* ---------- SectionLabel ---------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-5 py-2"
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: 'var(--ig-text)',
        marginTop: 4,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- NotificationItem ---------- */
type ItemProps = {
  note: Notification;
  onClick: () => void;
  actionText: string;
};

function NotificationItem({ note, onClick, actionText }: ItemProps) {
  const isFollow = note.follow || (!note.like && !note.comment && !note.message);
  const isUnread = !note.seen;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
      style={{
        background: isUnread ? 'var(--ig-hover)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'var(--ig-hover)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = isUnread
          ? 'var(--ig-hover)'
          : 'transparent';
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 relative">
        <UserAvatar
          src={note.author?.image}
          fullName={note.author?.fullName}
          size="md"
        />
        {/* Unread dot overlay */}
        {isUnread && (
          <span
            className="absolute -bottom-0.5 -right-0.5 rounded-full border-2"
            style={{
              width: 10,
              height: 10,
              background: 'var(--ig-accent)',
              borderColor: 'var(--ig-bg)',
            }}
          />
        )}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.4,
            color: 'var(--ig-text)',
            margin: 0,
          }}
        >
          <span style={{ fontWeight: 600 }}>{note.author?.fullName}</span>{' '}
          <span style={{ color: 'var(--ig-text)', fontWeight: 400 }}>
            {actionText}
          </span>{' '}
          <span style={{ color: 'var(--ig-muted)', fontSize: 11 }}>
            <TimeAgo date={note.createdAt} />
          </span>
        </p>
      </div>

      {/* Follow button — only for follow-type notifications */}
      {isFollow && (
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors"
          style={{
            background: 'var(--ig-hover)',
            color: 'var(--ig-text)',
            border: '1px solid var(--ig-border)',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              'var(--ig-border)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              'var(--ig-hover)';
          }}
        >
          Đang theo dõi
        </button>
      )}
    </div>
  );
}

/* ---------- FriendRow ---------- */
type FriendRowProps = {
  friend: any;
  onClose: () => void;
};

function FriendRow({ friend, onClose }: FriendRowProps) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
      style={{ background: 'transparent' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'var(--ig-hover)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'transparent';
      }}
      onClick={() => {
        onClose();
        navigate(`/user/${friend._id}`);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onClose();
          navigate(`/user/${friend._id}`);
        }
      }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <UserAvatar
          src={friend.image}
          fullName={friend.fullName}
          size="md"
        />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p
          className="truncate"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ig-text)',
            margin: 0,
          }}
        >
          {friend.fullName}
        </p>
        {friend.username && (
          <p
            className="truncate"
            style={{ fontSize: 12, color: 'var(--ig-muted)', margin: 0 }}
          >
            @{friend.username}
          </p>
        )}
      </div>

      {/* Đang theo dõi button */}
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="flex-shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors"
        style={{
          background: 'var(--ig-hover)',
          color: 'var(--ig-text)',
          border: '1px solid var(--ig-border)',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--ig-border)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--ig-hover)';
        }}
      >
        Đang theo dõi
      </button>
    </div>
  );
}

/* ---------- FriendRequestRow ---------- */
function FriendRequestRow({ item }: { item: any }) {
  const navigate = useNavigate();
  const [accept, { isLoading: isAccepting }] = useAcceptFriendRequestMutation();
  const [cancel, { isLoading: isCanceling }] = useCancelFriendRequestMutation();

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 transition-colors"
      style={{ background: 'transparent' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'var(--ig-hover)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'transparent';
      }}
    >
      {/* Avatar — clickable to profile */}
      <div
        className="flex-shrink-0 cursor-pointer"
        onClick={() => navigate(`/user/${item._id}`)}
      >
        <div className="story-ring p-[2px]">
          <div className="p-[2px] rounded-full" style={{ background: 'var(--ig-bg)' }}>
            <UserAvatar src={item.image} fullName={item.fullName} size="md" />
          </div>
        </div>
      </div>

      {/* Name + actions */}
      <div className="flex-1 min-w-0">
        <p
          className="truncate"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ig-text)',
            margin: 0,
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/user/${item._id}`)}
        >
          {item.fullName}
        </p>
        <p style={{ fontSize: 12, color: 'var(--ig-muted)', margin: '2px 0 8px' }}>
          Muốn kết bạn với bạn
        </p>

        {/* Accept / Decline buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isAccepting}
            onClick={() => accept(item._id)}
            className="rounded-lg px-4 py-1.5 text-[12px] font-semibold transition-colors"
            style={{
              background: 'var(--ig-accent)',
              color: '#fff',
              opacity: isAccepting ? 0.6 : 1,
              border: 'none',
              cursor: isAccepting ? 'not-allowed' : 'pointer',
            }}
          >
            {isAccepting ? 'Đang xử lý...' : 'Chấp nhận'}
          </button>
          <button
            type="button"
            disabled={isCanceling}
            onClick={() => cancel(item._id)}
            className="rounded-lg px-4 py-1.5 text-[12px] font-semibold transition-colors"
            style={{
              background: 'var(--ig-hover)',
              color: 'var(--ig-text)',
              border: '1px solid var(--ig-border)',
              opacity: isCanceling ? 0.6 : 1,
              cursor: isCanceling ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--ig-border)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--ig-hover)';
            }}
          >
            {isCanceling ? 'Đang xử lý...' : 'Từ chối'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPanel;
