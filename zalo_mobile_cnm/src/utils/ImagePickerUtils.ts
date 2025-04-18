import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { showErrorMessage } from './ErrorHandler';

/**
 * Interface for the image result
 */
export interface ImageResult {
  uri: string;
  type: string;
  name: string;
  width?: number;
  height?: number;
  fileSize?: number;
}

/**
 * Request permission to access the camera or photo library
 * @param cameraType Whether to request camera or photo library permission
 * @returns Boolean indicating if permission was granted
 */
export const requestPermission = async (cameraType: boolean = false): Promise<boolean> => {
  try {
    if (cameraType) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
};

/**
 * Format image data for upload
 * @param uri URI of the image
 * @param width Optional width of the image
 * @param height Optional height of the image
 * @returns Formatted image data
 */
export const formatImageData = (
  uri: string,
  width?: number,
  height?: number,
  fileSize?: number
): ImageResult => {
  // Extract filename from URI
  const filename = uri.split('/').pop() || `image-${Date.now()}.jpg`;
  
  // Determine mime type based on file extension
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';
  
  return {
    uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
    type,
    name: filename,
    width,
    height,
    fileSize
  };
};

/**
 * Open the image picker to select an image from the library
 * @returns The selected image or null if cancelled
 */
export const pickImage = async (): Promise<ImageResult | null> => {
  try {
    const hasPermission = await requestPermission(false);
    
    if (!hasPermission) {
      showErrorMessage('Permission to access media library was denied');
      return null;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: false,
    });
    
    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }
    
    const asset = result.assets[0];
    
    return formatImageData(
      asset.uri,
      asset.width,
      asset.height,
      asset.fileSize
    );
  } catch (error) {
    console.error('Error picking image:', error);
    showErrorMessage('Error selecting image. Please try again.');
    return null;
  }
};

/**
 * Open the camera to take a photo
 * @returns The captured image or null if cancelled
 */
export const takePhoto = async (): Promise<ImageResult | null> => {
  try {
    const hasPermission = await requestPermission(true);
    
    if (!hasPermission) {
      showErrorMessage('Permission to access camera was denied');
      return null;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }
    
    const asset = result.assets[0];
    
    return formatImageData(
      asset.uri,
      asset.width,
      asset.height,
      asset.fileSize
    );
  } catch (error) {
    console.error('Error taking photo:', error);
    showErrorMessage('Error capturing image. Please try again.');
    return null;
  }
};

/**
 * Create a form data object with the image
 * @param image Image result from picker
 * @param fieldName Field name for the form data
 * @returns FormData object with the image
 */
export const createImageFormData = (
  image: ImageResult,
  fieldName: string = 'image'
): FormData => {
  const formData = new FormData();
  
  // @ts-ignore - FormData in React Native works differently than regular FormData
  formData.append(fieldName, {
    uri: image.uri,
    type: image.type,
    name: image.name,
  });
  
  return formData;
};

export default {
  pickImage,
  takePhoto,
  formatImageData,
  createImageFormData,
  requestPermission,
}; 