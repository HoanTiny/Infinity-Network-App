import UserAvatar from '@components/UserAvatar';
import Send from '@mui/icons-material/Send';
import { TextField } from '@mui/material';
// import { useCreateNotificationMutation } from '@services/notificationApi';
import { useEffect, useState } from 'react';
import { Comment } from 'src/ultil/type';

type CommentSectionProps = {
  comments: Comment[];
  postId: string;
  handleComment: (postId: string, comment: string) => void;
  resetComment?: boolean;
};

const CommentSection = ({
  comments,
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

  const visibleComments = [...comments]
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
    <div className="flex flex-col gap-4 border-t border-gray-300 pt-4 ">
      <div className="max-h-96 overflow-y-auto pr-2 flex flex-col gap-4">
        {visibleComments.map((comment) => (
          <div key={comment._id} className="flex gap-3 items-start">
            <UserAvatar src={comment.author.image} />
            <div className="bg-gray-100 px-4 py-2 rounded-xl w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-[#344054]">
                  {comment.author.fullName}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.updatedAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-[#4B465C]">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {comments.length > visibleCount && (
        <button
          className="text-blue-500 text-sm self-start ml-14 hover:underline"
          onClick={handleShowMore}
        >
          Xem thêm bình luận
        </button>
      )}

      <div className="flex gap-3 items-start mt-2">
        <UserAvatar isMyAvatar />
        <TextField
          fullWidth
          multiline
          size="small"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: '12px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              padding: '8px',
            },
          }}
        />
        <button
          onClick={async () => {
            handleComment(postId, newComment);
          }}
          className={`${
            newComment.trim() !== '' ? 'text-[#3096e0]' : 'cursor-not-allowed'
          } p-2 rounded-lg text-[#ccc]`}
          disabled={newComment.trim() === ''}
        >
          <Send style={{ fontSize: 20 }} />
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
