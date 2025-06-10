import { rootApi } from './rootApi';

export const messagesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: '/messages/conversations',
        providesTags: ['CONVERSATIONS'],
      }),
    }),
  }),
});

export const { useGetConversationsQuery } = messagesApi;
