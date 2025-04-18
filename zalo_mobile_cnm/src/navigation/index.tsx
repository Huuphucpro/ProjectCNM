import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// Import các màn hình
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import ContactsScreen from '../screens/ContactsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ForgotPassScreen from '../screens/ForgotPassScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';

// Định nghĩa các kiểu params cho navigation
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  NewPassword: { email: string; otp: string };
};

export type MainTabParamList = {
  ChatList: undefined;
  Contacts: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Main: undefined;
  Chat: { 
    conversationId: string; 
    name: string; 
    avatar?: string;
    isGroup?: boolean;
  };
  EditProfile: undefined;
};

// Tạo stack và tab navigators với type safety
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom header cho Chat Screen
const ChatHeader = ({ route, navigation }: any) => {
  const { name, avatar, isGroup } = route.params;
  
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#2483ff" />
      </TouchableOpacity>
      
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>{name}</Text>
        <Text style={styles.headerSubtitle}>
          {isGroup ? 'Nhóm chat' : 'Trực tuyến'}
        </Text>
      </View>
      
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="call" size={22} color="#2483ff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="videocam" size={22} color="#2483ff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="more-vert" size={22} color="#2483ff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Component Tab Navigator cho các màn hình chính
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ChatList') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2483ff',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
      })}
    >
      <Tab.Screen 
        name="ChatList" 
        component={ChatListScreen} 
        options={{ 
          tabBarLabel: 'Tin nhắn',
          headerShown: true,
          headerTitle: 'Trò chuyện',
          headerTitleStyle: styles.screenTitle,
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen 
        name="Contacts" 
        component={ContactsScreen}
        options={{ 
          tabBarLabel: 'Danh bạ',
          headerShown: true,
          headerTitle: 'Danh bạ',
          headerTitleStyle: styles.screenTitle,
          headerTitleAlign: 'center',
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarLabel: 'Cá nhân',
          headerShown: true,
          headerTitle: 'Trang cá nhân',
          headerTitleStyle: styles.screenTitle,
          headerTitleAlign: 'center',
        }} 
      />
    </Tab.Navigator>
  );
};

// Auth Navigator cho các màn hình đăng nhập
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassScreen} />
      <AuthStack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <AuthStack.Screen name="NewPassword" component={NewPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// Main Navigator cho các màn hình đã đăng nhập
const LoggedInNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen 
        name="Main" 
        component={MainTabNavigator} 
        options={{ headerShown: false }}
      />
      <MainStack.Screen 
        name="Chat" 
        component={ChatScreen as any}
        options={({ route, navigation }) => ({
          headerShown: true,
          header: () => <ChatHeader route={route} navigation={navigation} />
        })}
      />
      <MainStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right'
        }}
      />
    </MainStack.Navigator>
  );
};

// Component chính cho điều hướng
type AppNavigatorProps = {
  children?: React.ReactNode;
};

const AppNavigator: React.FC<AppNavigatorProps> = ({ children }) => {
  // Using a simple type assertion with any
  // This is safe because we know the user state has isLoggedIn property
  // @ts-ignore - suppress TypeScript error for user state access
  const isLoggedIn = useSelector((state: RootState) => state.user?.isLoggedIn) || false;

  // Handle navigation from notifications if needed
  const handleNavigationStateChange = () => {
    // Additional logic for navigation state changes can be added here
  };

  return (
    <NavigationContainer onStateChange={handleNavigationStateChange}>
      {isLoggedIn ? (
        <>
          <LoggedInNavigator />
          {children}
        </>
      ) : (
        <>
          <AuthNavigator />
          {children}
        </>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 60,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4CAF50',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2483ff',
  }
});

export default AppNavigator;