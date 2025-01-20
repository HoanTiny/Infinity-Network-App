/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

interface SocketProviderProps {
  children: ReactNode;
}

function SocketProvider({ children }: SocketProviderProps) {
  const token = useSelector((state: any) => state.auth.accessToken);
  const socket = io('https://api.holetex.com', {
    autoConnect: false,
    path: '/v1/we-connect/socket.io',
  });

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
  }, [socket, token]);

  return <>{children}</>;
}

export default SocketProvider;
