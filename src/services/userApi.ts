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

    uploadPhotoUser: builder.mutation({
      query: (formData) => ({
        url: `/users/upload-photo`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        { type: 'GET_AUTH_USER' },
        { type: 'GET_USER_INFO_BY_ID' },
      ],
    }),

    resetPhoto: builder.mutation({
      query: (isCover) => {
        return {
          url: '/users/reset-photo',
          method: 'DELETE',
          body: isCover,
        };
      },
      invalidatesTags: [
        { type: 'GET_AUTH_USER' },
        { type: 'GET_USER_INFO_BY_ID' },
      ],
    }),

    updateUserProfile: builder.mutation({
      query: (formData) => {
        return {
          url: '/users/update-profile',
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: [{ type: 'GET_AUTH_USER' }],
      // invalidatesTags: (result, error, args) => [
      //   { type: "USERS", id: args },
      //   { type: "PENDING_FRIEND_REQUEST", id: args },
      // ],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUploadPhotoUserMutation,
  useResetPhotoMutation,
  useUpdateUserProfileMutation,
} = userApi;
