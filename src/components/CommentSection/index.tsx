import TimeAgo from '@components/TimeAgo';
import UserAvatar from '@components/UserAvatar';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Comment } from 'src/ultil/type';

type CommentSectionProps = {
  comments: Comment[];
  allComments?: Comment[];
  postId: string;
  handleComment: (postId: string, comment: string) => void;
  resetComment?: boolean;
};

const PAGE_SIZE = 5;

const CommentSection = ({
  comments,
  allComments,
  postId,
  handleComment,
  resetComment,
}: CommentSectionProps) => {
  const source = allComments && allComments.length ? allComments : comments;
  const [newComment, setNewComment] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sorted = [...source].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const visible = sorted.slice(0, visibleCount);
  const remaining = sorted.length - visibleCount;

  const trimmed = newComment.trim();
  const canPost = trimmed.length > 0;

  const submit = () => {
    if (!canPost) return;
    handleComment(postId, trimmed);
    setNewComment('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
  };

  useEffect(() => {
    if (resetComment) setNewComment('');
  }, [resetComment]);

  useEffect(() => {
    if (textareaRef.current) autoResize(textareaRef.current);
  }, [newComment]);

  return (
    <div className="bg-ig-bg">
      <ul className="px-4 pt-3 pb-2 space-y-3">
        {remaining > 0 && (
          <li>
            <button
              type="button"
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              className="text-[14px] text-ig-muted hover:text-ig-text transition-colors"
            >
              View previous comments ({remaining})
            </button>
          </li>
        )}

        {visible.map((c) => (
          <li key={c._id} className="flex gap-3">
            <Link to={`/user/${c.author._id}`} className="shrink-0 pt-0.5">
              <UserAvatar src={c.author.image} size="sm" />
            </Link>

            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-ig-text leading-snug">
                <Link
                  to={`/user/${c.author._id}`}
                  className="font-semibold mr-1.5 hover:opacity-70"
                >
                  {c.author.fullName}
                </Link>
                <span className="whitespace-pre-wrap break-words">
                  {c.comment}
                </span>
              </p>

              <div className="flex items-center gap-4 mt-1 text-[12px] text-ig-muted">
                <TimeAgo date={c.updatedAt} />
                <button
                  type="button"
                  className="font-semibold hover:text-ig-text transition-colors"
                >
                  Reply
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-start gap-3 px-4 py-3 border-t border-ig-border"
      >
        <div className="shrink-0 pt-0.5">
          <UserAvatar isMyAvatar size="sm" />
        </div>

        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none bg-transparent text-[14px] text-ig-text placeholder:text-ig-muted outline-none border-0 leading-snug py-1.5 max-h-20"
        />

        <button
          type="submit"
          disabled={!canPost}
          className={`text-[14px] font-semibold transition-opacity py-1.5 ${
            canPost
              ? 'text-ig-accent hover:opacity-70'
              : 'text-ig-accent/40 cursor-not-allowed'
          }`}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
