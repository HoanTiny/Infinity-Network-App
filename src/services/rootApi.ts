/* eslint-disable @typescript-eslint/no-explicit-any */
// // UI-agnostic entry point with the core logic

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query';

// export const rootApi = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
//   endpoints: (builder) => {
//     return {
//       register: builder.mutation({
//         query: ({ fullname, email, password }) => ({
//           url: '/register',
//           method: 'POST',
//           body: {
//             fullname,
//             email,
//             password,
//           },
//         }),
//       }),
//     };
//   },
// });

// export const { useRegisterMutation } = rootApi;

import { PostProps } from '@components/PostList/Post';
import { login, logOut } from '@redux/slice/authSlice';
// import { persistor } from '@redux/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SearchUsersResponse } from 'src/ultil/type';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    console.log({ store: getState() });
    const token = (getState() as { auth: { accessToken: string } }).auth
      .accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
  },
});

const baseQueryForceLogout = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  console.log('Result', result);
  if (result.error?.status === 401) {
    if (
      (result.error.data as { message: string })?.message ===
      'Token has expired.'
    ) {
      const refreshToken = (
        api.getState() as { auth: { refreshToken: string } }
      ).auth.refreshToken;

      console.log('Refreshing token...', refreshToken);
      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: '/refresh-token',
            method: 'POST',
            body: {
              refreshToken,
            },
          },
          api,
          extraOptions
        );

        const newAccessToken = (refreshResult.data as { accessToken: string })
          ?.accessToken;

        console.log('New access token', newAccessToken, refreshResult);

        if (newAccessToken) {
          api.dispatch(
            login({
              accessToken: newAccessToken,
              refreshToken,
            })
          );

          return baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
          window.location.href = '/login';
        }
      }
    } else {
      api.dispatch(logOut());
      window.location.href = '/login';
    }
  }
  return result;
};

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryForceLogout,
  tagTypes: ['POSTS', 'USERS'],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: ({ fullName, email, password }) => ({
        url: 'signup',
        method: 'POST',
        body: {
          fullName,
          email,
          password,
        },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: 'login',
        method: 'POST',
        body: {
          email,
          password,
        },
      }),
    }),
    refeshToken: builder.mutation({
      query: (refreshToken) => ({
        url: 'refresh-token',
        method: 'POST',
        body: {
          refreshToken,
        },
      }),
    }),
    verifyOTP: builder.mutation({
      query: ({ email, otp }) => ({
        url: 'verify-otp',
        method: 'POST',
        body: {
          email,
          otp,
        },
      }),
    }),
    createPost: builder.mutation({
      query: (formData) => ({
        url: 'posts',
        method: 'POST',
        body: formData,
      }),

      invalidatesTags: ['POSTS'],
    }),
    getAuthUser: builder.query<void, void>({
      // <void, void>
      query: () => '/auth-user',
    }),

    getPosts: builder.query<PostProps[], { limit?: number; offset?: number }>({
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
    }),

    searchUsers: builder.query<
      SearchUsersResponse,
      { limit?: number; offset?: number; searchQuery?: string }
    >({
      query: ({ limit, offset, searchQuery } = {}) => {
        const encodedSearchQuery = encodeURIComponent(
          searchQuery?.trim() || ''
        );
        return {
          url: `/search/users/${encodedSearchQuery}`,
          params: {
            limit,
            offset,
          },
        };
      },
      providesTags: (result: any) =>
        result
          ? [
              ...result.users.map(({ _id }: any) => ({
                type: 'USERS',
                id: _id,
              })),
              { type: 'USERS', id: 'LIST' },
            ]
          : [{ type: 'USERS', id: 'LIST' }],
    }),

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
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOTPMutation,
  useGetAuthUserQuery,
  useCreatePostMutation,
  useRefeshTokenMutation,
  useGetPostsQuery,
  useSearchUsersQuery,
  useRequestFriendMutation,
  useGetPendingFriendsRequestQuery,
} = rootApi;
