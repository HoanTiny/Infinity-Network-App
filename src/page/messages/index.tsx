import ListConverstation from './ListConverstation';
// import ChatDetail from './ChatDetail';
import { Outlet } from 'react-router-dom';

const Messages = () => {
  return (
    <div className="flex gap-4 min-h-[calc(100vh-64px)] ">
      {/* Left List Friends */}
      <ListConverstation />

      {/* Right messages */}
      {/* <ChatDetail /> */}
      <Outlet />
    </div>
  );
};

export default Messages;
