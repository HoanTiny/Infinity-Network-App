import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
// Supports weights 100-900
import '@fontsource-variable/public-sans';
import Snackbar from '@mui/material/Snackbar';
// import { closeSnackbar } from '@redux/slice/snackbar';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { closeSnackbar } from '@redux/slice/snackbar';

function RootLayout() {
  const dispatch = useDispatch();
  const { open, type, message } = useSelector(
    (state: {
      snackbar: {
        open: boolean;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
      };
    }) => state.snackbar
  );
  return (
    <div>
      <Suspense>
        <Outlet />
      </Suspense>
      {/* Lấy từ store redux */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => dispatch(closeSnackbar())}
      >
        <Alert severity={type} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default RootLayout;
