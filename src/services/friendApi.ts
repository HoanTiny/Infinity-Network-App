/* eslint-disable @typescript-eslint/no-explicit-any */
import { rootApi } from './rootApi';

export const friendApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      requestFriend: builder.mutation({
        query: (userId) => ({
          url: `/friends/request`,
          method: 'POST',
          body: {
            friendId: userId,
          },
        }),
        invalidatesTags: (result, error, args) => {
          return [{ type: 'USERS', id: args }];
        },
      }),

      acceptFriendRequest: builder.mutation({
        query: (userId) => ({
          url: `/friends/accept`,
          method: 'POST',
          body: {
            friendId: userId,
          },
        }),
        invalidatesTags: (result, error, args) => {
          // AcceptFriendRequest
          return [
            { type: 'USERS', id: args },
            { type: 'PENDING_FRIENDS_REQUEST', id: args },
          ];
        },
      }),

      cancelFriendRequest: builder.mutation({
        query: (userId) => ({
          url: `/friends/cancel`,
          method: 'POST',
          body: {
            friendId: userId,
          },
        }),
        invalidatesTags: (result, error, args) => {
          // CancelFriendRequest
          return [
            { type: 'USERS', id: args },
            { type: 'PENDING_FRIENDS_REQUEST', id: args },
          ];
        },
      }),

      unfriendRequest: builder.mutation({
        query: (userId) => ({
          url: `/friends/unfriend`,
          method: 'POST',
          body: {
            friendId: userId,
          },
        }),

        invalidatesTags: (result, error, args) => {
          // UnfriendRequest
          return [{ type: 'USERS', id: args }];
        },
      }),

      getPendingFriendsRequest: builder.query<void, void>({
        // <void, void>
        query: () => '/friends/pending',
        providesTags: (result: any) =>
          result
            ? [
                ...result.map(({ _id }: any) => ({
                  type: 'PENDING_FRIENDS_REQUEST',
                  id: _id,
                })),
                { type: 'PENDING_FRIENDS_REQUEST', id: 'LIST' },
              ]
            : [{ type: 'PENDING_FRIENDS_REQUEST', id: 'LIST' }],
      }),
    };
  },
});

export const {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useUnfriendRequestMutation,
  useRequestFriendMutation,
  useGetPendingFriendsRequestQuery,
} = friendApi;
