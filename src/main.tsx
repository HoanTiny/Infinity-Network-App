// import { StrictMode } from 'react';
import './index.css';
import { RouterProvider } from 'react-router-dom';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { persistor, store } from '@redux/store';
import { ThemeProvider } from '@mui/material';
import theme from './configs/muiConfigs.ts';
// import ModalProvider from '@context/ModalProvider';
import Dialog from '@components/Dialog/index.tsx';
import Loading from '@components/Loading/index.tsx';
import { PersistGate } from 'redux-persist/integration/react';
import router from './route.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor}>
      <ThemeProvider theme={theme}>
        {/* <ModalProvider> */}
        <RouterProvider router={router} />
        <Dialog />
        {/* </ModalProvider> */}
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
