/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageIcon, Mic, SendHorizonal, Smile, X } from 'lucide-react';
import {
  useMarkConversationAsSeenMutation,
  useSendMeassageMutation,
} from '@services/messagesApi';
import { useEffect, useRef, useState } from 'react';
import { useCreateNotification } from '@hooks/index';
import { socket } from '@context/SocketProvider';

interface Props {
  userId?: string;
  replyTo?: any;
  onCancelReply?: () => void;
  onSendSuccess?: () => void;
}

const MessageCreation = ({ userId, replyTo, onCancelReply, onSendSuccess }: Props) => {
  const [newMessage, setNewMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [markConversationAsSeen] = useMarkConversationAsSeenMutation();
  const [sendMessage] = useSendMeassageMutation();
  const { handleCreateNotification } = useCreateNotification();

  // Mark conversation as seen when opening a chat
  useEffect(() => {
    if (userId) {
      markConversationAsSeen({ sender: userId });
    }
  }, [userId, markConversationAsSeen]);

  // Focus textarea when reply target changes
  useEffect(() => {
    if (replyTo) textareaRef.current?.focus();
  }, [replyTo]);

  const syncHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  const handleSendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !userId) return;

    setNewMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const response = await sendMessage({
      message: trimmed,
      receiver: userId,
      ...(replyTo && { replyToId: replyTo._id }),
    }).unwrap();

    socket.emit('CREATE_MESSAGE', response);
    handleCreateNotification({
      userId,
      postId: null,
      type: 'MESSAGE',
      typeId: response._id,
    });

    onSendSuccess?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = newMessage.trim().length > 0;

  return (
    <div className="px-4 pt-2 pb-3 border-t border-ig-border bg-ig-bg shrink-0">
      {/* Reply preview strip */}
      {replyTo && (
        <div className="mb-2 flex items-center gap-2 px-3 py-2 bg-ig-hover rounded-xl border-l-[3px] border-[#3897F0]">
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[#3897F0] leading-tight">
              Trả lời {replyTo.sender?.fullName}
            </p>
            <p className="text-[12px] text-ig-muted truncate mt-0.5">
              {replyTo.message}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 rounded-full hover:bg-ig-border text-ig-muted hover:text-ig-text transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Left icons */}
        <div className="flex items-center gap-0.5 pb-1.5 shrink-0">
          <button className="p-2 rounded-full hover:bg-ig-hover transition-colors text-[#3897F0]">
            <Smile size={22} />
          </button>
          <button className="p-2 rounded-full hover:bg-ig-hover transition-colors text-[#3897F0]">
            <ImageIcon size={22} />
          </button>
        </div>

        {/* Textarea wrapper */}
        <div className="flex-1 flex items-end bg-ig-hover rounded-[22px] px-4 py-2.5 min-h-[42px]">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Nhắn tin..."
            className="flex-1 bg-transparent text-[14px] text-ig-text placeholder:text-ig-muted outline-none resize-none leading-relaxed overflow-hidden"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              syncHeight();
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Send / Mic */}
        <div className="pb-1.5 shrink-0">
          {canSend ? (
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-full bg-[#3897F0] hover:bg-[#1d7de8] transition-colors text-white shadow-[0_2px_8px_rgba(56,151,240,0.35)]"
            >
              <SendHorizonal size={18} />
            </button>
          ) : (
            <button
              className="p-2 rounded-full hover:bg-ig-hover transition-colors text-[#3897F0]"
              disabled
            >
              <Mic size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCreation;
