/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from '@components/Loading';
import { useCreateNotification } from '@hooks/index';
import Post from './Post';
import {
  useCommentPostMutation,
  useGetPostsByAuthorIdQuery,
  useLikePostMutation,
  useUnlikePostMutation,
} from '@services/postApi';
import { useUserInfo } from '@hooks/getUserinfo';
// import { useCreateNotificationMutation } from '@services/notificationApi';
import { useEffect, useState } from 'react';
import { Bounce, toast } from 'react-toastify';

function PostList({ userId }: any) {
  // const { isFetching, posts } = useLazyLoading();

  const { data, isFetching } = useGetPostsByAuthorIdQuery({
    limit: 10,
    offset: 0,
    userId,
  });
  const [likePost] = useLikePostMutation();
  const { handleCreateNotification } = useCreateNotification();
  const [unlikePost] = useUnlikePostMutation();
  const { _id } = useUserInfo() as { _id: string };
  const [commentPost, { isSuccess, error }] = useCommentPostMutation();
  const [resetComment, setResetComment] = useState(false);

  const notifySuccess = () =>
    toast.success('Comment successfully!', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
      transition: Bounce,
    });

  useEffect(() => {
    if (isSuccess) {
      setResetComment(true);
      notifySuccess();
    } else if (error) {
      toast.error('Comment failed!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
      });
    }
  }, [isSuccess, error]);

  return (
    <div>
      {data?.posts && data.posts.length > 0
        ? data.posts.map((post: any, index) => (
            <Post
              key={index}
              fullName={post.author?.fullName}
              createAt={post?.createdAt}
              content={post.content}
              image={post?.image}
              likes={post?.likes}
              comments={post?.comments}
              postId={post._id}
              auhorId={post.author?._id}
              isLiked={post.likes.some((like: any) => like.author?._id === _id)}
              handleLike={async (postId: string) => {
                if (post.likes.some((like: any) => like.author?._id === _id)) {
                  unlikePost(postId);
                } else {
                  const res = await likePost(postId).unwrap();
                  console.log('res', res, post);

                  handleCreateNotification({
                    userId: post.author?._id,
                    postId: post._id,
                    type: 'like',
                    typeId: res._id,
                  });
                }
              }}
              handleComment={async (postId: string, comment: string) => {
                const res = await commentPost({
                  postId,
                  comment: comment,
                }).unwrap();
                console.log('res', res, post);

                handleCreateNotification({
                  userId: post.author?._id,
                  postId: post._id,
                  type: 'comment',
                  typeId: res._id,
                });
              }}
              resetComment={resetComment}
            />
          ))
        : isFetching
        ? // Skeleton loading placeholders
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="mb-4 bg-white rounded-lg shadow p-4 animate-pulse"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="ml-3 space-y-1 w-full">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-64 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))
        : null}
      {isFetching && data?.posts && data?.posts.length > 0 && <Loading />}
    </div>
  );
}

export default PostList;
