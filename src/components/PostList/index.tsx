/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from '@components/Loading';
import { useLazyLoading } from '@hooks/index';
import Post from './Post';
function PostList() {
  const { isFetching, posts } = useLazyLoading();

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
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
}

export default PostList;
