import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react';

type Props = {
  isLiked?: boolean;
  likesCount?: number;
  commentsCount?: number;
  onLike: () => void;
  onComment: () => void;
  onShare?: () => void;
  onSave?: () => void;
};

function PostActions({
  isLiked,
  likesCount = 0,
  commentsCount = 0,
  onLike,
  onComment,
  onShare,
  onSave,
}: Props) {
  return (
    <div className="flex items-center gap-1 px-3 pt-3 pb-2">
      <button
        type="button"
        aria-label={isLiked ? 'Unlike' : 'Like'}
        aria-pressed={isLiked}
        className={`flex items-center gap-1.5 px-1 py-1 rounded-md hover:bg-ig-hover transition-colors ${isLiked ? 'text-ig-heart' : 'text-ig-text'}`}
        onClick={onLike}
      >
        <Heart
          size={22}
          strokeWidth={isLiked ? 0 : 1.75}
          fill={isLiked ? 'currentColor' : 'none'}
          className="transition-transform active:scale-90"
        />
        {likesCount > 0 && (
          <span className="text-[13px] font-medium leading-none">{likesCount.toLocaleString()}</span>
        )}
      </button>

      <button
        type="button"
        aria-label="Comment"
        className="flex items-center gap-1.5 px-1 py-1 rounded-md text-ig-text hover:bg-ig-hover transition-colors"
        onClick={onComment}
      >
        <MessageCircle size={22} strokeWidth={1.75} className="-scale-x-100" />
        {commentsCount > 0 && (
          <span className="text-[13px] font-medium leading-none text-ig-text">{commentsCount.toLocaleString()}</span>
        )}
      </button>

      <button
        type="button"
        aria-label="Share"
        className="flex items-center px-1 py-1 rounded-md text-ig-text hover:bg-ig-hover transition-colors"
        onClick={onShare}
      >
        <Send size={22} strokeWidth={1.75} />
      </button>

      <button
        type="button"
        aria-label="Save"
        className="flex items-center px-1 py-1 rounded-md text-ig-text hover:bg-ig-hover transition-colors ml-auto"
        onClick={onSave}
      >
        <Bookmark size={22} strokeWidth={1.75} />
      </button>
    </div>
  );
}

export default PostActions;
