import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Type định nghĩa cho các params trong stack navigation
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  NewPassword: { email: string; otp: string };
};

export type MainStackParamList = {
  Main: undefined;
  Chat: { 
    conversationId: string; 
    receiverId: string;
    receiverName: string;
    receiverAvatar?: string;
  };
};

// Type định nghĩa cho các params trong tab navigation
export type MainTabParamList = {
  ChatList: undefined;
  Contacts: undefined;
  Profile: undefined;
};

// Kết hợp tất cả param lists
export type RootStackParamList = AuthStackParamList & MainStackParamList;

// Type định nghĩa cho navigation và route props
export type RootStackNavigationProp<T extends keyof RootStackParamList> = 
  NativeStackNavigationProp<RootStackParamList, T>;
  
export type RootStackRouteProp<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;

export type MainTabNavigationProp<T extends keyof MainTabParamList> = 
  BottomTabNavigationProp<MainTabParamList, T>;

// Hook types
export type UseNavigation<T extends keyof RootStackParamList> = () => RootStackNavigationProp<T>;
export type UseRoute<T extends keyof RootStackParamList> = () => RootStackRouteProp<T>; 