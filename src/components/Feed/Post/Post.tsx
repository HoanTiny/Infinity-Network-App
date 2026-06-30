import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import PostActions from './PostActions';
import PostFooter from './PostFooter';
import type { PostProps } from './Post.types';
import { useLocation, useNavigate } from 'react-router-dom';

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
  onLike,
}: PostProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const openDetail = () => {
    navigate(`/posts/${postId}`, { state: { background: location } });
  };

  return (
    <article className="bg-ig-bg  rounded-xl overflow-hidden">
      <PostHeader
        authorId={authorId}
        fullName={fullName}
        authorImage={authorImage}
        createdAt={createdAt}
      />

      {imagePost && <PostMedia src={imagePost} alt={`${fullName}'s post`} />}

      <PostActions
        isLiked={isLiked}
        likesCount={likes.length}
        commentsCount={comments.length}
        onLike={() => onLike(postId)}
        onComment={openDetail}
      />

      <PostFooter
        fullName={fullName}
        content={content}
        commentsCount={comments.length}
        createdAt={createdAt}
        onToggleComments={openDetail}
      />

    </article>
  );
}

export default Post;
