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

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      console.log({ store: getState() });
      const token = (getState() as { auth: { accessToken: string } }).auth
        .accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
    },
  }),
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
