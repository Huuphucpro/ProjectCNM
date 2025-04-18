import { Platform } from 'react-native';
import { API_URL, SOCKET_URL, ENABLE_LOGS, ENABLE_ANALYTICS, APP_ENV } from '@env';

// Environment types
export type Environment = 'development' | 'staging' | 'production';

// App environment
export const appEnvironment = APP_ENV as Environment || 'development';

// API configuration
export const apiUrl = API_URL || 'http://localhost:4000';
export const socketUrl = SOCKET_URL || 'http://localhost:4000';

// Feature flags
export const enableLogs = ENABLE_LOGS === 'true' || false;
export const enableAnalytics = ENABLE_ANALYTICS === 'true' || false;

// Helper functions
export const isDevelopment = (): boolean => {
  return appEnvironment === 'development' || __DEV__;
};

export const isProduction = (): boolean => {
  return appEnvironment === 'production';
};

export const isStaging = (): boolean => {
  return appEnvironment === 'staging';
};

// Device info
export const deviceInfo = {
  platform: Platform.OS,
  version: Platform.Version,
  environment: appEnvironment,
};

// Logger utility that only logs in development mode
export const logger = {
  log: (...args: any[]) => {
    if (enableLogs || isDevelopment()) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (enableLogs || isDevelopment()) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (enableLogs || isDevelopment()) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (enableLogs || isDevelopment()) {
      console.info(...args);
    }
  },
};

export default {
  apiUrl,
  socketUrl,
  appEnvironment,
  enableLogs,
  enableAnalytics,
  isDevelopment,
  isProduction,
  isStaging,
  deviceInfo,
  logger,
}; 