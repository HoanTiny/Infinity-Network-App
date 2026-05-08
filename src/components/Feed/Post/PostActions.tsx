import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react';

type Props = {
  isLiked?: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare?: () => void;
  onSave?: () => void;
};

const iconBtn =
  'p-2 -ml-2 first:-ml-2 text-ig-text hover:opacity-60 transition-opacity';

function PostActions({ isLiked, onLike, onComment, onShare, onSave }: Props) {
  return (
    <div className="flex items-center px-4 pt-2 pb-1">
      <button
        type="button"
        aria-label={isLiked ? 'Unlike' : 'Like'}
        aria-pressed={isLiked}
        className={`${iconBtn} ${isLiked ? 'text-ig-heart hover:opacity-100' : ''}`}
        onClick={onLike}
      >
        <Heart
          size={24}
          strokeWidth={isLiked ? 0 : 1.75}
          fill={isLiked ? 'currentColor' : 'none'}
          className="transition-transform active:scale-90"
        />
      </button>

      <button
        type="button"
        aria-label="Comment"
        className={iconBtn}
        onClick={onComment}
      >
        <MessageCircle size={24} strokeWidth={1.75} className="-scale-x-100" />
      </button>

      <button
        type="button"
        aria-label="Share"
        className={iconBtn}
        onClick={onShare}
      >
        <Send size={24} strokeWidth={1.75} />
      </button>

      <button
        type="button"
        aria-label="Save"
        className={`${iconBtn} ml-auto -mr-2`}
        onClick={onSave}
      >
        <Bookmark size={24} strokeWidth={1.75} />
      </button>
    </div>
  );
}

export default PostActions;
