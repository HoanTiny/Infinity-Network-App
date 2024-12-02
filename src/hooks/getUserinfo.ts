/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from 'react-redux';
export function useUserInfo() {
  return useSelector((state: any) => state.auth.userInfo);
}
