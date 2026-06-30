/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@components/Button';
import Sidebar from '@components/Sidebar.tsx';
import UserAvatar from '@components/UserAvatar';
import { socket } from '@context/SocketProvider';
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useGetPendingFriendsRequestQuery,
} from '@services/friendApi';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const FriendRequestsPage = () => {
  const { data = [], isFetching, refetch } =
    useGetPendingFriendsRequestQuery();
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();

  useEffect(() => {
    socket.on('friendRequestReceived', () => {
      refetch();
    });

    return () => {
      socket.off('friendRequestReceived');
    };
  }, [refetch]);

  return (
    <div className="min-h-screen bg-ig-bg text-ig-text">
      <Sidebar />

      <main className="pl-[72px]">
        <div className="mx-auto w-full max-w-[680px] px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-semibold text-ig-text">
                Lời mời kết bạn
              </h1>
              <p className="text-[13px] text-ig-muted">
                {data?.length || 0} lời mời đang chờ
              </p>
            </div>
          </div>

          <section className="mt-6">
            {isFetching ? (
              <div className="flex justify-center py-10">
                <div className="w-7 h-7 border-2 border-ig-border border-t-[#0095f6] rounded-full animate-spin" />
              </div>
            ) : data?.length > 0 ? (
              <div className="space-y-3">
                {data.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex gap-3 p-4 rounded-2xl border border-ig-border bg-ig-bg shadow-sm"
                  >
                    <div className="flex-shrink-0">
                      <div className="story-ring p-0.5">
                        <div className="bg-ig-bg p-0.5 rounded-full">
                          <UserAvatar
                            src={item.image}
                            fullName={item.fullName}
                            size="md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <Link
                        to={`/user/${item._id}`}
                        className="text-[15px] font-semibold text-ig-text truncate"
                      >
                        {item.fullName}
                      </Link>
                      <div className="text-ig-muted text-[12px] font-medium">
                        2 bạn chung
                      </div>

                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="contained"
                          size="small"
                          className="btn-ig-primary !py-1.5 !px-4 !text-[12px] !font-semibold !rounded-lg"
                          onClick={() => acceptFriendRequest(item._id)}
                          isLoading={isAccepting}
                        >
                          Chấp nhận
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          className="btn-ig-secondary !py-1.5 !px-4 !text-[12px] !font-semibold !rounded-lg !border-ig-border"
                          onClick={() => cancelFriendRequest(item._id)}
                          isLoading={isCanceling}
                        >
                          Từ chối
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ig-hover flex items-center justify-center">
                  <img
                    src="/icons/friends.svg"
                    alt="no requests"
                    className="w-8 h-8 opacity-70"
                  />
                </div>
                <p className="text-ig-muted text-[13px]">
                  Hiện chưa có lời mời kết bạn nào
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default FriendRequestsPage;
