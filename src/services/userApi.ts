import { rootApi } from './rootApi';

export const userApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'GET',
      }),
      providesTags: (result) => [
        { type: 'GET_USER_INFO_BY_ID', id: result?._id },
      ],
    }),
  }),
});

export const { useGetUserProfileQuery } = userApi;
