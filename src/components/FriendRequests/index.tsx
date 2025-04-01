/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@components/Button';
import { socket } from '@context/SocketProvider';
import { Avatar, CircularProgress } from '@mui/material';
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useGetPendingFriendsRequestQuery,
} from '@services/friendApi';
import { useEffect } from 'react';
type FriendItemRequestProps = {
  fullName: string;
  id: string;
};

const FriendItemRequest = ({ fullName, id }: FriendItemRequestProps) => {
  const [aceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();
  console.log('UserId: ', id);
  return (
    <div className="friend-item-request flex gap-4 mb-4">
      <div className="friend-item-request__avatar">
        <Avatar
          sx={{ width: 50, height: 50 }}
          alt={fullName}
          src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
        />
      </div>

      <div className="friend-item-request__info flex flex-col gap-1">
        <div className="friend-item-request__info__name">{fullName}</div>
        <div className="friend-item-request__info__mutual text-[#4B465C] text-[13px] font-w">
          2 mutual friends
        </div>
        <div className="friend-item-request__info__action flex gap-2">
          <Button
            variant="contained"
            size="small"
            className="btn btn-primary"
            sx={{
              fontSize: '10px',
            }}
            onClick={() => aceptFriendRequest(id)}
            isLoading={isAccepting}
            icon={<img src="/icons/check.svg" alt="" />}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            size="small"
            className="btn btn-secondary"
            sx={{ fontSize: '10px' }}
            onClick={() => cancelFriendRequest(id)}
            isLoading={isCanceling}
            icon={<img src="/icons/close.svg" alt="" />}
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

  console.log('data', data);

  useEffect(() => {
    socket.on('friendRequestReceived', (data) => {
      console.log('[friendRequestReceived]', { data });
      refetch();
    });

    return () => {
      socket.off('friendRequestReceived');
    };
  }, [refetch]);

  return (
    <div className="card">
      <div className="card__header flex justify-between items-center mb-2">
        <h3 className="font-normal text-[#ccc]">Friend Requests</h3>
        <div
          className="text-[#301ce6] cursor-pointer
        "
        >
          See All
        </div>
      </div>
      <div className="card__content">
        {isFetching && <CircularProgress size={20} className="block mx-auto" />}
        {data?.slice(0, 3).map((item: any) => (
          <FriendItemRequest
            key={item._id}
            fullName={item.fullName}
            id={item._id}
          />
        ))}
      </div>
    </div>
  );
}

export default FriendRequest;
