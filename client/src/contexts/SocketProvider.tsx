// SocketProvider.tsx

import {io, Socket} from 'socket.io-client';
import { useAppContext } from './AppProvider';
import React, { createContext, useContext, useEffect } from 'react';

interface SocketContextType {
    socket: Socket;
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext debe usarse dentro de un SocketProvider');
    }
    return context;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export default function SocketProvider({children} : {children: React.ReactNode}) {
    const { apiUrl, user, noReadNotificationsCount, setNoReadNotificationsCount } = useAppContext();
    const socket = io(apiUrl, {
        autoConnect: false,
        query: {
            userId: user?.id,
        }
    });

    useEffect(() => {
      if (user && user.id) {
          socket.connect();
          /* console.log('Socket connected'); */
          
          // Registrar el evento después de conectar
          socket.on('new-notification', (notificationData) => {
              console.log('Notification received:', notificationData);
              setNoReadNotificationsCount(prev => prev + 1);
          });
        }
  
        return () => {
            socket.disconnect();
            /* console.log('Socket disconnected'); */
            socket.off('new-notification');
        };
    }, [user]);
  

    let value = {
        socket
    }

  return (
    <SocketContext.Provider value={value} >{children}</SocketContext.Provider>
  )
}
