import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { RootState } from '../redux/reducers';
import { updateProfile } from '../redux/actions/UserActions';

type EditProfileScreenProps = {
  navigation: any;
};

const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const dispatch = useDispatch();
  const { userCurrent, isLoading } = useSelector((state: RootState) => state.user);
  
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (userCurrent) {
      if (userCurrent.avatar) {
        // Set avatar from user profile if available
        setImage(userCurrent.avatar);
      }
      
      console.log('📱 Loaded user profile:', {
        id: userCurrent._id,
        name: userCurrent.name,
        avatar: userCurrent.avatar ? 'Has avatar' : 'No avatar'
      });
    }
  }, [userCurrent]);
  
  const handleSelectImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Cần quyền truy cập thư viện ảnh để thay đổi ảnh đại diện.');
        return;
      }
      
      // Launch image picker with non-deprecated API
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại sau.');
    }
  };
  
  const handleSave = async () => {
    if (!userCurrent || !userCurrent._id) {
      Alert.alert('Lỗi', 'Không thể xác định người dùng. Vui lòng đăng nhập lại.');
      return;
    }
    
    // If no image has been selected or changed, don't proceed
    if (!image || image === userCurrent.avatar) {
      Alert.alert('Thông báo', 'Bạn chưa thay đổi ảnh đại diện.');
      return;
    }
    
    try {
      // Show loading indicator
      setUploading(true);
      
      // Create image file object for upload
      const imageFile = {
        uri: image,
        type: 'image/jpeg',
        name: `profile_${userCurrent._id}_${Date.now()}.jpg`
      } as any;
      
      // Create FormData for avatar upload only
      const formData = new FormData();
      formData.append('avatar', imageFile);
      // Even though we're only changing avatar, send the current name to avoid it being cleared
      formData.append('name', userCurrent.name || '');
      
      console.log('📱 Updating avatar for user:', userCurrent._id);
      
      // Dispatch update profile action with user ID for avatar update
      dispatch(updateProfile({
        id: userCurrent._id,
        data: formData
      }));
      
      // Hide loading indicator after a small delay
      setTimeout(() => {
        setUploading(false);
        // Navigate back 
        navigation.goBack();
      }, 1000);
    } catch (error) {
      // Hide loading indicator on error
      setUploading(false);
      console.error('Error updating avatar:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cập nhật ảnh đại diện</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading || uploading || !image || image === userCurrent?.avatar}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={
                image 
                  ? { uri: image }
                  : userCurrent?.avatar 
                    ? { uri: userCurrent.avatar }
                    : require('../assets/avatar.jpg')
              }
              style={styles.avatar}
            />
            {uploading ? (
              <View style={styles.avatarLoading}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.editAvatarButton}
                onPress={handleSelectImage}
              >
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.avatarHelp}>
            Nhấn vào biểu tượng camera để thay đổi ảnh đại diện
          </Text>
        </View>
        
        <View style={styles.userInfoSection}>
          <Text style={styles.userName}>{userCurrent?.name || 'User'}</Text>
          <Text style={styles.userPhone}>{userCurrent?.phone || ''}</Text>
        </View>
        
        <Text style={styles.disclaimer}>
          Lưu ý: Chỉ có thể thay đổi ảnh đại diện ở đây. Việc thay đổi thông tin khác không được hỗ trợ.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2483ff',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarLoading: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2483ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarHelp: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
  },
  userInfoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 16,
    color: '#666',
  },
  disclaimer: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default EditProfileScreen; 