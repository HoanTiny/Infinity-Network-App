import UserAvatar from '@components/UserAvatar';
import TimeAgo from '@components/TimeAgo';
import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  authorId: string;
  fullName: string;
  authorImage?: string;
  createdAt: string;
};

function PostHeader({ authorId, fullName, authorImage, createdAt }: Props) {
  return (
    <header className="flex items-center gap-3 px-4 py-3">
      <Link to={`/user/${authorId}`} className="shrink-0">
        <UserAvatar src={authorImage} size="sm" />
      </Link>

      <div className="flex-1 min-w-0 flex items-baseline gap-1.5">
        <Link
          to={`/user/${authorId}`}
          className="text-[14px] font-semibold text-ig-text truncate hover:opacity-70"
        >
          {fullName}
        </Link>
        <span className="text-ig-muted text-[14px] leading-none">·</span>
        <span className="text-ig-muted text-[12px]">
          <TimeAgo date={createdAt} />
        </span>
      </div>

      <button
        type="button"
        aria-label="More options"
        className="p-2 -m-2 text-ig-text hover:opacity-60"
      >
        <MoreHorizontal size={20} strokeWidth={1.75} />
      </button>
    </header>
  );
}

export default PostHeader;
