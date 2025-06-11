import { rootApi } from './rootApi';

// Định nghĩa messagesApi bằng cách mở rộng rootApi với các endpoint liên quan đến tin nhắn.
export const messagesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint lấy danh sách các cuộc hội thoại.
    getConversations: builder.query({
      query: () => ({
        url: '/messages/conversations',
      }),
      providesTags: ['CONVERSATIONS'], // Gắn tag để quản lý cache cho conversations.
    }),

    // Endpoint lấy danh sách tin nhắn của một user cụ thể.
    getMessages: builder.query({
      query: ({ userId, offset, limit }) => ({
        url: '/messages',
        params: {
          userId,
          offset,
          limit,
        },
      }),

      // serializeQueryArgs xác định cache key cho truy vấn dựa trên userId.
      // Điều này giúp các truy vấn với cùng userId dùng chung cache,
      // bất kể các tham số khác như page, limit, v.v.
      serializeQueryArgs: ({ queryArgs }) => ({
        userId: queryArgs.userId,
      }),

      // providesTags trả về tag dạng { type: 'MESSAGES', id: userId }
      // để quản lý cache riêng cho từng user.
      providesTags: (result, error, { userId }) => {
        return [{ type: 'MESSAGES', id: userId }];
      },
    }),
    sendMeassage: builder.mutation({
      query: ({ message, receiver }) => ({
        url: '/messages/create',
        method: 'POST',
        body: {
          message,
          receiver,
        },
      }),
      invalidatesTags: (result, error, { receiver }) => [
        'CONVERSATIONS',
        { type: 'MESSAGES', id: receiver },
      ],
    }),
    markConversationAsSeen: builder.mutation({
      query: ({ sender }) => ({
        url: '/messages/update-seen',
        method: 'PUT',
        body: {
          sender,
        },
      }),
      invalidatesTags: (result, error, { sender }) => [
        'CONVERSATIONS',
        { type: 'MESSAGES', id: sender },
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMeassageMutation,
  useMarkConversationAsSeenMutation,
} = messagesApi;
