/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from '@components/Loading';
import { useLazyLoading } from '@hooks/index';
import Post from './Post';
import { useLikePostMutation } from '@services/postApi';
import { useUserInfo } from '@hooks/getUserinfo';
function PostList() {
  const { isFetching, posts } = useLazyLoading();
  const [likePost] = useLikePostMutation();
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
          handleLike={(postId: string) => {
            likePost(postId);
          }}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
}

export default PostList;
