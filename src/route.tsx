import SearchUser from '@components/SearchUser/index.tsx';
import Profile from '@page/profile/Profile.tsx';
import ListFriends from '@page/profile/FriendList.tsx';
import About from '@page/profile/About.tsx';
import Protectedlayout from '@page/ProtectedLayout.tsx';
import RootLayout from '@page/RootLayout';
import HomePage from '@page/HomePage';
import AuthLayout from '@page/auth/AuthLayout';
import RegisterPage from '@page/auth/RegisterPage';
import LoginPage from '@page/auth/LoginPage';
import OTPVerifyPage from '@page/auth/OTPVerifyPage';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Account from '@page/settings/Account';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <Protectedlayout />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/search/users',
            element: <SearchUser />,
          },
          {
            path: '/user/:userId',
            element: <Profile />,
            children: [
              {
                index: true,
                element: <Navigate to="about" replace />,
              },
              {
                path: 'friends',
                element: <ListFriends />,
              },
              {
                path: 'about',
                element: <About />,
              },

              {
                path: 'photos',
                element: <div>Photos</div>,
              },
            ],
          },
          {
            path: '/settings',
            children: [
              {
                index: true,
                element: <Navigate to="account" replace />,
              },
              {
                path: 'account',
                element: <Account />,
              },
            ],
          },
        ],
      },

      {
        element: <AuthLayout />,
        children: [
          {
            path: '/register',
            element: <RegisterPage />,
          },
          {
            path: '/login',
            element: <LoginPage />,
          },
          {
            path: 'verify',
            element: <OTPVerifyPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
