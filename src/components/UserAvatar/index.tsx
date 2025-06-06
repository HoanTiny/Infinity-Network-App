import { useUserInfo } from '@hooks/getUserinfo';
import { Avatar } from '@mui/material';

type UserAvatarProps = {
  className?: string;
  isMyAvatar?: boolean;
  src?: string;
  fullName?: string;
};
const UserAvatar = ({
  className,
  isMyAvatar = false,
  src,
  fullName,
}: UserAvatarProps) => {
  const { image, userInfo } = useUserInfo();

  const myAvatar = isMyAvatar ? image : src;
  const myInfo = isMyAvatar ? userInfo?.fullName : fullName;
  console.log('UserAvatar', userInfo);
  return (
    <Avatar
      className={`${className} ${isMyAvatar ? 'cursor-pointer' : ''}`}
      src={myAvatar}
      alt={myInfo}
    >
      {myInfo?.charAt(0).toUpperCase() || 'U'}
    </Avatar>
  );
};

export default UserAvatar;
