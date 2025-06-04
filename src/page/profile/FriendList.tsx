/* eslint-disable @typescript-eslint/no-explicit-any */
import { MoreHoriz } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useGetUserAllFriendsQuery } from '@services/friendApi';
import { useState } from 'react';

const ListFriends = () => {
  const [popup, setPopup] = useState<string | false>(false);
  const { data } = useGetUserAllFriendsQuery({
    offset: 0,
    limit: 10,
  });

  const handleTogglePopup = (friendId: any) => {
    setPopup((prev) => (prev === friendId ? false : friendId));
    console.log('Toggle popup for friendId:', friendId);
  };

  console.log('first render ListFriends', data);

  return (
    <div className="mt-2 bg-light-100 py-4 px-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Bạn bè</h1>
        <p className="text-sm text-gray-600">Xem tất cả</p>
      </div>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
        {data?.friends?.map((friend: any) => (
          <Grid size={{ xs: 12, sm: 6 }} key={friend._id}>
            <div className="border p-4 flex items-center justify-between gap-4 rounded-lg">
              <Avatar
                src={friend?.image}
                variant="rounded"
                sx={{ width: 80, height: 80 }}
              ></Avatar>
              <div className="flex-1">
                <h2 className="text-md">{friend.fullName}</h2>
                <p className="text-sm text-gray-700">111 bạn chug</p>
              </div>
              {/* More */}
              <div
                className="relative"
                onClick={() => handleTogglePopup(friend._id)}
              >
                <MoreHoriz />
                <div
                  className={`absolute right-0 top-8 bg-white shadow-lg rounded-lg p-4 min-w-64 gap-2 z-10 ${
                    popup === friend._id
                      ? 'flex flex-col items-start justify-start'
                      : 'hidden'
                  }`}
                >
                  <button className="text-sm text-gray-700 hover:text-blue-500">
                    Xem trang cá nhân
                  </button>
                  <button className="text-sm text-gray-700 hover:text-blue-500">
                    Gửi tin nhắn
                  </button>
                  <button className="text-sm text-gray-700 hover:text-blue-500">
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
