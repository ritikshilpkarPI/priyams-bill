import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { socketEvents } from 'src/utils/constants/socketEvents';

const useSocket = () => {
  const [socket, setSocket] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const listenersRef = useRef([]);

  const addSocketEventListener = ({ event, callback }) => {
    if (event && callback && isConnected) {
      socket.on(event, callback);
      listenersRef.current = [...listenersRef.current, { event, callback }];
    }
  };

  const removeSocketEventListener = (removeEventName) => {
    const listener =
      removeEventName &&
      listenersRef.current.find(({ event }) => event === removeEventName);
    if (listener) {
      socket.off(listener.event, listener.callback);
      listenersRef.current = listenersRef.current.filter(({ event }) => event !== removeEventName);
    }
  };

  useEffect(() => {
    const _socket = io(process.env.REACT_APP_SOCKET_SERVER_URL || '', {
      auth: {
        token: process.env.REACT_APP_SOCKET_SERVER_AUTH_TOKEN,
      },
    });
    _socket.on(socketEvents.CONNECT, () => {
      setIsConnected(true);
    });
    _socket.on(socketEvents.DISCONNECT, () => {
      setIsConnected(false);
      socket?.disconnect();
    });
    setSocket(_socket);
    return () => {
      if (_socket.connected) {
        listenersRef.current.map(({ event, callback }) =>
          _socket.off(event, callback)
        );
        _socket.disconnect();
      }
      setSocket(undefined);
    };
  }, []);

  return { isConnected, addSocketEventListener, removeSocketEventListener };
};

export default useSocket;
