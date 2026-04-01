/* eslint-disable @typescript-eslint/no-explicit-any */
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
      // invalidatesTags: (result, error, { receiver }) => [
      //   'CONVERSATIONS',
      //   { type: 'MESSAGES', id: receiver },
      // ],

      async onQueryStarted(
        { message, receiver },
        { dispatch, queryFulfilled, getState }
      ) {
        console.log('onQueryStarted sendMeassage', message, receiver);
        const tempId = crypto.randomUUID();
        const now = new Date().toISOString();
        const store = getState() as unknown as {
          auth: { userInfo: any };
        };
        const currentUser = store.auth.userInfo;

        console.log('currentUser', currentUser);
        const optimisticMessage = {
          seen: true,
          _id: tempId,
          message: message,
          sender: currentUser,

          receiver: {
            _id: receiver,
          },
          createdAt: now,
          updatedAt: now,
          __v: 0,
        };

        const patchResult = dispatch(
          messagesApi.util.updateQueryData(
            'getMessages',
            { userId: receiver },
            (draft: any) => {
              // console.log('draft: ', JSON.stringify(draft));
              if (draft.messages) {
                draft.messages.push(optimisticMessage);
              }
            }
          )
        );

        const pathConverstationResult = dispatch(
          messagesApi.util.updateQueryData(
            'getConversations',
            {},
            (draft: any) => {
              const currentConversationIndex = draft.findIndex((mess: any) => {
                return (
                  mess.receiver._id === receiver || mess.sender._id === receiver
                );
              });

              let receiverInfo = {};
              if (currentConversationIndex !== -1) {
                receiverInfo = draft[currentConversationIndex].receiver;
                draft.splice(currentConversationIndex, 1);
              }

              draft.unshift({
                ...optimisticMessage,
                receiver: receiverInfo,
              });
              console.log('draft222: ', JSON.stringify(draft));
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          console.log('sendMeassage successful', data);

          dispatch(
            messagesApi.util.updateQueryData(
              'getMessages',
              { userId: receiver },
              (draft: any) => {
                // console.log('draft: ', JSON.stringify(draft));
                if (draft.messages) {
                  const messagesIndex = draft.messages.findIndex((mes: any) => {
                    return mes._id === tempId;
                  });

                  if (messagesIndex !== -1) {
                    draft.messages[messagesIndex] = data;
                  }

                  console.log('messagesIndex', messagesIndex);
                }
              }
            )
          );

          dispatch(
            messagesApi.util.updateQueryData(
              'getConversations',
              {},
              (draft: any) => {
                const currentConversationIndex = draft.findIndex((msg: any) => {
                  return msg._id === tempId;
                });

                console.log(
                  'currentConversationIndex 2',
                  currentConversationIndex
                );

                if (currentConversationIndex !== -1) {
                  draft[currentConversationIndex] = data;
                }
              }
            )
          );
        } catch {
          console.log('sendMeassage error');
          patchResult.undo();
          pathConverstationResult.undo();
        }
      },
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
