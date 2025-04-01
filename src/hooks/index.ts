import { PostProps } from '@components/PostList/Post';
import { useMediaQuery, useTheme } from '@mui/material';
import { useGetPostsQuery } from '@services/postApi';
import { throttle } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';

export function useMediumScreen() {
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  return mediumScreen;
}

export const useLazyLoading = () => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { data, isFetching, isSuccess } = useGetPostsQuery({ offset, limit });

  console.log('useLazyLoading', data, offset);

  const previousDataRef = useRef<PostProps[] | undefined>();
  useEffect(() => {
    console.log('data', data);
    if (data && isSuccess && previousDataRef.current !== data) {
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      console.log('data', data);
      previousDataRef.current = data;
      setPosts((prevPosts) => {
        if (offset === 0) {
          return data;
        }
        return [...prevPosts, ...data];
      });
    }
  }, [data, isSuccess]);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setOffset((offset) => offset + limit);
    }
  };

  useInfinityScrolling({
    isFetching,
    hasMore,
    loadMore,
    offset,
    resetFn() {
      setOffset(0);
      setHasMore(true);
    },
  });

  return { hasMore, isFetching, loadMore, posts };
};

interface UseInfinityScrollingProps {
  isFetching: boolean;
  hasMore: boolean;
  loadMore: () => void;
  offset?: number;
  resetFn?: () => void;
}

export const useInfinityScrolling = ({
  isFetching,
  hasMore,
  loadMore,
  offset,
  resetFn,
}: UseInfinityScrollingProps) => {
  const handleScroll = useMemo(() => {
    return throttle(() => {
      console.log('handleScroll');
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop < 100 && offset && offset > 0) {
        if (resetFn) {
          resetFn();
        }

        return;
      }

      if (
        scrollTop + clientHeight + 50 >= scrollHeight &&
        !isFetching &&
        hasMore
      ) {
        loadMore();
      }
    }, 300);
  }, [isFetching, hasMore, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);
};
