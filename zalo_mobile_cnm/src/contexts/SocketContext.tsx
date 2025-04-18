import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { RootState } from '../redux/reducers';
import { connectSocket, disconnectSocket, getSocket, isSocketConnected } from '../utils/Socket';

// Define the shape of our context
interface SocketContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

// Create the context with a default value
const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

// Provider props
interface SocketProviderProps {
  children: ReactNode;
}

// Provider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { userCurrent } = useSelector((state: RootState) => state.user);
  // Use a type assertion to fix the TypeScript error
  const isLoggedIn = useSelector((state: RootState) => (state.user as any).isLoggedIn) || false;

  // Connect to socket
  const connect = () => {
    if (userCurrent && userCurrent._id && !isConnected) {
      connectSocket(userCurrent, () => {
        console.log('Socket connected successfully');
        setIsConnected(true);
      });
    }
  };

  // Disconnect from socket
  const disconnect = () => {
    disconnectSocket();
    setIsConnected(false);
  };

  // Handle app state changes (background, foreground)
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && isLoggedIn && !isConnected) {
      // App came to foreground, reconnect if user is logged in
      connect();
    } else if (nextAppState === 'background') {
      // Optionally disconnect when app goes to background
      // disconnect();
      // Or keep connected for background notifications
    }
  };

  // Connect when user logs in
  useEffect(() => {
    if (isLoggedIn && userCurrent?._id) {
      connect();
    }
  }, [isLoggedIn, userCurrent]);

  // Listen for app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isLoggedIn, isConnected]);

  // Handle network changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      if (state.isConnected && isLoggedIn && !isConnected) {
        // Internet connection was restored, reconnect socket
        connect();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isLoggedIn, isConnected]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, []);

  // Check connection status periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      const connected = isSocketConnected();
      if (connected !== isConnected) {
        setIsConnected(connected);
        
        // If we think we're connected but socket isn't, try to reconnect
        if (isConnected && !connected && isLoggedIn) {
          connect();
        }
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isConnected, isLoggedIn]);

  return (
    <SocketContext.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext);

export default SocketContext; 