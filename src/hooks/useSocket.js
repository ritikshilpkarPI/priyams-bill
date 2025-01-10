import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { socketEvents } from 'src/utils/constants/socketEvents';

const useSocket = ({ billListener }) => {
  const [socket, setSocket] = useState();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const _socket = io(process.env.REACT_APP_SOCKET_SERVER_URL || '', {
      auth: {
        token: process.env.SOCKET_SERVER_AUTH_TOKEN,
      },
    });
    _socket.on(socketEvents.CONNECT, () => {
      billListener && _socket.on(socketEvents.BILLS, billListener);
      setIsConnected(true);
    });
    _socket.on(socketEvents.DISCONNECT, () => {
      setIsConnected(false);
      socket?.disconnect();
    });
    setSocket(_socket);
    return () => {
      if (_socket.connected) {
        billListener && _socket.off(socketEvents.BILLS, billListener);
        _socket.disconnect();
      }
      setSocket(undefined);
    };
  }, []);

  return { isConnected };
};

export default useSocket;
