/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Button, CircularProgress } from '@mui/material';
import { useGetPendingFriendsRequestQuery } from '@services/rootApi';
type FriendItemRequestProps = {
  fullName: string;
};

const FriendItemRequest = ({ fullName }: FriendItemRequestProps) => {
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
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            size="small"
            className="btn btn-secondary"
            sx={{ fontSize: '10px' }}
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
};

function FriendRequest() {
  const { data = [], isFetching } = useGetPendingFriendsRequestQuery();

  console.log('data', data);
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
          <FriendItemRequest key={item._id} fullName={item.fullName} />
        ))}
      </div>
    </div>
  );
}

export default FriendRequest;
