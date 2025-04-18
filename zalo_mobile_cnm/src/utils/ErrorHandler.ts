import { Platform, ToastAndroid, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { API_ERRORS } from '../constants/ApiConstant';

/**
 * Error response from an API
 */
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
  logout?: boolean;
}

/**
 * Show a toast message (Android) or alert (iOS)
 * @param message Message to show
 */
export const showErrorMessage = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    Alert.alert('Error', message);
  }
};

/**
 * Check if the device has an active internet connection
 * @returns Promise that resolves to a boolean
 */
export const isNetworkConnected = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    console.log('📱 NetInfo state:', {
      isConnected: state.isConnected,
      type: state.type,
      isInternetReachable: state.isInternetReachable,
      details: state.details
    });
    
    // Consider the connection valid if isConnected is true, even if isInternetReachable is null
    // This helps avoid false negatives
    const connected = state.isConnected === true;
    
    // Only do the test fetch if we have a connection that might be valid
    if (connected) {
      // Try a lightweight ping to verify actual internet connectivity
      try {
        // Use a timeout to avoid hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Do a lightweight HEAD request to Google to verify internet connectivity
        const response = await fetch('https://www.google.com', { 
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // If we get here, internet is definitely reachable
        return response.ok;
      } catch (fetchError: unknown) {
        // If the fetch fails, we might still have internal network connectivity
        // For development purposes, we'll trust the isConnected value
        console.log('📱 Internet reachability test failed:', 
          fetchError instanceof Error ? fetchError.message : 'Unknown error');
        return connected; 
      }
    }
    
    return connected;
  } catch (error) {
    console.error('📱 Error checking network status:', error);
    // Assume connected in case of errors in the check itself
    return true;
  }
};

/**
 * Handle API errors in a consistent way
 * @param error Error from API
 * @param defaultMessage Default message to show if error doesn't have a message
 * @returns Formatted error object
 */
export const handleApiError = (error: any, defaultMessage: string = API_ERRORS.DEFAULT): ApiError => {
  console.error('API Error:', error);
  
  // If it's already an ApiError, just return it
  if (error && error.message) {
    return error as ApiError;
  }
  
  // Handle network errors
  if (error && error.message && error.message.includes('Network Error')) {
    showErrorMessage('Network connection error. Please check your internet connection.');
    return {
      message: 'Network connection error',
      status: 0
    };
  }
  
  // Handle axios errors
  if (error && error.response) {
    const { status, data } = error.response;
    
    // Session expired / unauthorized
    if (status === 401) {
      return {
        message: 'Your session has expired. Please log in again.',
        status: 401,
        logout: true
      };
    }
    
    // Server error
    if (status >= 500) {
      return {
        message: 'Server error. Please try again later.',
        status: status,
        data: data
      };
    }
    
    // Client error with response message
    if (data && data.message) {
      return {
        message: data.message,
        status: status,
        data: data
      };
    }
    
    // Generic client error
    return {
      message: `Request failed with status ${status}`,
      status: status,
      data: data
    };
  }
  
  // Generic error with fallback message
  return {
    message: error?.message || defaultMessage
  };
};

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param retries Number of retries
 * @param delay Initial delay in ms
 * @param maxDelay Maximum delay in ms
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
  maxDelay: number = 10000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    const nextDelay = Math.min(delay * 2, maxDelay);
    console.log(`Retrying after ${delay}ms, ${retries} retries left`);
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(withRetry(fn, retries - 1, nextDelay, maxDelay));
      }, delay);
    });
  }
};

/**
 * Execute a function with network connectivity check
 * @param fn Function to execute
 * @param errorMessage Error message to show if network is not connected
 */
export const withNetworkCheck = async <T>(
  fn: () => Promise<T>,
  errorMessage: string = 'No internet connection. Please check your network settings.'
): Promise<T> => {
  const isConnected = await isNetworkConnected();
  
  if (!isConnected) {
    showErrorMessage(errorMessage);
    throw new Error(errorMessage);
  }
  
  return fn();
};

export default {
  handleApiError,
  showErrorMessage,
  isNetworkConnected,
  withRetry,
  withNetworkCheck
};