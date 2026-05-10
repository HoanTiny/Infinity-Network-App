import Loading from '@components/Loading';
import FloatingChatBubble from '@components/FloatingChatBubble';
import SocketProvider from '@context/SocketProvider';
import { saveUserinfo } from '@redux/slice/authSlice';
import { useGetAuthUserQuery } from '@services/rootApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

function Protectedlayout() {
  const dispatch = useDispatch();
  const response = useGetAuthUserQuery() as {
    data?: { _id?: string };
    isLoading: boolean;
    error?: { code: number };
    isSuccess: boolean;
  };
  // console.log({ response });

  useEffect(() => {
    if (response.isSuccess) {
      // console.log('User is logged in');
      dispatch(saveUserinfo(response.data));
    }
  }, [response.isSuccess, response.data, dispatch]);

  // if (response.error?.code === 401) {
  //   return <Navigate to="/login" />;
  // }

  if (response.isLoading) {
    return <Loading />;
  }
  return (
    <SocketProvider>
      <div>
        {/* <div className="sticky top-0 z-10">
          <Header />
        </div> */}
        <Outlet />
        <FloatingChatBubble />
      </div>
    </SocketProvider>
  );
}

export default Protectedlayout;
