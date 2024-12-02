/* eslint-disable @typescript-eslint/no-explicit-any */
import { logOut } from './slice/authSlice';
import { persistor } from './store';

export const logOutMiddleware = () => {
  return (next: any) => {
    return (action: any) => {
      if (action.type === logOut.type) {
        persistor.purge();
        console.log('User has logged out');
      }
      return next(action);
    };
  };
};
