import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import NotificationService from '../services/NotificationService';

// Define context type
type NotificationContextType = {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  lastNotificationResponse: Notifications.NotificationResponse | null;
};

// Create context
const NotificationContext = createContext<NotificationContextType>({
  expoPushToken: null,
  notification: null,
  lastNotificationResponse: null,
});

// Provider props type
type NotificationProviderProps = {
  children: React.ReactNode;
};

// Provider component
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [lastNotificationResponse, setLastNotificationResponse] = 
    useState<Notifications.NotificationResponse | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  
  // Get current user from Redux store
  const { userCurrent } = useSelector((state: RootState) => state.user);
  const isLoggedIn = useSelector((state: RootState) => (state.user as any).isLoggedIn) || false;

  useEffect(() => {
    // Only register for notifications if user is logged in
    if (isLoggedIn && userCurrent?._id) {
      registerForPushNotifications();
    }

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Store the notification response for later use instead of navigating directly
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      setLastNotificationResponse(response);
    });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [isLoggedIn, userCurrent]);

  // Register for push notifications
  const registerForPushNotifications = async () => {
    try {
      const token = await NotificationService.registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
      }
      
      // Here you would typically send this token to your backend
      // This way your server can send push notifications to this device
      // updateUserPushToken(token);
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      expoPushToken, 
      notification,
      lastNotificationResponse 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = () => useContext(NotificationContext);

export default NotificationContext; 