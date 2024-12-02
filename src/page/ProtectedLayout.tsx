import Header from '@components/Header';
import { saveUserinfo } from '@redux/slice/authSlice';
import { useGetAuthUserQuery } from '@services/rootApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function Protectedlayout() {
  const dispatch = useDispatch();
  const response = useGetAuthUserQuery() as {
    data?: { _id?: string };
    isLoading: boolean;
    error?: { code: number };
    isSuccess: boolean;
  };
  console.log({ response });

  useEffect(() => {
    if (response.isSuccess) {
      console.log('User is logged in');
      dispatch(saveUserinfo(response.data));
    }
  }, [response.isSuccess, response.data, dispatch]);

  if (response.error?.code === 401) {
    return <Navigate to="/login" />;
  }

  if (response.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default Protectedlayout;
