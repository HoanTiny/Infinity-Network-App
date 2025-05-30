// import { useGetAuthUserQuery } from '@services/rootApi';
// import { Navigate } from 'react-router-dom';

import FriendRequest from '@components/FriendRequests';
import PostCreation from '@components/PostCreation';
import PostList from '@components/PostList';
import Sidebar from '@components/Sidebar.tsx';
import { useMediumScreen } from '@hooks/index';

function HomePage() {
  const mediumScreen = useMediumScreen();
  return (
    <div className="flex gap-4 p-6 bg-[#eeeeee]">
      <Sidebar />
      <div className="flex-1 px-10 items-center justify-center flex">
        <div className="w-[80%]">
          <PostCreation />
          <PostList />
        </div>
      </div>
      {!mediumScreen && (
        <div className="w-80 sticky top-20 h-screen">
          <FriendRequest />
        </div>
      )}
    </div>
  );
}

export default HomePage;
