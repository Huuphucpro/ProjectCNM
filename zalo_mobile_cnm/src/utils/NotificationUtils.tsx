import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from '../contexts/NotificationContext';

/**
 * NavigationHandler component to handle notification navigation
 * This component should be rendered inside screens where navigation is available
 * It uses the notification context to respond to user interactions with notifications
 */
export const NavigationHandler = () => {
  const navigation = useNavigation();
  const { lastNotificationResponse } = useNotifications();

  useEffect(() => {
    if (lastNotificationResponse) {
      const data = lastNotificationResponse.notification.request.content.data;
      
      // Handle navigation based on notification type
      if (data.conversationId) {
        // @ts-ignore - Navigation typing is complex
        navigation.navigate('Chat', { conversationId: data.conversationId });
      }
    }
  }, [lastNotificationResponse, navigation]);

  return null; // This is a utility component that doesn't render anything
}; 