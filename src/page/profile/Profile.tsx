import PostCreation from '@components/PostCreation';
import { useUserInfo } from '@hooks/getUserinfo';
import { Message, PersonAdd } from '@mui/icons-material';

import { Avatar, Box } from '@mui/material';
import { useGetUserProfileQuery } from '@services/userApi';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import UserPostList from '@components/UserPostList';
const tabsData = [
  { name: 'Bài viết', active: true },
  { name: 'Giới thiệu', active: false },
  { name: 'Bạn bè', active: false },
  { name: 'Ảnh', active: false },
];

const Profile = () => {
  const [tabs, setTabs] = useState(tabsData);
  const { userId } = useParams();
  const { data } = useGetUserProfileQuery(userId);

  const { _id } = useUserInfo();

  const myProfile = _id === userId;

  if (!data) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Đang tải thông tin người dùng...</p>
      </Box>
    );
  }

  console.log('data Profile', data, userId);
  return (
    <Box className="max-w-6xl mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Profile Page</h1> */}
      {/* Image Bìa */}
      <Box className="mb-4">
        <img
          src="/img/car.jpg"
          alt="Cover"
          className="w-full h-64 object-cover rounded-lg"
        />
      </Box>
      {/* Profile */}
      <Box className="bg-white shadow-md rounded-lg p-4 relative">
        {/* Avatar and Profile Info */}
        <Box className="relative flex flex-col pb-2">
          {/* Avatar and Profile Info in a single row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Avatar and basic info */}
            <div className="flex flex-col md:flex-row items-center md:items-start">
              {/* Avatar */}
              <div className="mx-auto md:mx-0 md:ml-4 mt-[-40px] md:mt-[-60px]">
                <Avatar
                  sx={{
                    width: { xs: 80, md: 120 },
                    height: { xs: 80, md: 120 },
                    border: '4px solid white',
                  }}
                  alt="Profile Picture"
                />
              </div>

              {/* Profile info */}
              <div className="text-center md:text-left md:ml-6 mt-2 md:mt-0">
                <h2 className="text-xl md:text-2xl font-bold">
                  {data?.fullName || 'Tên người dùng'}
                </h2>
                <p className="text-gray-500">(Efforts)</p>
                <p className="text-sm text-gray-600">
                  {data?.totalFriends} người bạn
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-center md:justify-end mt-3 md:mt-0">
              {myProfile ? (
                <>
                  <button className="bg-blue-600 text-white px-2 md:px-3 py-1.5 rounded-md flex items-center text-sm">
                    <span className="mr-1">+</span> Thêm vào tin
                  </button>
                  <button className="bg-gray-200 text-gray-800 px-2 md:px-3 py-1.5 rounded-md flex items-center text-sm">
                    <span className="mr-1">✏️</span> Chỉnh sửa
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-1.5 rounded-lg flex items-center">
                    {data.isFriend ? (
                      <>
                        <GroupIcon className="mr-1" fontSize="small" />
                        <span className="text-[13px] md:text-[14px]">
                          Bạn bè
                        </span>
                      </>
                    ) : (
                      <>
                        <PersonAdd className="mr-1" fontSize="small" />
                        <span className="text-[13px] md:text-[14px]">
                          Kết bạn
                        </span>
                      </>
                    )}
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 md:px-4 py-1.5 rounded-lg flex items-center">
                    <Message className="mr-1" fontSize="small" />
                    <span className="text-[13px] md:text-[14px]">Nhắn tin</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </Box>

        {/* Navigation menu */}
        <Box className="border-t pt-4">
          <ul className="flex gap-4 text-gray-600">
            {tabs.map((tab, index) => (
              <li
                key={index}
                className={`cursor-pointer px-4 py-2 rounded-lg ${
                  tab.active ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
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
            ))}
          </ul>
        </Box>
      </Box>

      {/* Content based on active tab */}
      <div className="mt-4">
        {tabs.find((tab) => tab.active)?.name === 'Bài viết' && (
          <div className=" flex flex-col md:flex-row gap-6">
            {/* Tab left  */}
            <div className="w-full sm:w-[40%] bg-light-100 flex flex-col gap-4 ">
              <div className="card">
                <h3 className="text-lg font-bold mb-2">Introduction</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                  nulla dolor, ornare at commodo non, feugiat non nisi.
                  Phasellus faucibus mollis pharetra. Proin blandit ac massa sed
                  rhoncus
                </p>
                {/* <p>
                  <LocationCity className="inline-block mr-1" />
                  Hà Nội City
                </p> */}
              </div>
              <div className="card">
                <div className="flex justify-between items-center mb-3">
                  {' '}
                  <p className="text-lg font-bold mb-2">Ảnh</p>
                  <p className="text-sm text-blue-600 mt-2 text-right cursor-pointer hover:underline">
                    Xem tất cả ảnh
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <img
                    src="/img/car.jpg"
                    alt="Photo"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <img
                    src="/img/car.jpg"
                    alt="Photo"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <img
                    src="/img/car.jpg"
                    alt="Photo"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <img
                    src="/img/car.jpg"
                    alt="Photo"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <img
                    src="/img/car.jpg"
                    alt="Photo"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <img
                    src="/img/car.jpg"
                    alt="Photo"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <img
                    src="/img/car.jpg"
                    alt="Photo"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <img
                    src="/img/car.jpg"
                    alt="Photo"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <img
                    src="/img/car.jpg"
                    alt="Photo"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Sample posts */}
            <div className="flex-1">
              {myProfile && <PostCreation />}
              <UserPostList userId={userId} />
            </div>
          </div>
        )}
        {tabs.find((tab) => tab.active)?.name === 'Giới thiệu' && (
          <Box className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Giới thiệu</h3>
            <p>Chưa có thông tin giới thiệu.</p>
          </Box>
        )}
        {tabs.find((tab) => tab.active)?.name === 'Bạn bè' && (
          <Box className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Bạn bè</h3>
            <p>Chưa có bạn bè nào.</p>
          </Box>
        )}
        {tabs.find((tab) => tab.active)?.name === 'Ảnh' && (
          <Box className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Ảnh</h3>
            <p>Chưa có ảnh nào.</p>
          </Box>
        )}
        {tabs.find((tab) => tab.active)?.name === 'Video' && (
          <Box className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Video</h3>
            <p>Chưa có video nào.</p>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default Profile;
