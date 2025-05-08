/* eslint-disable @typescript-eslint/no-explicit-any */
// import { PostProps, PostsApiResponse } from '@components/PostList/Post';
import { rootApi } from './rootApi';
import { createEntityAdapter } from '@reduxjs/toolkit';
import { PostResponsive, RawPost } from 'src/ultil/type';

const postsAdapter = createEntityAdapter({
  selectId: (post: any) => post._id,
  sortComparer: (a: any, b: any) => {
    const dateA = new Date(a.updatedAt).getTime() || 0;
    const dateB = new Date(b.updatedAt).getTime() || 0;
    return dateB - dateA;
  },
});

const initialState = postsAdapter.getInitialState();

// {ids: [], entities: {}}

/*
  Entity Adapter giúp chúng ta quản lý duwx liệu ở ngay trong redux va no se giúp chuan hóa du lieu ơ ngày trong rẽdux
  và giúp cho việc chuẩn hóa dữ liệu trong redux dễ dàng hơn.

  {
    ids: ['1', '2', '3'],
    entities: {
      '1': { id: '1', name: 'John' },
      '2': { id: '2', name: 'Jane' },
      '3': { id: '3', name: 'Doe' },
    }
    
    cung cap them cho chung ta cac methods để dễ dàng cập nhật, thêm, xóa dữ liệu trong redux mà đã được chuẩn hóa ở phía trên nó sẽ giúp chúng ta chuẩn hóa dữ liệu 
    tránh bị trùng lặp dũ liệu. Và làm cho ứng dụng của chúng ta sẽ lưu truwxc dữ liệu tập trung, thay vì tạo ra các state như posts (useLazyLoadPost), luuon luôn
    chỉ có 1 nguồn dữ liệu duy nhất hay còn gọi là signle source of truth.

*/

