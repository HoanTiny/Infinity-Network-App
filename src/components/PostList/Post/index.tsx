/* eslint-disable @typescript-eslint/no-explicit-any */
import CommentSection from "@components/CommentSection";
import TimeAgo from "@components/TimeAgo";
import UserAvatar from "@components/UserAvatar";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Comment } from "src/ultil/type";

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
  imagePost?: string;
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
  imagePost,
  auhorId = "",
}: PostProps) {
  const [toggleComment, setToggleComment] = useState(false);

  const handleToggleComment = () => {
    setToggleComment((prev) => !prev);
    console.log("toggleComment", toggleComment);
  };

  const displayedComments = toggleComment ? comments : comments.slice(0, 2);

  // console.log('comments', comments);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in mb-6">
      {/* Post Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <div className="story-ring p-1">
          <div className="bg-white p-0.5 rounded-full">
            <UserAvatar src={image} size="lg" />
          </div>
        </div>
        <div className="flex-1">
          <Link
            to={`/user/${auhorId}`}
            className="text-[16px] font-semibold hover:text-gray-600 transition-colors text-gray-900"
          >
            {fullName}
          </Link>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-[13px]">
              <TimeAgo date={createAt} />
            </span>
          </div>
        </div>
        <IconButton className="hover:bg-gray-100 rounded-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="6" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="18" r="2" />
          </svg>
        </IconButton>
      </div>

      {/* Post Content */}
      <div className="px-5 py-4">
        {content && (
          <p className="text-[16px] text-gray-800 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        )}
      </div>

      {/* Post Image */}
      {imagePost && (
        <div className="w-full bg-gray-50">
          <img
            src={imagePost}
            alt="Post content"
            className="w-full h-auto object-cover max-h-[700px]"
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {isLiked ? (
            <img
              src="/icons/intagram/hearted.png"
              alt="liked"
              width={20}
              height={20}
            />
          ) : (
            <div className="w-[20px] h-[20px] rounded-full  items-center justify-center">
              <img
                src="/icons/intagram/heart.png"
                alt="liked"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
          )}
          {likes.length > 0 && (
            <span className="text-sm font-medium text-gray-700">
              {likes.length}
            </span>
          )}
        </div>

        {comments.length > 0 && (
          <div
            className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
            onClick={handleToggleComment}
          >
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center px-4 py-3 gap-1">
        <button
          className={`p-2 rounded-full transition-all duration-200 hover:bg-gray-100 ${
            isLiked ? "text-red-500" : "text-gray-700"
          }`}
          onClick={() => handleLike(postId)}
          title="Like"
        >
          {isLiked ? (
            <img
              src="/icons/intagram/hearted.png"
              alt="liked"
              width={20}
              height={20}
              className="object-contain"
            />
          ) : (
            <img
              src="/icons/intagram/heart.png"
              alt="like"
              width={20}
              height={20}
              className="object-contain opacity-70 hover:opacity-100"
            />
          )}
        </button>

        <button
          className={`p-2 rounded-full transition-all duration-200 hover:bg-gray-100 text-gray-700 ${
            toggleComment ? "bg-gray-100" : ""
          }`}
          onClick={handleToggleComment}
          title="Comment"
        >
          <img
            src="/icons/intagram/cmt-int.png"
            alt="comment"
            width={20}
            height={20}
            className="object-contain opacity-70 hover:opacity-100"
          />
        </button>

        <button
          className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100 text-gray-700"
          title="Share"
        >
          <img
            src="/icons/intagram/send.png"
            alt="share"
            width={20}
            height={20}
            className="object-contain opacity-70 hover:opacity-100"
          />
        </button>

        <button
          className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100 text-gray-700"
          title="Save"
        >
          <img
            src="/icons/intagram/bookmark.png"
            alt="bookmark"
            width={20}
            height={20}
            className="object-contain opacity-70 hover:opacity-100"
          />
        </button>
      </div>

      {/* Comment Section */}
      {toggleComment && (
        <div className="border-t border-gray-100 bg-gray-50/50">
          <CommentSection
            comments={displayedComments}
            allComments={comments}
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
