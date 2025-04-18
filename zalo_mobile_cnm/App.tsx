import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import AppNavigator from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { SocketProvider } from './src/contexts/SocketContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import NetInfo from '@react-native-community/netinfo';

const App = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [animation] = useState(new Animated.Value(0));

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      
      // Animate in the notification
      if (!state.isConnected) {
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }).start();
      } else {
        // Animate out after a delay
        setTimeout(() => {
          Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          }).start();
        }, 2000);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Offline status notification component
  const OfflineNotification = () => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 0]
    });

    return (
      <Animated.View 
        style={[
          styles.offlineContainer,
          { transform: [{ translateY }] }
        ]}
      >
        <Text style={styles.offlineText}>
          No internet connection
        </Text>
      </Animated.View>
    );
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <ErrorBoundary>
            <SocketProvider>
              <View style={styles.container}>
                <AppNavigator />
                <OfflineNotification />
              </View>
            </SocketProvider>
          </ErrorBoundary>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  offlineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default App;
