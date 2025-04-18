import { Platform } from 'react-native';
import { API_ENV, CURRENT_ENV } from '../constants/ApiConstant';

/**
 * API configuration
 * Provides environment-specific configuration and utilities for API services
 */

// Current environment type
export type Environment = 'DEV' | 'STAGING' | 'PRODUCTION';

// Return current environment
export const getCurrentEnvironment = (): Environment => {
  return CURRENT_ENV as Environment;
};

// Get base URL for current environment
export const getBaseUrl = (): string => {
  return API_ENV[getCurrentEnvironment()];
};

// API connection timeout (in milliseconds)
export const API_TIMEOUT = 15000;

// Helper to check if running in development
export const isDevelopment = (): boolean => {
  return __DEV__ || getCurrentEnvironment() === 'DEV';
};

// Helper to check if running in production
export const isProduction = (): boolean => {
  return getCurrentEnvironment() === 'PRODUCTION';
};

// Logger for API events
export const ApiLogger = {
  // Log API request
  logRequest: (method: string, url: string, data?: any, params?: any): void => {
    if (isDevelopment()) {
      console.log(`🚀 API Request: ${method} ${url}`);
      if (params) console.log('📝 Params:', params);
      if (data) console.log('📦 Data:', data);
    }
  },

  // Log API response
  logResponse: (method: string, url: string, status: number, data?: any): void => {
    if (isDevelopment()) {
      console.log(`✅ API Response: ${method} ${url}`);
      console.log('📊 Status:', status);
      if (data) console.log('📄 Data:', data);
    }
  },

  // Log API error
  logError: (method: string, url: string, error: any): void => {
    // Always log errors (but with different detail levels based on environment)
    console.error(`❌ API Error: ${method} ${url}`);
    
    if (isDevelopment()) {
      // Detailed error logging in development
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      console.error('Full error:', error);
    } else {
      // Limited error logging in production
      console.error('Status:', error.response?.status || 'Unknown');
      console.error('Message:', error.message || 'Unknown error');
    }
  }
};

// Device info for request headers
export const deviceInfo = {
  platform: Platform.OS,
  version: Platform.Version,
  appVersion: '1.0.0', // Should be updated to match app version
};

export default {
  getCurrentEnvironment,
  getBaseUrl,
  API_TIMEOUT,
  isDevelopment,
  isProduction,
  ApiLogger,
  deviceInfo
}; 