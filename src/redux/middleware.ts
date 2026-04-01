/* eslint-disable @typescript-eslint/no-explicit-any */
import { rootApi } from '@services/rootApi';
import { logOut } from './slice/authSlice';
import { persistor } from './store';

export const logOutMiddleware = (store: any) => {
  return (next: any) => {
    return (action: any) => {
      if (action.type === logOut.type) {
        store.dispatch(rootApi.util.resetApiState());
        persistor.purge();
        console.log('User has logged out');
      }
      return next(action);
    };
  };
};
