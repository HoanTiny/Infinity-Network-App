import TimeAgo from '@components/TimeAgo';
import UserAvatar from '@components/UserAvatar';
import Send from '@mui/icons-material/Send';
import { TextField } from '@mui/material';
// import { useCreateNotificationMutation } from '@services/notificationApi';
import { useEffect, useState } from 'react';
import { Comment } from 'src/ultil/type';

type CommentSectionProps = {
  comments: Comment[];
  allComments?: Comment[];
  postId: string;
  handleComment: (postId: string, comment: string) => void;
  resetComment?: boolean;
};

const CommentSection = ({
  comments,
  allComments,
  postId,
  handleComment,
  resetComment,
}: CommentSectionProps) => {
  //   const [commentPost, { isSuccess, error }] = useCommentPostMutation();
  const [newComment, setNewComment] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);
  //   const [createNotification] = useCreateNotificationMutation();

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newComment.trim() !== '') {
      e.preventDefault();
      handleComment(postId, newComment);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const visibleComments = [...(allComments || comments)]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, visibleCount);

  useEffect(() => {
    if (resetComment) {
      setNewComment('');
    }
  }, [resetComment]);

  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="max-h-[400px] overflow-y-auto pr-2 flex flex-col gap-3">
        {visibleComments.map((comment) => (
          <div key={comment._id} className="flex gap-3 items-start">
            <div className="flex-shrink-0">
              <UserAvatar src={comment.author.image} size="sm" />
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 px-4 py-2.5 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[15px] text-gray-900">
                    {comment.author.fullName}
                  </span>
                  <span className="text-xs text-gray-500">
                    <TimeAgo date={comment.updatedAt} />
                  </span>
                </div>
                <p className="text-[15px] text-gray-800 leading-relaxed">
                  {comment.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length > visibleCount && (
        <button
          className="text-blue-600 text-sm font-medium self-start hover:text-blue-700 transition-colors"
          onClick={handleShowMore}
        >
          View more comments ({comments.length - visibleCount} more)
        </button>
      )}

      <div className="flex gap-3 items-center mt-2 pt-3 border-t border-gray-100">
        <div className="flex-shrink-0">
          <UserAvatar isMyAvatar size="sm" />
        </div>
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#fff',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '15px',
              '& fieldset': {
                border: '1px solid #e0e0e0',
              },
              '&:hover fieldset': {
                border: '1px solid #bdbdbd',
              },
              '&.Mui-focused fieldset': {
                border: '1px solid #424242',
              },
            },
          }}
        />
        <button
          onClick={async () => {
            if (newComment.trim() !== '') {
              handleComment(postId, newComment);
              setNewComment('');
            }
          }}
          className={`${
            newComment.trim() !== ''
              ? 'text-blue-600 hover:text-blue-700 cursor-pointer'
              : 'text-gray-400 cursor-not-allowed'
          } p-2 transition-colors flex-shrink-0`}
          disabled={newComment.trim() === ''}
        >
          <Send style={{ fontSize: 22 }} />
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
