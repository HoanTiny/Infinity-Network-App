import TimeAgo from '@components/TimeAgo';

type Props = {
  fullName: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  onToggleComments: () => void;
};

function PostFooter({
  fullName,
  content,
  likesCount,
  commentsCount,
  createdAt,
  onToggleComments,
}: Props) {
  return (
    <div className="px-4 pb-3 space-y-1">
      {likesCount > 0 && (
        <p className="text-[14px] font-semibold text-ig-text">
          {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
        </p>
      )}

      {content && (
        <p className="text-[14px] text-ig-text leading-snug">
          <span className="font-semibold mr-1.5">{fullName}</span>
          <span className="whitespace-pre-wrap break-words">{content}</span>
        </p>
      )}

      {commentsCount > 0 && (
        <button
          type="button"
          onClick={onToggleComments}
          className="block text-[14px] text-ig-muted hover:opacity-70"
        >
          View all {commentsCount}{' '}
          {commentsCount === 1 ? 'comment' : 'comments'}
        </button>
      )}

      <p className="text-[10px] uppercase tracking-wider text-ig-muted pt-1">
        <TimeAgo date={createdAt} />
      </p>
    </div>
  );
}

export default PostFooter;
