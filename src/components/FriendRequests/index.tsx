/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@components/Button";
import UserAvatar from "@components/UserAvatar";
import { socket } from "@context/SocketProvider";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useGetPendingFriendsRequestQuery,
} from "@services/friendApi";
import { useEffect } from "react";
import { Link } from "react-router-dom";

type FriendItemRequestProps = {
  fullName: string;
  id: string;
  imageSrc?: string;
};

const FriendItemRequest = ({
  fullName,
  id,
  imageSrc,
}: FriendItemRequestProps) => {
  const [aceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();
  console.log("UserId: ", id);
  return (
    <div className="friend-item-request flex gap-3 mb-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200">
      <div className="friend-item-request__avatar flex-shrink-0">
        <div className="story-ring p-0.5">
          <div className="bg-white p-0.5 rounded-full">
            <UserAvatar src={imageSrc} fullName={fullName} size="md" />
          </div>
        </div>
      </div>

      <div className="friend-item-request__info flex flex-col gap-1 flex-1 min-w-0">
        <Link
          to={`/user/${id}`}
          className="friend-item-request__info__name hover:text-gray-900 transition-colors text-[15px] font-semibold text-gray-900 truncate"
        >
          {fullName}
        </Link>
        <div className="friend-item-request__info__mutual text-gray-500 text-xs font-medium">
          2 mutual friends
        </div>
        <div className="friend-item-request__info__action flex gap-2 mt-1">
          <Button
            variant="contained"
            size="small"
            className="btn-ig-primary !py-1.5 !px-3 !text-sm !font-semibold !rounded-lg"
            onClick={() => aceptFriendRequest(id)}
            isLoading={isAccepting}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            size="small"
            className="btn-ig-secondary !py-1.5 !px-3 !text-sm !font-semibold !rounded-lg !border-gray-300"
            onClick={() => cancelFriendRequest(id)}
            isLoading={isCanceling}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
};

function FriendRequest() {
  const { data = [], isFetching, refetch } = useGetPendingFriendsRequestQuery();

  useEffect(() => {
    socket.on("friendRequestReceived", (data) => {
      console.log("[friendRequestReceived]", { data });
      refetch();
    });

    return () => {
      socket.off("friendRequestReceived");
    };
  }, [refetch]);

  return (
    <div className="rounded-xl p-4 sticky top-6">
      <div className="card__header flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
            <img
              src="/icons/friends.svg"
              alt="friends"
              className="w-4 h-4 filter brightness-0 invert"
            />
          </div>
          <h3 className="font-semibold text-gray-900 text-[15px]">
            Friend Requests
          </h3>
        </div>
        <div className="text-[#0095f6] text-sm font-semibold hover:text-[#0074cc] transition-colors cursor-pointer">
          See All
        </div>
      </div>
      <div className="card__content space-y-3">
        {isFetching ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-[#0095f6] rounded-full animate-spin"></div>
          </div>
        ) : data?.length > 0 ? (
          data
            ?.slice(0, 3)
            .map((item: any) => (
              <FriendItemRequest
                key={item._id}
                fullName={item.fullName}
                id={item._id}
                imageSrc={item.image}
              />
            ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <img
                src="/icons/friends.svg"
                alt="no requests"
                className="w-8 h-8 opacity-50"
              />
            </div>
            <p className="text-gray-500 text-sm">No friend requests</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendRequest;
