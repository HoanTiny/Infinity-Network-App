/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from '@components/Loading';
import { useGetPostsQuery } from '@services/rootApi';
import Post, { PostProps } from './Post';

function PostList() {
  const { data, isFetching } = useGetPostsQuery();
  const posts = data as PostProps[] | undefined;
  console.log('Data', data);

  if (isFetching) {
    return <Loading />;
  }
  return (
    <div>
      {posts?.map((post: any) => (
        <Post
          key={post._id}
          fullName={post.author?.fullName}
          createAt={post?.createdAt}
          content={post.content}
          image={post?.image}
          likes={post?.likes}
          comments={post?.comments}
        />
      ))}
    </div>
  );
}

export default PostList;
