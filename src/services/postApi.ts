/* eslint-disable @typescript-eslint/no-explicit-any */
import { PostProps } from '@components/PostList/Post';
import { rootApi } from './rootApi';

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
            postApi.util.updateQueryData(
              'getPosts',
              { limit: 10, offset: 0 },
              (draft) => {
                draft.unshift(newPost as any);
              }
            )
          );
          try {
            const { data } = await queryFulfilled;
            console.log('data333', { data });
            dispatch(
              postApi.util.updateQueryData(
                'getPosts',
                { limit: 10, offset: 0 },
                (draft) => {
                  const index = draft.findIndex(
                    (post: any) => post._id === tempId
                  );
                  if (index !== -1) {
                    draft[index] = data;
                  }
                }
              )
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
      getPosts: builder.query<PostProps[], { limit?: number; offset?: number }>(
        {
          query: ({ limit, offset } = {}) => {
            return {
              url: '/posts',
              params: {
                limit,
                offset,
              },
            };
          },
          providesTags: [{ type: 'POSTS' }],
        }
      ),
    };
  },
});

export const { useCreatePostMutation, useGetPostsQuery } = postApi;
