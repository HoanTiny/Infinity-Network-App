/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

interface SocketProviderProps {
  children: ReactNode;
}

export const socket = io('https://api.holetex.com', {
  autoConnect: false,
  path: '/v1/we-connect/socket.io',
});
function SocketProvider({ children }: SocketProviderProps) {
  const token = useSelector((state: any) => state.auth.accessToken);

  useEffect(() => {
    socket.auth = { token };

    if (token) {
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [token]);

  return <>{children}</>;
}

export default SocketProvider;
