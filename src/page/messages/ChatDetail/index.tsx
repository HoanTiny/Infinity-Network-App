import UserAvatar from '@components/UserAvatar';

const ChatDetail = () => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between p-4 mb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-3">
          <UserAvatar />
          <h3>Friend Name</h3>
        </div>
        <div className="flex items-center gap-2">
          <p>Gọi</p>
          <p>Video</p>
        </div>
      </div>
      <div className="rounded-lg p-4 overflow-y-auto flex flex-col h-full flex-1">
        {/* Messages will go here */}
        <div className="mb-4 flex-1">
          <div className="flex items-start mb-2">
            <UserAvatar />

            <div className="ml-2 bg-blue-100 p-2 rounded-lg">
              <p>Hello! How are you?</p>
            </div>
          </div>
          <div className="flex items-start mb-2 justify-end">
            <div className="bg-gray-100 p-2 rounded-lg">
              <p>I'm good, thanks! And you?</p>
            </div>
            <UserAvatar />
          </div>
          {/* Add more messages as needed */}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;
