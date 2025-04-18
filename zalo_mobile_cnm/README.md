# Zalo Mobile CNM

A React Native mobile application for real-time messaging, built with Expo.

## Features

- User authentication
- Real-time messaging
- Image sharing
- Push notifications
- Online status indicators
- Message history

## Environment Setup

The application uses different environment configurations:

- `.env.development`: Local development configuration
- `.env.staging`: Testing environment configuration
- `.env.production`: Production environment configuration

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Development

To run the app in development mode:

```bash
npm run android
# or
npm run ios
```

## Deployment

The app uses EAS (Expo Application Services) for building and deploying:

### Development Build

```bash
eas build --profile development --platform ios
# or
eas build --profile development --platform android
```

### Preview/Staging Build

```bash
eas build --profile preview --platform ios
# or
eas build --profile preview --platform android
```

### Production Build

```bash
eas build --profile production --platform ios
# or
eas build --profile production --platform android
```

### Submitting to Stores

```bash
eas submit --platform ios
# or
eas submit --platform android
```

## Project Structure

- `/src`: Source code
  - `/api`: API integration
  - `/components`: Reusable UI components
  - `/constants`: App constants
  - `/contexts`: React contexts
  - `/navigation`: Navigation setup
  - `/redux`: State management
  - `/screens`: App screens
  - `/services`: Service modules
  - `/types`: TypeScript types
  - `/utils`: Utility functions

## Environment Variables

The following environment variables are required:

- `API_URL`: Backend API URL
- `SOCKET_URL`: WebSocket server URL
- `ENABLE_LOGS`: Enable/disable logging
- `ENABLE_ANALYTICS`: Enable/disable analytics
- `APP_ENV`: Application environment

## Dependencies

- React Native
- Expo
- Redux
- Socket.IO
- React Navigation 