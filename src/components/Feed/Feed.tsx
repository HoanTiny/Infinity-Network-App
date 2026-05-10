/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Bounce, toast, ToastOptions } from 'react-toastify';
import Loading from '@components/Loading';
import { useCreateNotification, useLazyLoading } from '@hooks/index';
import { useUserInfo } from '@hooks/getUserinfo';
import { useTheme } from '@hooks/useTheme';
import {
  useCommentPostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} from '@services/postApi';
import Post from './Post/Post';
import FeedSkeleton from './FeedSkeleton';
import type { PostLike } from './Post/Post.types';

type Props = { userId?: string };

const baseToastOpts: ToastOptions = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  transition: Bounce,
};

function Feed({ userId }: Props = {}) {
  const { isFetching, posts } = useLazyLoading({ userId });
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [commentPost, { isSuccess, error }] = useCommentPostMutation();
  const { handleCreateNotification } = useCreateNotification();
  const { _id: currentUserId } = useUserInfo() as { _id: string };
  const { effective } = useTheme();
  const [resetComment, setResetComment] = useState(false);

  useEffect(() => {
    const toastOpts: ToastOptions = { ...baseToastOpts, theme: effective };
    if (isSuccess) {
      setResetComment(true);
      toast.success('Comment successfully!', toastOpts);
    } else if (error) {
      toast.error('Comment failed!', toastOpts);
    }
  }, [isSuccess, error, effective]);

  const hasPosts = posts?.length > 0;

  if (!hasPosts && isFetching) return <FeedSkeleton count={3} />;
  if (!hasPosts) return null;

  return (
    <div className="max-w-[412px] ">
      {posts.map((post: any) => {
        const isLiked = post.likes.some(
          (l: PostLike) => l.author?._id === currentUserId,
        );

        return (
          <Post
            key={post._id}
            postId={post._id}
            authorId={post.author?._id}
            fullName={post.author?.fullName}
            authorImage={post.author?.image}
            createdAt={post.createdAt}
            content={post.content}
            imagePost={post.image}
            likes={post.likes}
            comments={post.comments}
            isLiked={isLiked}
            resetComment={resetComment}
            onLike={async (postId) => {
              if (isLiked) {
                unlikePost(postId);
                return;
              }
              const res = await likePost(postId).unwrap();
              handleCreateNotification({
                userId: post.author?._id,
                postId: post._id,
                type: 'like',
                typeId: res._id,
              });
            }}
            onComment={async (postId, comment) => {
              const res = await commentPost({ postId, comment }).unwrap();
              handleCreateNotification({
                userId: post.author?._id,
                postId: post._id,
                type: 'comment',
                typeId: res._id,
              });
            }}
          />
        );
      })}

      {isFetching && hasPosts && <Loading />}
    </div>
  );
}

export default Feed;
