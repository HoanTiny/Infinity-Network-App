/* eslint-disable @typescript-eslint/no-explicit-any */
// import { PostsApiResponse } from '@components/PostList/Post';
import { useMediaQuery, useTheme } from '@mui/material';
import { useCreateNotificationMutation } from '@services/notificationApi';
import {
  useGetPostsByAuthorIdQuery,
  useGetPostsQuery,
} from '@services/postApi';
import { throttle } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PostResponsive } from 'src/ultil/type';
import { useUserInfo } from './getUserinfo';
import { socket } from '@context/SocketProvider';

export function useMediumScreen() {
  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  return mediumScreen;
}

export const useLazyLoading = ({ userId }: { userId?: string } = {}) => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  // const [posts, setPosts] = useState<PostProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  // const { data = { ids: [], entities: {} }, isFetching, isSuccess } = useGetPostsQuery({ offset, limit });
  const {
    data: dataGetPostHome = { ids: [], entities: {} } as PostResponsive,
    isFetching: isFetchingHome,
    refetch: refetchHome,
  } = useGetPostsQuery({ offset, limit }, { skip: !!userId });

  const {
    data: dataUserInfo = { ids: [], entities: {} } as PostResponsive,
    isFetching: isFetchingUserInfo,
    refetch: refetchUserInfo,
  } = useGetPostsByAuthorIdQuery(
    { offset, limit, userId: userId },
    { skip: !userId }
  );

  const isFetching = userId ? isFetchingUserInfo : isFetchingHome;
  const refetch = userId ? refetchUserInfo : refetchHome;
  const data = userId ? dataUserInfo : dataGetPostHome;
  console.log('useLazyLoading', data, offset, userId);

  // console.log('useGetPostsByAuthorIdQuery', dataUserInfo, isFetchingUserInfo);

  const posts = useMemo(() => {
    if ('entities' in data) {
      return data.ids.map((id: string) => data.entities[id]);
    }
    return [];
  }, [data]);

  console.log('posts', posts);
  // const previousDataRef = useRef<PostProps[] | undefined>();
  const prevPostCountRef = useRef(0);
  useEffect(() => {
    console.log('data', data);
    if (!isFetching && data && hasMore) {
      const currentPostCount = Array.isArray(data) ? 0 : data.ids.length;
      const newFetchedCount = currentPostCount - prevPostCountRef.current;

      if (userId) {
        if (data.ids.length === dataUserInfo.meta?.total) {
          setHasMore(false);
        }
      }

      console.log('currentPostCount', currentPostCount);
      console.log('newFetchedCount', newFetchedCount);
      if (newFetchedCount === 0) {
        setHasMore(false);
      } else {
        prevPostCountRef.current = currentPostCount;
      }
    }
  }, [data, isFetching, hasMore, userId]);

  const loadMore = useCallback(async () => {
    setOffset((offset) => offset + limit);
  }, []);

  useEffect(() => {
    refetch();
  }, [offset, refetch]);

  useInfinityScrolling({
    isFetching,
    hasMore,
    loadMore,
  });

  return { hasMore, isFetching, loadMore, posts };
};

interface UseInfinityScrollingProps {
  isFetching: boolean;
  hasMore: boolean;
  loadMore: () => void;
  // offset?: number;
  // resetFn?: () => void;
}

export const useInfinityScrolling = ({
  isFetching,
  hasMore,
  loadMore,
}: // offset,
// resetFn,
UseInfinityScrollingProps) => {
  const handleScroll = useMemo(() => {
    return throttle(() => {
      console.log('handleScroll', isFetching);
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // if (scrollTop < 100 && offset && offset > 0) {
      //   if (resetFn) {
      //     resetFn();
      //   }

      //   return;
      // }

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

// CREATE_NOTIFICATION

export const useCreateNotification = () => {
  const [createNotification] = useCreateNotificationMutation();
  const userId = useUserInfo();
  const handleCreateNotification = async ({
    userId: receiverId,
    postId,
    type,
    typeId,
  }: {
    userId: string;
    postId: string;
    type: string;
    typeId: string;
  }) => {
    try {
      if (userId === receiverId) {
        return;
      }
      const res = await createNotification({
        userId: receiverId,
        postId,
        type,
        typeId,
      }).unwrap();
      console.log('res', res);
      socket.emit('CREATE_NOTIFICATION', res);
    } catch (error) {
      console.log('error', error);
    }
  };
  return { handleCreateNotification };
};
