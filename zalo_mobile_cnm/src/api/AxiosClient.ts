import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  BASE_URL, 
  API_TIMEOUT, 
  API_ERRORS, 
  HTTP_STATUS, 
  USER_API 
} from '../constants/ApiConstant';
import { handleApiError, isNetworkConnected, showErrorMessage, ApiError } from '../utils/ErrorHandler';
import { dispatch } from '../utils/storeAccess';
import { logout } from '../redux/actions/UserActions';

// Interface for the error response
interface ErrorResponse {
  message: string;
  statusCode: number;
}

// Interface for the response after refresh token
interface RefreshTokenResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  refeshToken?: string;
}

// Token storage keys
const TOKEN_STORAGE_KEY = 'auth_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

// Tạo instance Axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: API_TIMEOUT,
});

// Log request (development only)
const logRequest = (config: AxiosRequestConfig) => {
  if (__DEV__) {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.params) {
      console.log('📝 Params:', config.params);
    }
    if (config.data) {
      console.log('📦 Data:', config.data);
    }
  }
};

// Log response (development only)
const logResponse = (response: AxiosResponse) => {
  if (__DEV__) {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('📊 Status:', response.status);
    console.log('📄 Data:', response.data);
  }
};

// Log error (development only)
const logError = (error: AxiosError) => {
  if (__DEV__) {
    console.log('❌ API Error:');
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📄 Data:', error.response.data);
    } else if (error.request) {
      console.log('🌐 No response received:', error.request);
    } else {
      console.log('🔍 Error setting up request:', error.message);
    }
  }
};

// Get user token from storage
const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    return token ? JSON.parse(token) : null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Get refresh token from storage
const getRefreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    return refreshToken ? JSON.parse(refreshToken) : null;
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

// Save tokens to storage
export const saveTokens = async (token: string, refreshToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token));
    await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, JSON.stringify(refreshToken));
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

// Clear tokens from storage
export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// Handle authentication errors and perform logout
const handleAuthError = async () => {
  await clearTokens();
  dispatch(logout());
};

// Interceptor cho request
axiosClient.interceptors.request.use(
  async (config) => {
    // Log request in development
    logRequest(config);
    
    // Always check network connectivity regardless of environment
    const isConnected = await isNetworkConnected();
    console.log('📱 Network connectivity check result:', isConnected);
    
    if (!isConnected && !config.url?.includes('refresh-token')) {
      console.log('📱 Network connection failed - throwing error');
      throw new Error('Network Error');
    }
    
    // Get token from AsyncStorage
    const token = await getToken();
    console.log('📱 Token retrieved:', token ? 'Token exists' : 'No token found');
    
    // Add token to header if available
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('📱 Request to:', `${config.baseURL || BASE_URL}${config.url}`);
    return config;
  },
  (error) => {
    // Handle request error
    console.error('Request Error:', error);
    return Promise.reject(handleApiError(error));
  }
);

// Interceptor cho response
axiosClient.interceptors.response.use(
  (response) => {
    // Log response in development
    logResponse(response);
    console.log('📱 Response success from:', response.config.url);
    
    // Trả về dữ liệu response
    return response.data;
  },
  async (error: AxiosError<ErrorResponse>) => {
    // Log error in development
    logError(error);
    console.log('📱 Response error details:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data
    });
    
    const originalRequest = error.config;
    
    // Check if we need to refresh the token
    if (
      error.response?.status === HTTP_STATUS.UNAUTHORIZED && 
      originalRequest && 
      !(originalRequest as any)._retry
    ) {
      console.log('📱 Unauthorized error, attempting token refresh');
      (originalRequest as any)._retry = true;
      
      try {
        // Get refresh token
        const refreshToken = await getRefreshToken();
        console.log('📱 Refresh token available:', !!refreshToken);
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Request new access token
        const response = await axios.post<RefreshTokenResponse>(
          `${BASE_URL}${USER_API.REFRESH_TOKEN}`, 
          { refreshToken }
        );
        
        console.log('📱 Refresh token response:', response.data);
        
        // Check for token with different possible property names
        const responseData = response.data;
        const newToken = responseData.token || responseData.accessToken;
        const newRefreshToken = responseData.refreshToken || responseData.refeshToken || refreshToken;
        
        if (newToken) {
          // Save new tokens
          await saveTokens(newToken, newRefreshToken);
          
          // Update Authorization header and retry request
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // Handle authentication error
        await handleAuthError();
        
        // Return custom error for auth failure
        return Promise.reject({
          message: API_ERRORS.UNAUTHORIZED,
          logout: true,
        });
      }
    }
    
    // Process error with our error handler
    const processedError = handleApiError(error);
    
    // If it's an auth error that requires logout, handle it
    if (processedError.logout) {
      await handleAuthError();
    }
    
    // For network errors, show a message to the user
    if (!error.response || error.message === 'Network Error') {
      showErrorMessage('Network connection error. Please check your internet connection.');
    }
    
    return Promise.reject(processedError);
  }
);

// Create a wrapper for API calls with network check and error handling
export const apiCall = async <T>(apiFunction: () => Promise<T>): Promise<T> => {
  try {
    // Check network connectivity first
    const isConnected = await isNetworkConnected();
    if (!isConnected) {
      showErrorMessage('No internet connection. Please check your network settings and try again.');
      throw {
        message: 'No internet connection',
        type: 'NETWORK_ERROR'
      };
    }
    
    // Execute the API call
    return await apiFunction();
  } catch (error) {
    // Log the error
    console.error('API Call Error:', error);
    
    // Handle and standardize the error
    const processedError = handleApiError(error);
    
    // If it's an auth error that requires logout, handle it
    if (processedError.logout) {
      await handleAuthError();
    }
    
    // Rethrow the processed error
    throw processedError;
  }
};

export default axiosClient;