import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Token storage key
const PUSH_TOKEN_KEY = 'push_notification_token';

/**
 * Register for push notifications and return the token
 */
export async function registerForPushNotificationsAsync() {
  let token;
  
  // Check if device is physical (not simulator)
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    // Check permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // If no existing permission, ask user
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    // If permission not granted, exit
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    // Get push token
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
    
    // Store token in AsyncStorage
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
  }

  // Set up special notification channels for Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0078fe',
    });
    
    // Create a channel for chat messages
    Notifications.setNotificationChannelAsync('chat-messages', {
      name: 'Chat Messages',
      description: 'Notifications for new chat messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0078fe',
    });
  }

  return token;
}

/**
 * Send a local notification
 */
export async function sendLocalNotification(title: string, body: string, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Immediately show notification
  });
}

/**
 * Send a chat message notification
 */
export async function sendChatNotification(senderName: string, message: string, conversationId: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: senderName,
      body: message,
      data: { conversationId },
      categoryIdentifier: 'chat',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Immediately show notification
  });
}

/**
 * Get the stored push token
 */
export async function getPushToken() {
  return await AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

export default {
  registerForPushNotificationsAsync,
  sendLocalNotification,
  sendChatNotification,
  getPushToken,
}; 