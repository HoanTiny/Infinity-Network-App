/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetPostsQuery } from '@services/rootApi';
import { useCallback, useEffect, useRef, useState } from 'react';
import Post, { PostProps } from './Post';
import Loading from '@components/Loading';

function PostList() {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { data, isFetching, isSuccess } = useGetPostsQuery({ offset, limit });
  // const posts = data as PostProps[] | undefined;
  // console.log('Data', data);

  const previousDataRef = useRef<PostProps[] | undefined>();
  // console.log('first', previousDataRef.current);
  useEffect(() => {
    if (data && isSuccess && previousDataRef.current !== data) {
      if (data.length === 0) {
        setHasMore(false);
      }
      console.log('data', data);
      previousDataRef.current = data;
      setPosts((prevPosts) => {
        return [...prevPosts, ...data];
      });
    }
  }, [data, isSuccess]);

  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // console.log('first', scrollTop, scrollHeight, clientHeight);

    if (
      scrollTop + clientHeight + 50 >= scrollHeight &&
      !isFetching &&
      hasMore
    ) {
      setOffset(offset + limit);
      console.log('fetching APIs', scrollTop, scrollHeight, clientHeight);
    }
  }, [isFetching, hasMore, offset]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // if (isFetching) {
  //   return <Loading />;
  // }
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
      {isFetching && <Loading />}
    </div>
  );
}

export default PostList;
