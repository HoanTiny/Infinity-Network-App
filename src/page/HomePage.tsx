import { Button } from '@mui/material';
// import { useGetAuthUserQuery } from '@services/rootApi';
// import { Navigate } from 'react-router-dom';

function HomePage() {
  // const response = useGetAuthUserQuery() as {
  //   data?: { _id?: string };
  //   isLoading: boolean;
  // };
  // console.log({ response });

  // if (response.isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!response?.data?._id) {
  //   <Navigate to={'/login'} />;
  // }
  return (
    <div>
      Home
      <Button variant="contained">LOGIN</Button>
    </div>
  );
}

export default HomePage;
