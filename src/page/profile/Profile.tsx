/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserInfo } from '@hooks/getUserinfo';
import {
  CheckBox,
  GroupRemove,
  Message,
  PersonAdd,
  PersonSearch,
} from '@mui/icons-material';

import { Box, CircularProgress } from '@mui/material';
import { useGetUserProfileQuery } from '@services/userApi';
import { useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useGetPendingFriendsRequestQuery,
  useRequestFriendMutation,
  useUnfriendRequestMutation,
} from '@services/friendApi';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { socket } from '@context/SocketProvider';
import Loading from '@components/Loading';
import UserAvatar from '@components/UserAvatar';
import Sidebar from '@components/Sidebar.tsx';
const tabsData = [
  { name: 'Bài viết', active: true, label: 'about' },
  // { name: 'Giới thiệu', active: false, label: 'introduce' },
  { name: 'Bạn bè', active: false, label: 'friends' },
  { name: 'Ảnh', active: false, label: 'photos' },
];

const Profile = () => {
  const [tabs, setTabs] = useState(tabsData);
  const [openPopup, setOpenPopup] = useState(false);
  const { userId } = useParams();
  const { data } = useGetUserProfileQuery(userId);
  const [unFriendRequest, { isLoading: isUnFriending, isSuccess }] =
    useUnfriendRequestMutation();
  const { _id } = useUserInfo();
  const { data: dataFriendsRequest = [], refetch } =
    useGetPendingFriendsRequestQuery();

  const [aceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCanceling }] =
    useCancelFriendRequestMutation();
  const [requestFriend, { isLoading }] = useRequestFriendMutation();

  const location = useLocation();
  // const currentTab = tabs.find((tab) => location.pathname.includes(tab.label));
  // Lấy ra path sau userId, ví dụ: /user/123/friends => friends
  const currentTab =
    location.pathname.split(`/user/${userId}/`)[1]?.split('/')[0] || '';

  // Cập nhật trạng thái active cho tab hiện tại khi location.pathname hoặc userId thay đổi
  useEffect(() => {
    const updatedTabs = tabs.map((tab) => ({
      ...tab,
      active: tab.label === currentTab,
    }));
    setTabs(updatedTabs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, userId]);

  console.log('dataFriendsRequest', dataFriendsRequest, data);

  useEffect(() => {
    socket.on('friendRequestReceived', (dataFriendsRequest) => {
      console.log('[friendRequestReceived]', { dataFriendsRequest });
      refetch();
    });

    return () => {
      socket.off('friendRequestReceived');
    };
  }, [refetch]);

  const myProfile = _id === userId;

  console.log('userId', userId);

  const handleTogglePopup = () => {
    setOpenPopup((prev) => !prev);
  };
  // Show toast notifications for unfriend actions using useEffect

  useEffect(() => {
    if (isUnFriending) {
      toast.info('Đang hủy kết bạn...', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [isUnFriending]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Đã hủy kết bạn thành công!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setOpenPopup(false);
    }
  }, [isSuccess]);

  if (!data) {
    return (
      <div className="min-h-screen bg-ig-bg text-ig-text">
        <Sidebar />
        <main className="sm:pl-[72px] flex items-center justify-center h-screen">
          <p className="text-ig-muted">Đang tải thông tin người dùng...</p>
        </main>
      </div>
    );
  }

  console.log('data Profile', data, userId);
  return (
    <div className="min-h-screen bg-ig-bg text-ig-text">
      <Sidebar />
      <main className="sm:pl-[72px]">
        <Box className="max-w-6xl mx-auto p-4">
      {/* Image Bìa */}
      <Box className="mb-4">
        <img
          src={data?.coverImage || 'https://placehold.co/1600x400'}
          alt="Cover"
          className="w-full h-[462px] object-cover rounded-lg border border-ig-border"
        />
      </Box>
      {/* Profile */}
      <Box className="bg-ig-bg border border-ig-border shadow-sm rounded-lg p-4 relative">
        {/* Avatar and Profile Info */}
        <Box className="relative flex flex-col pb-2">
          {/* Avatar and Profile Info in a single row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Avatar and basic info */}
            <div className="flex flex-col md:flex-row items-center md:items-start">
              {/* Avatar */}
              <div className="mx-auto md:mx-0 md:ml-4 mt-[-40px] md:mt-[-60px]">
                <UserAvatar src={data?.image} className="!w-32 !h-32" />
              </div>

              {/* Profile info */}
              <div className="text-center md:text-left md:ml-6 mt-2 md:mt-0">
                <h2 className="text-xl md:text-2xl font-bold text-ig-text">
                  {data?.fullName || 'Tên người dùng'}
                </h2>
                <p className="text-ig-muted">(Efforts)</p>
                <p className="text-sm text-ig-muted">
                  {data?.totalFriends} người bạn
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-center md:justify-end mt-3 md:mt-0">
              {myProfile ? (
                <>
                  <button className="bg-ig-accent hover:opacity-90 text-white px-2 md:px-3 py-1.5 rounded-md flex items-center text-sm font-semibold">
                    <span className="mr-1">+</span> Thêm vào tin
                  </button>
                  <button className="bg-ig-hover hover:bg-ig-border text-ig-text border border-ig-border px-2 md:px-3 py-1.5 rounded-md flex items-center text-sm font-semibold">
                    <span className="mr-1">✏️</span> Chỉnh sửa
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-ig-accent hover:opacity-90 text-white px-3 md:px-4 py-1.5 rounded-lg flex items-center font-semibold">
                    {data.isFriend ? (
                      <div className="relative" onClick={handleTogglePopup}>
                        <GroupIcon className="mr-1" fontSize="small" />
                        <span className="text-[13px] md:text-[14px]">
                          Bạn bè
                        </span>

                        {openPopup && (
                          <div className="absolute top-full left-0 mt-2 w-48 bg-ig-bg border border-ig-border shadow-lg rounded-lg p-4 z-10">
                            {/* Hủy kết bạn */}
                            <button
                              className="text-sm text-ig-text hover:underline mt-1 flex items-start gap-2"
                              onClick={() => {
                                unFriendRequest(userId);
                              }}
                            >
                              <GroupRemove className="mr-1" fontSize="small" />
                              Hủy kết bạn
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {data.requestSent ? (
                          <div
                            className="flex items-center gap-2 text-white"
                            onClick={() => cancelFriendRequest(userId)}
                          >
                            <CheckBox className="mr-1" fontSize="small" />
                            <span className="text-[13px] md:text-[14px]">
                              Đã gửi lời mời
                            </span>
                          </div>
                        ) : dataFriendsRequest.some(
                            (dt: any) => dt._id === userId
                          ) ? (
                          <div
                            className="friend-item-request__info__action flex gap-2 relative"
                            onClick={handleTogglePopup}
                          >
                            <PersonSearch className="mr-1" fontSize="small" />
                            Phản hồi
                            {openPopup && (
                              <div className="absolute flex flex-col gap-2 justify-start items-start  top-full left-10  mt-2 w-48 bg-ig-bg text-ig-text border border-ig-border shadow-lg p-1 rounded-lg z-10">
                                {/* Hủy kết bạn */}
                                <button
                                  className="hover:bg-ig-hover w-full text-left py-2 px-4"
                                  onClick={() => aceptFriendRequest(userId)}
                                >
                                  {isAccepting && <Loading />}
                                  Xác nhận
                                </button>
                                <button
                                  className="hover:bg-ig-hover w-full text-left py-2 px-4"
                                  onClick={() => cancelFriendRequest(userId)}
                                >
                                  {isCanceling && <Loading />}
                                  Xóa lời mời
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            onClick={async () => {
                              await requestFriend(userId).unwrap();
                              socket.emit('friendRequestSent', {
                                receiverId: userId,
                              });
                            }}
                          >
                            <PersonAdd className="mr-1" fontSize="small" />
                            <span className="text-[13px] md:text-[14px]">
                              {isLoading ? (
                                <CircularProgress size={20} className="mr-2" />
                              ) : (
                                <span>Kết bạn</span>
                              )}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = `/messages/${userId}`;
                    }}
                    className="bg-ig-hover hover:bg-ig-border text-ig-text border border-ig-border px-3 md:px-4 py-1.5 rounded-lg flex items-center font-semibold"
                  >
                    <Message className="mr-1" fontSize="small" />
                    <span className="text-[13px] md:text-[14px]">Nhắn tin</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </Box>

        <Box className="mt-4">
          {/* Accept friendRequest */}
          {!myProfile &&
            dataFriendsRequest.some((dt: any) => dt._id === userId) && (
              <div className="bg-ig-hover border border-ig-border rounded-lg p-4 z-20 mb-2 flex items-center justify-between">
                <span className="text-ig-text font-medium">
                  {data?.fullName} đã gửi cho bạn lời mời kết bạn
                </span>
                <div className="flex gap-2 ml-4">
                  <button
                    className="bg-ig-accent hover:opacity-90 text-white p-2 rounded-lg font-semibold"
                    onClick={() => aceptFriendRequest(userId)}
                  >
                    Chấp nhận lời mời
                  </button>
                  <button
                    className="bg-ig-bg text-ig-text border border-ig-border hover:bg-ig-hover p-2 rounded-lg font-semibold"
                    // Xử lý xóa lời mời kết bạn ở đây
                    onClick={() => cancelFriendRequest(userId)}
                  >
                    Xóa lời mời
                  </button>
                </div>
              </div>
            )}
        </Box>

        {/* Navigation menu */}
        <Box className="border-t border-ig-border pt-4">
          <ul className="flex gap-4 text-ig-muted">
            {tabs.map((tab, index) => (
              <Link
                to={`/user/${userId}/${tab.label.toLowerCase()}`}
                className="flex items-center gap-2"
                key={index}
              >
                <li
                  key={index}
                  className={`cursor-pointer px-4 py-2 rounded-lg font-semibold ${
                    tab.active
                      ? 'bg-ig-accent text-white'
                      : 'hover:bg-ig-hover text-ig-text'
                  }`}
                  onClick={() => {
                    setTabs(
                      tabs.map((t, i) => ({
                        ...t,
                        active: i === index,
                      }))
                    );
                  }}
                >
                  {tab.name}
                </li>
              </Link>
            ))}
          </ul>
        </Box>
      </Box>

      <Outlet
        context={{
          userId: userId,
          myProfile: myProfile,
          data: data,
        }}
      />
        </Box>
      </main>
    </div>
  );
};

export default Profile;
