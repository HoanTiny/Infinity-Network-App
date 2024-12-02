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

import { logOut } from '@redux/slice/authSlice';
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
  if (result.error?.status === 401) {
    // dispatch(logout());
    api.dispatch(logOut());
    // await persistor.purge();
    window.location.href = '/login';
  }
  return result;
};

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryForceLogout,
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
    getAuthUser: builder.query<void, void>({
      // <void, void>
      query: () => '/auth-user',
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOTPMutation,
  useGetAuthUserQuery,
} = rootApi;
