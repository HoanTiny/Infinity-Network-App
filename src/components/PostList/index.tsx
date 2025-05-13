/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from '@components/Loading';
import { useLazyLoading } from '@hooks/index';
import Post from './Post';
import { useLikePostMutation, useUnlikePostMutation } from '@services/postApi';
import { useUserInfo } from '@hooks/getUserinfo';
import { useCreateNotificationMutation } from '@services/notificationApi';
function PostList() {
  const { isFetching, posts } = useLazyLoading();
  const [likePost] = useLikePostMutation();
  const [createNotification] = useCreateNotificationMutation();
  const [unlikePost] = useUnlikePostMutation();
  const { _id } = useUserInfo() as { _id: string };

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
              if (_id === res.author) {
                createNotification({
                  userId: post.author?._id,
                  postId: post._id,
                  type: 'like',
                  typeId: res._id,
                });
              }
            }
          }}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
}

export default PostList;
