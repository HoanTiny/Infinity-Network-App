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
  if (
    result.error?.status === 401 &&
    (result.error.data as { message: string })?.message === 'Token has expired.'
  ) {
    const refreshToken = (api.getState() as { auth: { refreshToken: string } })
      .auth.refreshToken;

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

      if (newAccessToken) {
        api.dispatch(
          login({
            accessToken: newAccessToken,
            refreshToken,
          })
        );

        return baseQuery(args, api, extraOptions);
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
  tagTypes: ['POSTS'],
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

    getPosts: builder.query<PostProps[], void>({
      query: () => '/posts',
      providesTags: [{ type: 'POSTS' }],
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
} = rootApi;
