import UserAvatar from '@components/UserAvatar';
import TimeAgo from '@components/TimeAgo';
import { MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  authorId: string;
  fullName: string;
  authorImage?: string;
  createdAt: string;
  location?: string;
};

function PostHeader({ authorId, fullName, authorImage, createdAt, location }: Props) {
  return (
    <header className="flex items-center gap-3 px-4 py-3">
      <Link to={`/user/${authorId}`} className="shrink-0">
        <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
          <div className="p-[2px] rounded-full bg-ig-bg">
            <UserAvatar src={authorImage} size="sm" />
          </div>
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            to={`/user/${authorId}`}
            className="text-[14px] font-semibold text-ig-text hover:opacity-70 leading-tight"
          >
            {fullName}
          </Link>
          <span className="text-ig-muted text-[13px] leading-tight">·</span>
          <span className="text-ig-muted text-[13px] leading-tight">
            <TimeAgo date={createdAt} />
          </span>
        </div>
        {location && (
          <p className="text-[12px] text-ig-muted leading-tight mt-0.5 truncate">{location}</p>
        )}
      </div>

      <button
        type="button"
        aria-label="More options"
        className="p-2 -mr-2 text-ig-text hover:opacity-60 rounded-full hover:bg-ig-hover transition-colors"
      >
        <MoreHorizontal size={20} strokeWidth={1.75} />
      </button>
    </header>
  );
}

export default PostHeader;
