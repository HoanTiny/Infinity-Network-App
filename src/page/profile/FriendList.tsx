/* eslint-disable @typescript-eslint/no-explicit-any */
import UserAvatar from '@components/UserAvatar';
import { MoreHoriz } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import { useGetUserAllFriendsByIdQuery } from '@services/friendApi';
import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

const ListFriends = () => {
  const [popup, setPopup] = useState<string | false>(false);
  const { userId } = useOutletContext<{ userId: string }>();

  const { data } = useGetUserAllFriendsByIdQuery({
    userId: userId,
    offset: 0,
    limit: 10,
  });

  const handleTogglePopup = (friendId: any) => {
    setPopup((prev) => (prev === friendId ? false : friendId));
    console.log('Toggle popup for friendId:', friendId);
  };

  console.log('first render ListFriends', data);

  return (
    <div className="mt-4 bg-ig-bg border border-ig-border rounded-xl py-4 px-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-ig-text">Bạn bè</h1>
        <p className="text-sm text-ig-accent cursor-pointer hover:underline">
          Xem tất cả
        </p>
      </div>
      <Grid container rowSpacing={1.5} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
        {data?.friends?.map((friend: any) => (
          <Grid size={{ xs: 12, sm: 6 }} key={friend._id}>
            <div className="border border-ig-border bg-ig-bg p-4 flex items-center justify-between gap-4 rounded-lg hover:bg-ig-hover transition-colors">
              <UserAvatar src={friend?.image} fullName={friend?.fullName} />
              <div className="flex-1 min-w-0">
                <Link to={`/user/${friend._id}`}>
                  <h2 className="text-md font-semibold text-ig-text truncate hover:underline">
                    {friend.fullName}
                  </h2>
                </Link>
                <p className="text-sm text-ig-muted">111 bạn chung</p>
              </div>
              {/* More */}
              <div
                className="relative cursor-pointer text-ig-muted hover:text-ig-text"
                onClick={() => handleTogglePopup(friend._id)}
              >
                <MoreHoriz />
                <div
                  className={`absolute right-0 top-8 bg-ig-bg border border-ig-border shadow-lg rounded-lg p-2 min-w-56 gap-1 z-10 ${
                    popup === friend._id
                      ? 'flex flex-col items-stretch'
                      : 'hidden'
                  }`}
                >
                  <button className="text-sm text-ig-text hover:bg-ig-hover rounded-md px-3 py-2 text-left">
                    <Link to={`/user/${friend._id}`}>Xem trang cá nhân</Link>
                  </button>
                  <button className="text-sm text-ig-text hover:bg-ig-hover rounded-md px-3 py-2 text-left">
                    Gửi tin nhắn
                  </button>
                  <button className="text-sm text-red-500 hover:bg-ig-hover rounded-md px-3 py-2 text-left">
                    Xoá bạn bè
                  </button>
                </div>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ListFriends;
