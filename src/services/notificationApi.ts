/* eslint-disable @typescript-eslint/no-explicit-any */
import { rootApi } from './rootApi';

export const notificationsApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getNotifications: builder.query<void, void>({
        query: () => '/notifications',
        providesTags: (result: any) => {
          console.log('getNotifications result:', result);
          return result
            ? [
                ...result.notifications.map(({ _id }: any) => ({
                  type: 'GET_NOTIFICATIONS' as const,
                  id: _id,
                })),
                { type: 'GET_NOTIFICATIONS' as const, id: 'LIST' },
              ]
            : [{ type: 'GET_NOTIFICATIONS' as const, id: 'LIST' }];
        },
      }),

      markNotificationAsRead: builder.mutation<unknown, string>({
        query: (notificationId) => ({
          url: '/notifications/seen',
          method: 'PATCH',
          body: { notificationId },
        }),
        async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
          const patch = dispatch(
            notificationsApi.util.updateQueryData(
              'getNotifications',
              undefined,
              (draft: any) => {
                const target = draft?.notifications?.find(
                  (n: any) => n._id === notificationId,
                );
                if (target) target.seen = true;
              },
            ),
          );
          try {
            await queryFulfilled;
          } catch {
            patch.undo();
          }
        },
      }),

      createNotification: builder.mutation({
        query: ({
          userId,
          postId,
          type,
          typeId,
        }: {
          userId: string;
          postId: string;
          type: string;
          typeId: string;
        }) => ({
          url: '/notifications/create',
          method: 'POST',
          body: {
            userId: userId,
            postId: postId,
            notificationType: type,
            notificationTypeId: typeId,
          },
        }),

        invalidatesTags: (args) => {
          return [{ type: 'POSTS', id: args.userId }];
        },
      }),
    };
  },
});

export const {
  useGetNotificationsQuery,
  useCreateNotificationMutation,
  useMarkNotificationAsReadMutation,
} = notificationsApi;
