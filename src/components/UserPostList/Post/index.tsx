/* eslint-disable @typescript-eslint/no-explicit-any */
import CommentSection from '@components/CommentSection';
import { CommentIcon, LikeIcon, ShareIcon } from '@components/Icon';
import { Avatar } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Comment } from 'src/ultil/type';

export type PostProps = {
  fullName: string;
  createAt: string;
  content: string;
  image: string;
  likes: Array<string>;
  comments: Comment[];
  handleLike: (postId: string) => void;
  postId: string;
  isLiked?: boolean;
  handleComment: (postId: string, comment: string) => void;
  resetComment?: boolean;
  auhorId?: string;
};

function Post({
  fullName,
  createAt,
  content,
  image,
  postId,
  likes = [],
  comments = [],
  handleLike,
  isLiked = false,
  handleComment,
  resetComment,
  auhorId = '',
}: PostProps) {
  const [toggleComment, setToggleComment] = useState(false);

  const handleToggleComment = () => {
    setToggleComment((prev) => !prev);
    console.log('toggleComment', toggleComment);
  };
  // console.log('comments', comments);
  return (
    <div className="flex flex-col gap-4 bg-light-100 card mt-4 rounded-lg">
      <div className="flex gap-4 ">
        <Avatar sx={{ bgcolor: deepOrange[500] }}>H</Avatar>
        <div className="">
          <Link
            to={`/user/${auhorId}`}
            className="text-[16px] hover:underline cursor-pointer"
          >
            {fullName}
          </Link>
          <div className="flex text-[16px] rounded-lg">
            <span className="text-[#4B465C] text-[13px]">
              {dayjs(createAt).format('DD/MM/YYYY HH:mm')}
            </span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[16px]">{content}</p>
      </div>

      <div>
        {image && (
          <img
            src={image}
            alt="random"
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>

      <div className="flex gap-4 justify-between">
        <div className="flex gap-2 items-center">
          {isLiked ? (
            <img src="/icons/Liked.svg" alt="like" width={20} height={20} />
          ) : (
            <LikeIcon width={20} height={20} />
          )}
          <span className="text-[16px] text-[#4B465C]">{likes.length}</span>
        </div>

        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={handleToggleComment}
        >
          <span className="text-[16px] text-[#4B465C]">
            {comments.length} Comments
          </span>
        </div>
      </div>

      <div className="flex gap-4 justify-between border-t border-[#DBDADE] pt-3 px-6">
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => handleLike(postId)}
        >
          {isLiked ? (
            <img src="/icons/Liked.svg" alt="like" width={20} height={20} />
          ) : (
            <LikeIcon width={20} height={20} />
          )}

          <span className="text-[16px] text-[#4B465C]">Like</span>
        </div>

        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={handleToggleComment}
        >
          <CommentIcon width={20} height={20} />
          <span className="text-[16px] text-[#4B465C]">Comments</span>
        </div>

        <div className="flex gap-2 items-center">
          <ShareIcon width={20} height={20} />
          <span className="text-[16px] text-[#4B465C]">Shares</span>
        </div>
      </div>
      {toggleComment && (
        <div>
          <CommentSection
            comments={comments}
            postId={postId}
            handleComment={handleComment}
            resetComment={resetComment}
          />
        </div>
      )}
    </div>
  );
}

export default Post;
