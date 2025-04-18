import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootStackNavigationProp, RootStackRouteProp } from '../types/navigation';
import { requestPasswordReset, verifyOTP, resetPassword } from '../redux/actions/UserActions';

const NewPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation<RootStackNavigationProp<'NewPassword'>>();
  const route = useRoute<RootStackRouteProp<'NewPassword'>>();
  const dispatch = useDispatch();
  
  const { email, otp } = route.params;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = () => {
    // Validate passwords
    if (!password) {
      Alert.alert('Thông báo', 'Vui lòng nhập mật khẩu mới');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Thông báo', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Thông báo', 'Mật khẩu xác nhận không khớp');
      return;
    }
    
    setIsLoading(true);
    
    // Dispatch action to reset password
    dispatch(resetPassword(email, otp, password, 
      () => {
        setIsLoading(false);
        Alert.alert(
          'Thành công', 
          'Mật khẩu đã được cập nhật thành công.', 
          [
            { 
              text: 'Đăng nhập ngay', 
              onPress: () => navigation.navigate('Login') 
            }
          ]
        );
      },
      (error) => {
        setIsLoading(false);
        Alert.alert('Lỗi', error || 'Không thể cập nhật mật khẩu');
      }
    ));
    
    // Placeholder for now
    // setTimeout(() => {
    //   setIsLoading(false);
    //   Alert.alert(
    //     'Thành công', 
    //     'Mật khẩu đã được cập nhật thành công.', 
    //     [
    //       { 
    //         text: 'Đăng nhập ngay', 
    //         onPress: () => navigation.navigate('Login') 
    //       }
    //     ]
    //   );
    // }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2483ff" />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Text style={styles.title}>Đặt mật khẩu mới</Text>
          <Text style={styles.subtitle}>
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn
          </Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mật khẩu mới</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu mới"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                style={styles.visibilityToggle}
                onPress={togglePasswordVisibility}
              >
                <Ionicons 
                  name={passwordVisible ? 'eye-off' : 'eye'} 
                  size={22} 
                  color="#777" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry={!confirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.visibilityToggle}
                onPress={toggleConfirmPasswordVisibility}
              >
                <Ionicons 
                  name={confirmPasswordVisible ? 'eye-off' : 'eye'} 
                  size={22} 
                  color="#777" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, isLoading ? styles.buttonDisabled : null]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2483ff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  formGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  visibilityToggle: {
    padding: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2483ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#94c1ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewPasswordScreen; 