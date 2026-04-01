import { useUserInfo } from '@hooks/getUserinfo';
import { Avatar } from '@mui/material';

type UserAvatarProps = {
  className?: string;
  isMyAvatar?: boolean;
  src?: string;
  fullName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
};
const UserAvatar = ({
  className,
  isMyAvatar = false,
  src,
  fullName,
  size = 'md',
}: UserAvatarProps) => {
  const { image, userInfo } = useUserInfo();

  const myAvatar = isMyAvatar ? image : src;
  const myInfo = isMyAvatar ? userInfo?.fullName : fullName;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  // console.log('UserAvatar', userInfo);
  return (
    <Avatar
      className={`${className} ${isMyAvatar ? 'cursor-pointer' : ''} ${sizeClasses[size]}`}
      src={myAvatar}
      alt={myInfo}
    >
      {myInfo?.charAt(0).toUpperCase() || 'U'}
    </Avatar>
  );
};

export default UserAvatar;
