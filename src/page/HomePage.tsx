// import { useGetAuthUserQuery } from '@services/rootApi';
// import { Navigate } from 'react-router-dom';

import FriendRequest from '@components/FriendRequests';
import PostCreation from '@components/PostCreation';
import PostList from '@components/PostList';
import Sidebar from '@components/Sidebar.tsx';

function HomePage() {
  return (
    <div className="flex gap-4 p-6 bg-[#eeeeee]">
      <Sidebar />
      <div className="flex-1">
        <PostCreation />
        <PostList />
      </div>
      <div className="w-64">
        <FriendRequest />
      </div>
    </div>
  );
}

export default HomePage;
