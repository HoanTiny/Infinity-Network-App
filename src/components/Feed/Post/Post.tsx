import { useState } from 'react';
import CommentSection from '@components/CommentSection';
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import PostActions from './PostActions';
import PostFooter from './PostFooter';
import type { PostProps } from './Post.types';

function Post({
  postId,
  authorId,
  fullName,
  authorImage,
  createdAt,
  content,
  imagePost,
  likes = [],
  comments = [],
  isLiked = false,
  resetComment,
  onLike,
  onComment,
}: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const toggleComments = () => setShowComments((v) => !v);

  return (
    <article className="bg-ig-bg border-b border-ig-border sm:border-b-0 sm:mb-10">
      <PostHeader
        authorId={authorId}
        fullName={fullName}
        authorImage={authorImage}
        createdAt={createdAt}
      />

      {imagePost && <PostMedia src={imagePost} alt={`${fullName}'s post`} />}

      <PostActions
        isLiked={isLiked}
        onLike={() => onLike(postId)}
        onComment={toggleComments}
      />

      <PostFooter
        fullName={fullName}
        content={content}
        likesCount={likes.length}
        commentsCount={comments.length}
        createdAt={createdAt}
        onToggleComments={toggleComments}
      />

      {showComments && (
        <div className="border-t border-ig-border">
          <CommentSection
            comments={comments}
            allComments={comments}
            postId={postId}
            handleComment={onComment}
            resetComment={resetComment}
          />
        </div>
      )}
    </article>
  );
}

export default Post;
