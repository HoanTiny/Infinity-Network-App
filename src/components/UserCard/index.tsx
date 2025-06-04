import { socket } from '@context/SocketProvider';
import { Check } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import deepOrange from '@mui/material/colors/deepOrange';
import MyButton from '@components/Button';

import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useRequestFriendMutation,
  useUnfriendRequestMutation,
} from '@services/friendApi';
import { UserMinus } from '@components/Icon';
import { Link } from 'react-router-dom';

export type UserCardProps = {
  isFriend: boolean;
  fullName: string;
  avatar: string;
  id: string;
  requestSent?: boolean;
  requestReceived?: boolean;
};
function UserCard({
  isFriend,
  fullName,
  avatar,
  id,
  requestSent,
  requestReceived,
}: UserCardProps) {
  const [requestFriend, { isLoading }] = useRequestFriendMutation();
  const [aceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();
  const [unFriendRequest, { isLoading: isUnFriending }] =
    useUnfriendRequestMutation();

  const getActionButton = () => {
    if (isFriend) {
      return (
        <div className="flex gap-2">
          <Button variant="contained" color="primary" className="flex gap-2">
            <img src="/icons/messages.svg" alt="" />
            <span>Message</span>
          </Button>
          <MyButton
            variant="contained"
            size="small"
            onClick={() => unFriendRequest(id)}
            className="flex gap-2"
            isLoading={isUnFriending}
            icon={<UserMinus width={20} height={20} color="#fff" />}
          >
            Unfriend
          </MyButton>
        </div>
      );
    }

    if (requestSent) {
      return (
        <Button
          variant="outlined"
          color="primary"
          className="flex gap-2 "
          disabled
        >
          <Check className="mr-1" /> Request Sent
        </Button>
      );
    }

    if (requestReceived) {
      return (
        <div className="flex gap-2">
          <MyButton
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
          </MyButton>
          <MyButton
            variant="outlined"
            size="small"
            className="btn btn-secondary"
            sx={{ fontSize: '10px' }}
            onClick={() => cancelFriendRequest(id)}
            isLoading={isCanceling}
            icon={<img src="/icons/close.svg" alt="" />}
          >
            Decline
          </MyButton>
        </div>
      );
    }

    return (
      <Button
        variant="outlined"
        color="primary"
        className="flex gap-2 items-center"
        onClick={async () => {
          await requestFriend(id).unwrap();
          socket.emit('friendRequestSent', {
            receiverId: id,
          });
        }}
      >
        {isLoading ? (
          <CircularProgress size={20} className="mr-2" />
        ) : (
          <div className="flex gap-2 items-center">
            <img src="/icons/user-plus.svg" alt="" />
            <span>Add friend</span>
          </div>
        )}
      </Button>
    );
  };

  return (
    <div className="flex flex-col items-center flex-1 p-4 bg-white rounded-lg shadow-md gap-5">
      {avatar ? (
        <Avatar
          alt={fullName}
          src={avatar}
          sx={{ width: 80, height: 80, bgcolor: deepOrange[500] }}
        />
      ) : (
        <Avatar sx={{ width: 80, height: 80, bgcolor: deepOrange[500] }}>
          {fullName[0]}
        </Avatar>
      )}
      <Link to={`/user/${id}`}>
        <h3>{fullName}</h3>
      </Link>
      <div className="flex gap-2">
        <img src="/icons/friends.svg" alt="friends" />
        <span>100 friends</span>
      </div>
      <div className="flex gap-2">
        <img src="/icons/location.svg" alt="location" />
        <span>Ho Chi Minh City</span>
      </div>
      <div className="flex gap-2">
        <img src="/icons/calendar.svg" alt="calendar" />
        <span>Joined April 2024</span>
      </div>
      {getActionButton()}
    </div>
  );
}

export default UserCard;
