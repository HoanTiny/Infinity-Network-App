/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from '@components/Loading';
import { useCreateNotification, useLazyLoading } from '@hooks/index';
import Post from './Post';
import {
  useCommentPostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} from '@services/postApi';
import { useUserInfo } from '@hooks/getUserinfo';
// import { useCreateNotificationMutation } from '@services/notificationApi';
import { useEffect, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
function PostList() {
  const { isFetching, posts } = useLazyLoading();
  const [likePost] = useLikePostMutation();
  const { handleCreateNotification } = useCreateNotification();
  const [unlikePost] = useUnlikePostMutation();
  const { _id } = useUserInfo() as { _id: string };
  console.log('posts', posts);
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
      {posts?.map((post: any, index) => (
        <Post
          key={index}
          fullName={post.author?.fullName}
          createAt={post?.createdAt}
          content={post.content}
          image={post?.image}
          likes={post?.likes}
          comments={post?.comments}
          postId={post._id}
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
      ))}
      {isFetching && <Loading />}
    </div>
  );
}

export default PostList;
