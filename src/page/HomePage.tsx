import FriendRequest from "@components/FriendRequests";
import PostCreation from "@components/PostCreation";
import PostList from "@components/PostList";
import Sidebar from "@components/Sidebar.tsx";
import UserAvatar from "@components/UserAvatar";
import { useUserInfo } from "@hooks/getUserinfo";
import { useMediumScreen } from "@hooks/index";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const mediumScreen = useMediumScreen();
  const navigate = useNavigate();
  const infoUser = useUserInfo();
  console.log({ infoUser });

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="flex">
        {/* Left Sidebar - Narrow (80px) */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Feed Content */}
          <div className="flex-1 flex justify-center px-4 py-8">
            <div className="w-full max-w-[630px] space-y-8">
              <PostCreation />
              <PostList />
            </div>
            {!mediumScreen && (
              <div className=" w-80 h-screen p-6 overflow-y-auto border-gray-200 bg-[#fafafa]">
                <div className="sticky top-0 pt-6">
                  <div
                    className="hover:bg-gray-100 transition-colors flex items-center gap-2 px-4 rounded-lg cursor-pointer"
                    onClick={() => navigate(`/user/${infoUser._id}`)}
                  >
                    <UserAvatar isMyAvatar={true} size="sm" />
                    <span className="text-sm font-medium">
                      {infoUser.fullName}
                    </span>
                  </div>
                  <FriendRequest />
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Friend Requests (Desktop only) */}
          {/* {!mediumScreen && (
            <div className="fixed right-0 top-0 w-80 h-screen p-6 overflow-y-auto border-l border-gray-200 bg-[#fafafa]">
              <div className="sticky top-0 pt-6">
                <FriendRequest />
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