export const postApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      createPost: builder.mutation({
        query: (formData) => ({
          url: 'posts',
          method: 'POST',
          body: formData,
        }),

        // invalidatesTags: ['POSTS'],

        //Optimistic Update
        /* Giải thích: Khi người dùng tạo một bài viết mới, chúng ta sẽ thêm bài viết đó vào danh sách bài viết hiện tại trong cache của Redux.
         Điều này giúp cho giao diện người dùng phản hồi nhanh chóng mà không cần phải đợi API trả về kết quả.
         Sau đó, khi API trả về kết quả, chúng ta sẽ cập nhật lại bài viết trong cache với dữ liệu mới từ API. Nếu có lỗi xảy ra, chúng ta sẽ hoàn tác (undo) thay đổi này và giữ nguyên trạng thái ban đầu của danh sách bài viết.
         Điều này giúp cho người dùng không thấy sự khác biệt trong trải nghiệm khi tạo bài viết mới.
         Chúng ta cũng có thể sử dụng `patchResult.undo()` để hoàn tác thay đổi nếu có lỗi xảy ra trong quá trình cập nhật cache. */

        async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
          console.log('cvh', args);
          const store = getState() as unknown as {
            auth: { userInfo: { _id: string; fullName: string } };
          };
          const tempId = crypto.randomUUID();
          const newPost = {
            _id: tempId,
            likes: [],
            comments: [],
            content: args.get('content'),
            author: {
              notifications: [],
              _id: store.auth.userInfo._id,
              fullName: store.auth.userInfo.fullName,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          };

          const patchResult = dispatch(
            postApi.util.updateQueryData('getPosts', 'allPosts', (draft) => {
              postsAdapter.addOne(draft, newPost as any);
            })
          );
          try {
            const { data } = await queryFulfilled;
            console.log('data333', { data });
            dispatch(
              postApi.util.updateQueryData('getPosts', 'allPosts', (draft) => {
                // const index = draft.ids.findIndex((id) => {
                //   const entity = draft.entities[id];
                //   return entity && '_id' in entity && entity._id === tempId;
                // });
                // if (index !== -1) {
                //   if (draft.ids[index]) {
                //     draft.entities[draft.ids[index]] = data;
                //   }
                // }

                postsAdapter.removeOne(draft, tempId as any);
                postsAdapter.addOne(draft, data as any);
              })
            );
          } catch {
            patchResult.undo();

            /**
             * Alternatively, on failure you can invalidate the corresponding cache tags
             * to trigger a re-fetch:
             * dispatch(api.util.invalidateTags(['Post']))
             */
          }
        },
      }),
      getPosts: builder.query<PostResponsive, any>({
        query: ({ limit, offset } = {}) => {
          return {
            url: '/posts',
            params: {
              limit,
              offset,
            },
          };
        },
        //           Hàm upsertMany của Entity Adapter sẽ chuẩn hóa dữ liệu từ API (response) thành một cấu trúc chuẩn bao gồm:
        // ids: Mảng chứa các ID duy nhất của các bài viết.
        // entities: Một object mà mỗi key là ID của bài viết, và value là dữ liệu tương ứng của bài viết đó.
        transformResponse: (response: RawPost[]): PostResponsive => {
          const updatedState = postsAdapter.upsertMany(initialState, response);
          console.log('updatedState', updatedState);
          // return updatedState.ids.map(
          //   (id) => updatedState.entities[id]
          // ) as PostProps[];

          return updatedState;
        },

        serializeQueryArgs: () => 'allPosts',
        merge: (currentCache, newItems) => {
          // Gộp dữ liệu từ request trước đó + với dữ liệu mới sau này, nó luôn đảm bảo
          // rằng dữ liệu trong redux luôn là mới nhất và không bị trùng lặp vì
          // nó đã có 1 hệ thống các ids duy nhất
          // const updatedState = postsAdapter.upsertMany(
          //   postsAdapter.getInitialState(currentCache),
          //   newItems
          // );

          return postsAdapter.upsertMany(currentCache, newItems.entities);
          // return updatedState;
        },

        providesTags: [{ type: 'POSTS' }],
      }),
      likePost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/like`,
            method: 'POST',
          };
        },
        invalidatesTags: ['POSTS'],
        async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
          console.log('cvh', args);
          const store = getState() as unknown as {
            auth: { userInfo: { _id: string; fullName: string } };
          };
          const tempId = crypto.randomUUID();
          const newLike = {
            author: {
              _id: store.auth.userInfo._id,
              fullName: store.auth.userInfo.fullName,
            },
            _id: tempId,
          };

          const patchResult = dispatch(
            postApi.util.updateQueryData('getPosts', 'allPosts', (draft) => {
              const currentLike = draft.ids
                .map((id) => draft.entities[id])
                .find((post: any) => post?._id === args);
              console.log('currentLike', currentLike);
              if (currentLike) {
                currentLike.likes.push(newLike as any);
              }
            })
          );
          try {
            const { data } = await queryFulfilled;
            console.log('data333', { data });

            dispatch(
              postApi.util.updateQueryData('getPosts', 'allPosts', (draft) => {
                const currentPost = draft.ids
                  .map((id) => draft.entities[id])
                  .find((post: any) => post?._id === args);
                console.log('currentPost', currentPost);
                if (currentPost) {
                  let currentLike = currentPost.likes.find(
                    (like: any) => like._id === tempId
                  ) as any;
                  if (currentLike) {
                    currentLike = {
                      author: {
                        _id: data.author._id,
                        fullName: data.author.fullName,
                      },
                      createdAt: data.createdAt,
                      updatedAt: data.updatedAt,
                      _id: data._id,
                    };
                  }
                }
              })
            );
          } catch {
            patchResult.undo();
          }
        },
      }),
      unlikePost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/like`,
            method: 'DELETE',
          };
        },
        invalidatesTags: ['POSTS'],
      }),
    };
  },
});

export const { useCreatePostMutation, useGetPostsQuery, useLikePostMutation } =
  postApi;
