/* eslint-disable @typescript-eslint/no-explicit-any */
// import { PostProps, PostsApiResponse } from '@components/PostList/Post';
import { RootState } from "@redux/store";
import { rootApi } from "./rootApi";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { PostResponsive, RawPost } from "src/ultil/type";

type CachingPair =
  | ["getPosts", "allPosts"]
  | ["getPostsByAuthorId", { userId: any }];

const postsAdapter = createEntityAdapter({
  selectId: (post: any) => post._id,
  sortComparer: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
          url: "posts",
          method: "POST",
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
          console.log("cvh", args);
          const store = getState() as RootState;
          // Ensure userInfo is typed correctly
          const userInfo = store.auth.userInfo as {
            _id: string;
            fullName: string;
            notifications?: any[];
          };
          const tempId = crypto.randomUUID();
          const newPost = {
            _id: tempId,
            likes: [],
            comments: [],
            content: args.get("content"),
            author: {
              notifications: [],
              _id: userInfo._id,
              fullName: userInfo.fullName,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          };

          const userProfilePostsArgs = postApi.util.selectCachedArgsForQuery(
            store,
            "getPostsByAuthorId",
          );

          const patchResults = [] as any[];
          const cachingPairs: CachingPair[] = [
            ...userProfilePostsArgs.map(
              (arg: any) =>
                ["getPostsByAuthorId", { userId: arg.userId }] as CachingPair,
            ),
            ["getPosts", "allPosts"],
          ];

          cachingPairs.forEach(([endpoint, key]) => {
            const patchResult = dispatch(
              postApi.util.updateQueryData(endpoint, key, (draft) => {
                postsAdapter.addOne(draft, newPost as any);
                postsAdapter.addOne(draft, newPost as any);
              }),
            );
            patchResults.push(patchResult);
          });
          try {
            const { data } = await queryFulfilled;
            console.log("data333", { data });
            cachingPairs.forEach(([endpoint, key]) => {
              dispatch(
                postApi.util.updateQueryData(endpoint, key, (draft) => {
                  // const index = draft.ids.findIndex((id) => {
                  //   const entity = draft.entities[id];
                  //   return entity && '_id' in entity && entity._id === tempId;
                  // });
                  // if (index !== -1) {
                  //   if (draft.ids[index]) {
                  //     draft.entities[draft.ids[index]] = data;
                  //   }
                  // }

                  console.log(
                    "Draft before removing tempId:",
                    JSON.parse(JSON.stringify(draft)),
                    tempId,
                  );

                  postsAdapter.removeOne(draft, tempId as any);
                  postsAdapter.addOne(draft, data as any);
                }),
              );
            });
          } catch {
            patchResults.forEach((patchResult) => {
              patchResult.undo();
            });

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
            url: "/posts",
            params: {
              limit,
              offset,
            },
          };
        },
        keepUnusedDataFor: 0, // Không giữ dữ liệu trong cache quá lâu
        //           Hàm upsertMany của Entity Adapter sẽ chuẩn hóa dữ liệu từ API (response) thành một cấu trúc chuẩn bao gồm:
        // ids: Mảng chứa các ID duy nhất của các bài viết.
        // entities: Một object mà mỗi key là ID của bài viết, và value là dữ liệu tương ứng của bài viết đó.
        transformResponse: (response: RawPost[]): PostResponsive => {
          const updatedState = postsAdapter.upsertMany(initialState, response);
          console.log("updatedState", updatedState);
          // return updatedState.ids.map(
          //   (id) => updatedState.entities[id]
          // ) as PostProps[];

          return updatedState;
        },

        serializeQueryArgs: () => "allPosts",
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

        providesTags: [{ type: "POSTS" }],
      }),
      getPostsById: builder.query<any, any>({
        query: (postId) => {
          return {
            url: `/posts/${postId}`,
          };
        },
        providesTags: [{ type: "POSTS" }],
      }),
      getPostsByAuthorId: builder.query<PostResponsive, any>({
        query: ({ limit, offset, userId } = {}) => {
          return {
            url: `/posts/author/${userId}`,
            params: {
              limit,
              offset,
            },
          };
        },

        keepUnusedDataFor: 0, // Giữ dữ liệu trong cache trong n giây

        //           Hàm upsertMany của Entity Adapter sẽ chuẩn hóa dữ liệu từ API (response) thành một cấu trúc chuẩn bao gồm:
        // ids: Mảng chứa các ID duy nhất của các bài viết.
        // entities: Một object mà mỗi key là ID của bài viết, và value là dữ liệu tương ứng của bài viết đó.
        transformResponse: (response: {
          posts: RawPost[];
          limit?: number;
          offset?: number;
          total?: number;
        }): PostResponsive => {
          const updatedState = postsAdapter.upsertMany(
            initialState,
            response.posts,
          );
          console.log("updatedState", updatedState);
          // return updatedState.ids.map(
          //   (id) => updatedState.entities[id]
          // ) as PostProps[];

          return {
            ...updatedState,
            meta: {
              limit: response.limit || 10, // Default value if limit is undefined
              offset: response.offset || 0, // Default value if offset is undefined
              total: response.total || response.posts.length, // Default to posts length if total is undefined
            },
          };
        },

        serializeQueryArgs: ({ queryArgs }) => ({
          userId: queryArgs.userId,
        }),
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

        providesTags: (result: any) => {
          return result?.posts
            ? [
                ...result.posts.map(({ _id }: any) => ({
                  type: "GET_POSTS_BY_AUTHOR_ID",
                  id: _id,
                })),
                { type: "GET_POSTS_BY_AUTHOR_ID", id: "LIST" },
              ]
            : [{ type: "GET_POSTS_BY_AUTHOR_ID", id: "LIST" }];
        },
      }),
      likePost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/like`,
            method: "POST",
          };
        },
        invalidatesTags: ["POSTS"],
        async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
          console.log("cvh", args);
          // const store = getState() as unknown as {
          //   auth: { userInfo: { _id: string; fullName: string } };
          // };
          const store = getState() as RootState;
          const tempId = crypto.randomUUID();
          const userInfo = store.auth.userInfo as {
            _id: string;
            fullName: string;
            notifications?: any[];
          };

          const userProfilePostsArgs = postApi.util.selectCachedArgsForQuery(
            store,
            "getPostsByAuthorId",
          );

          const patchResults = [] as any[];
          const cachingPairs: CachingPair[] = [
            ...userProfilePostsArgs.map(
              (arg: any) =>
                ["getPostsByAuthorId", { userId: arg.userId }] as CachingPair,
            ),
            ["getPosts", "allPosts"],
          ];
          console.log({ cachingPairs });

          cachingPairs.forEach(([endpoint, key]) => {
            const patchResult = dispatch(
              postApi.util.updateQueryData(endpoint, key, (draft) => {
                console.log({ endpoint, key, draft });
                const currentPost = (draft as any).entities[args];
                if (currentPost) {
                  currentPost.likes.push({
                    author: {
                      _id: userInfo._id,
                      fullName: userInfo.fullName,
                    },
                    _id: tempId,
                  });
                }
              }),
            );

            patchResults.push(patchResult);
          });

          try {
            const { data } = await queryFulfilled;

            cachingPairs.forEach(([endpoint, key]) => {
              dispatch(
                postApi.util.updateQueryData(endpoint, key, (draft) => {
                  const currentPost = (draft as any).entities[args];
                  if (currentPost) {
                    currentPost.likes = currentPost.likes.map((like: any) => {
                      if (like._id === tempId) {
                        return {
                          author: {
                            _id: (store.auth.userInfo as any)._id,
                            fullName: (store.auth.userInfo as any).fullName,
                          },
                          createdAt: data.createdAt,
                          updatedAt: data.updatedAt,
                          _id: data._id,
                        };
                      }

                      return like;
                    });
                  }
                }),
              );
            });
          } catch (err) {
            console.log({ err });
            patchResults.forEach((patchResult) => {
              patchResult.undo();
            });
          }
        },
      }),
      unlikePost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/like`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["POSTS"],
        async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
          console.log("first", args);

          const store = getState() as unknown as {
            auth: { userInfo: { _id: string; fullName: string } };
          };
          const userId = store.auth.userInfo._id;

          // Optimistic update: Remove the like from the post
          const patchResult = dispatch(
            postApi.util.updateQueryData("getPosts", "allPosts", (draft) => {
              const currentPost = draft.ids
                .map((id) => draft.entities[id])
                .find((post: any) => post?._id === args);

              if (currentPost) {
                currentPost.likes = currentPost.likes.filter(
                  (like: any) => like.author._id !== userId,
                );
              }
            }),
          );
          try {
            const { data } = await queryFulfilled;
            console.log("Dislike successful", data);
          } catch {
            console.log("error");
            patchResult.undo();
          }
        },
      }),
      commentPost: builder.mutation({
        query: ({ postId, comment }) => {
          return {
            url: `/posts/${postId}/comments`,
            method: "POST",
            body: {
              comment: comment,
            },
          };
        },
        invalidatesTags: ["POSTS"],
        async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
          // console.log('first', arg);

          const store = getState() as RootState;
          const userInfo = store.auth.userInfo as {
            _id: string;
            fullName: string;
            notifications?: any[];
          };
          const optimisticComment = {
            _id: crypto.randomUUID(),
            comment: arg.comment,
            author: {
              _id: userInfo._id,
              fullName: userInfo.fullName,
            },
            post: arg.postId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          };

          const userProfilePostsArgs = postApi.util.selectCachedArgsForQuery(
            store,
            "getPostsByAuthorId",
          );

          const patchResults = [] as any[];
          const cachingPairs: CachingPair[] = [
            ...userProfilePostsArgs.map((arg: any) => [
              "getPostsByAuthorId",
              { userId: arg.userId },
            ] as CachingPair),
            ["getPosts", "allPosts"],
          ];

          cachingPairs.forEach(([endpoint, key]) => {
            const patchResult = dispatch(
              postApi.util.updateQueryData(endpoint, key, (draft) => {
                const currentPost = (draft as any).ids
                  .map((id: any) => (draft as any).entities[id])
                  .find((post: any) => post?._id === arg.postId);

                if (currentPost) {
                  currentPost.comments.push(optimisticComment as any);
                }
              }),
            );
            patchResults.push(patchResult);
          });

          // console.log('patchResult', patchResult);

          try {
            const { data } = await queryFulfilled;
            // console.log('Comment successful', data);
            cachingPairs.forEach(([endpoint, key]) => {
              dispatch(
                postApi.util.updateQueryData(endpoint, key, (draft) => {
                  const currentPost = (draft as any).ids
                    .map((id: any) => (draft as any).entities[id])
                    .find((post: any) => post?._id === arg.postId);
                  if (currentPost) {
                    const index = currentPost.comments.findIndex(
                      (comment: any) => comment._id === optimisticComment._id,
                    );
                    if (index !== -1) {
                      currentPost.comments[index] = data;
                    }
                  }
                }),
              );
            });
          } catch (error) {
            console.log("error", error);
            patchResults.forEach((patchResult) => {
              patchResult.undo();
            });
          }
        },
      }),
    };
  },
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useCommentPostMutation,
  useGetPostsByAuthorIdQuery,
  useGetPostsByIdQuery,
} = postApi;
