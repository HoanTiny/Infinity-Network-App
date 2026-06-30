// import SearchUser from '@components/SearchUser/index.tsx';
// import Profile from '@page/profile/Profile.tsx';
// import ListFriends from '@page/profile/FriendList.tsx';
// import About from '@page/profile/About.tsx';
// import Protectedlayout from '@page/ProtectedLayout.tsx';
// import RootLayout from '@page/RootLayout';
// import HomePage from '@page/HomePage';
// import AuthLayout from '@page/auth/AuthLayout';
// import RegisterPage from '@page/auth/RegisterPage';
// import LoginPage from '@page/auth/LoginPage';
// import OTPVerifyPage from '@page/auth/OTPVerifyPage';
// import { createBrowserRouter, Navigate } from 'react-router-dom';
// import Account from '@page/settings/Account';
// import PostDetail from '@components/PostDetail';

// const router = createBrowserRouter([
//   {
//     element: <RootLayout />,
//     children: [
//       {
//         element: <Protectedlayout />,
//         children: [
//           {
//             path: '/',
//             element: <HomePage />,
//           },
//           {
//             path: '/search/users',
//             element: <SearchUser />,
//           },
//           {
//             path: '/user/:userId',
//             element: <Profile />,
//             children: [
//               {
//                 index: true,
//                 element: <Navigate to="about" replace />,
//               },
//               {
//                 path: 'friends',
//                 element: <ListFriends />,
//               },
//               {
//                 path: 'about',
//                 element: <About />,
//               },

//               {
//                 path: 'photos',
//                 element: <div>Photos</div>,
//               },
//             ],
//           },
//           {
//             path: '/settings',
//             children: [
//               {
//                 index: true,
//                 element: <Navigate to="account" replace />,
//               },
//               {
//                 path: 'account',
//                 element: <Account />,
//               },
//             ],
//           },
//         ],
//       },

//       {
//         path: '/posts/:postId',
//         element: <PostDetail />,
//       },

//       {
//         element: <AuthLayout />,
//         children: [
//           {
//             path: '/register',
//             element: <RegisterPage />,
//           },
//           {
//             path: '/login',
//             element: <LoginPage />,
//           },
//           {
//             path: 'verify',
//             element: <OTPVerifyPage />,
//           },
//         ],
//       },
//     ],
//   },
// ]);

// export default router;

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
import ForgotPasswordPage from '@page/auth/ForgotPasswordPage';
import ResetPasswordPage from '@page/auth/ResetPasswordPage';
import { Navigate } from 'react-router-dom';
import Account from '@page/settings/Account';
import Messages from '@page/messages';
import ChatDetail from '@page/messages/ChatDetail';
import FriendRequestsPage from '@page/friends/FriendRequestsPage';
import PhotosTab from '@page/profile/PhotosTab';

// Xóa createBrowserRouter, chuyển sang export routes array để dùng với <Routes> trong App.tsx
const routes = [
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
                element: <PhotosTab />,
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
          {
            path: '/friends/requests',
            element: <FriendRequestsPage />,
          },
          {
            path: 'messages',
            element: <Messages />, // Chưa có component, để tạm
            children: [
              {
                path: ':userId',
                element: <ChatDetail />, // Chưa có component, để tạm
              },
            ],
          },
        ],
      },
      // Route modal detail bài viết sẽ được render ở App.tsx khi có background
      {
        path: '/posts/:postId',
        element: null, // Để trống, sẽ render modal ở App.tsx
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
          {
            path: 'forgot-password',
            element: <ForgotPasswordPage />,
          },
          {
            path: 'reset-password',
            element: <ResetPasswordPage />,
          },
        ],
      },
    ],
  },
];

export default routes;
