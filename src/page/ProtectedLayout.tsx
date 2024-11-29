import { useGetAuthUserQuery } from '@services/rootApi';
import { Navigate, Outlet } from 'react-router-dom';

function Protectedlayout() {
  const response = useGetAuthUserQuery() as {
    data?: { _id?: string };
    isLoading: boolean;
  };
  console.log({ response });

  if (response.isLoading) {
    return <div>Loading...</div>;
  }

  if (!response?.data?._id) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}

export default Protectedlayout;
