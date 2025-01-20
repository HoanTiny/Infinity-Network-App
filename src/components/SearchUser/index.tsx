/* eslint-disable @typescript-eslint/no-explicit-any */
import UserCard from '@components/UserCard';
import { useSearchUsersQuery } from '@services/rootApi';
import { useLocation } from 'react-router-dom';

function SearchUser() {
  const location = useLocation();

  const { data, isFetching } = useSearchUsersQuery({
    limit: 10,
    offset: 0,
    searchQuery: location?.state?.searchQuery,
  });

  if (isFetching) {
    return <div>Loading...</div>;
  }

  console.log('data', data);
  return (
    <div className="py-4 px-[80px] container flex-col">
      <h1 className="mb-2">Search</h1>

      <div className="pb-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {(data?.users || []).map((user) => (
          <UserCard
            key={user._id}
            id={user._id}
            isFriend={user.isFriend}
            fullName={user.fullName}
            avatar={user?.avatar}
            requestSent={user?.requestSent}
            requestReceived={user?.requestReceived}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchUser;
