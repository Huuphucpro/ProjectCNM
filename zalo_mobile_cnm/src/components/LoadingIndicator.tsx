import React from 'react';
import { 
  View, 
  ActivityIndicator, 
  StyleSheet, 
  Text,
  ViewStyle,
  TextStyle,
  Modal
} from 'react-native';

interface LoadingIndicatorProps {
  loading?: boolean;
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
  fullscreen?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  loading = true,
  size = 'large',
  color = '#2483ff',
  message,
  overlay = false,
  fullscreen = false,
  style,
  textStyle
}) => {
  // If not loading, don't render anything
  if (!loading) return null;

  // Content to display
  const content = (
    <View style={[
      styles.container,
      overlay && styles.overlay,
      fullscreen && styles.fullscreen,
      style
    ]}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={size} color={color} />
        {message && (
          <Text style={[styles.message, textStyle]}>
            {message}
          </Text>
        )}
      </View>
    </View>
  );

  // If overlay, render in a modal
  if (overlay) {
    return (
      <Modal
        transparent
        animationType="fade"
        visible={loading}
      >
        {content}
      </Modal>
    );
  }

  // Regular non-modal loading indicator
  return content;
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  fullscreen: {
    flex: 1,
  },
  loaderContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  }
});

export default LoadingIndicator; 