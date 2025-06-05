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
          return [
            { type: 'USERS', id: args },
            { type: 'GET_USER_INFO_BY_ID', id: result?._id },
          ];
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

      getUserAllFriends: builder.query<
        any,
        { limit?: number; offset?: number }
      >({
        query: ({ limit, offset } = {}) => {
          return {
            url: '/friends',
            params: {
              limit,
              offset,
            },
          };
        },
      }),

      getUserAllFriendsById: builder.query<
        any,
        { userId: string; offset?: number; limit?: number }
      >({
        query: ({ userId, offset, limit }) => ({
          url: `/users/${userId}/friends`,
          params: {
            offset,
            limit,
          },
        }),
        providesTags: (result) =>
          result?.friends
            ? [
                ...result.friends.map(({ _id }: any) => ({
                  type: 'GET_FRIENDS',
                  id: _id,
                })),
                { type: 'GET_FRIENDS', id: 'LIST' },
              ]
            : [{ type: 'GET_FRIENDS', id: 'LIST' }],
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
  useGetUserAllFriendsQuery,
  useGetUserAllFriendsByIdQuery,
} = friendApi;
