import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Alert,
  InteractionManager
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RootState } from '../redux/reducers';
import { logoutUserRequest } from '../redux/actions/UserAction';
import { disconnectSocket } from '../utils/Socket';

type ProfileScreenProps = {
  navigation: any;
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const dispatch = useDispatch();
  const { userCurrent } = useSelector((state: RootState) => state.user);
  
  // Xử lý đăng xuất
  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Tạo CancelToken để hủy tất cả requests đang chờ xử lý
              const CancelToken = axios.CancelToken;
              const source = CancelToken.source();
              axios.defaults.cancelToken = source.token;
              
              // Hủy tất cả pending requests
              source.cancel('User logged out');
              
              // Ngắt kết nối socket trước
              disconnectSocket();
              
              // Clear all AsyncStorage
              await AsyncStorage.clear();
              
              // Clear in-memory cache và state
              if (global.gc) {
                try {
                  global.gc();
                } catch (e) {
                  console.log('Could not force garbage collection');
                }
              }
              
              // Đảm bảo hoàn thành tất cả hoạt động UI trước khi tiếp tục
              InteractionManager.runAfterInteractions(() => {
                // Dispatch action đăng xuất
                dispatch(logoutUserRequest());
                
                // Reset navigation (nếu cần thiết)
                // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                
                // Thông báo logout thành công
                console.log('Đăng xuất thành công, đã xóa tất cả cache và hủy tác vụ đang chờ');
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ sơ</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        {/* Avatar và thông tin cơ bản */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={
                userCurrent && userCurrent.avatar 
                  ? { uri: userCurrent.avatar }
                  : require('../assets/avatar.jpg')
              }
              style={styles.avatar}
            />
          </View>
          
          <Text style={styles.userName}>
            {userCurrent ? userCurrent.name : 'Người dùng'}
          </Text>
          <Text style={styles.userPhone}>
            {userCurrent ? userCurrent.phone : ''}
          </Text>
        </View>
        
        {/* Menu options */}
        <View style={styles.menuSection}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="person-outline" size={22} color="#333" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Chỉnh sửa ảnh đại diện</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={22} color="#333" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Thông báo</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="lock-closed-outline" size={22} color="#333" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Bảo mật & Quyền riêng tư</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#333" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Trò chuyện</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={22} color="#333" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Trợ giúp & Hỗ trợ</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={22} color="#333" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Về ứng dụng</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
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
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 14,
    color: '#777',
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 20,
  },
});

export default ProfileScreen;