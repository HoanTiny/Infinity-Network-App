// import { StrictMode } from 'react';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '@page/RootLayout';
import HomePage from '@page/HomePage';
import AuthLayout from '@page/auth/AuthLayout';
import RegisterPage from '@page/auth/RegisterPage';
import LoginPage from '@page/auth/LoginPage';
import OTPVerifyPage from '@page/auth/OTPVerifyPage';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistor, store } from '@redux/store';
import { ThemeProvider } from '@mui/material';
import theme from './configs/muiConfigs.ts';
import ModalProvider from '@context/ModalProvider';
import Protectedlayout from '@page/ProtectedLayout.tsx';
import { PersistGate } from 'redux-persist/integration/react';

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

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
