import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { register } from '../redux/actions/UserActions';
import { RootState } from '../redux/reducers';

type RegisterScreenProps = {
  navigation: any;
};

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.user);

  // Hiển thị lỗi nếu có
  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi đăng ký', error.error || 'Đã có lỗi xảy ra khi đăng ký.');
    }
  }, [error]);
  
  // Xử lý khi đăng ký thành công
  const [registered, setRegistered] = useState(false);
  
  useEffect(() => {
    if (registered && !isLoading && !error) {
      Alert.alert(
        'Đăng ký thành công',
        'Bạn đã đăng ký thành công tài khoản Chat!',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    }
  }, [registered, isLoading, error, navigation]);

  const validatePhone = (phone: string) => {
    // Kiểm tra số điện thoại
    const phoneRegex = /^(84|0[3|5|7|8|9])+([0-9]{8})\b$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string) => {
    // Kiểm tra email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Mật khẩu phải có ít nhất 8 ký tự
    return password.length >= 8;
  };

  const handleRegister = () => {
    // Kiểm tra nhập liệu
    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin, bao gồm cả số điện thoại và email.');
      return;
    }

    // Validate số điện thoại
    if (!validatePhone(phone)) {
      Alert.alert('Thông báo', 'Số điện thoại không hợp lệ.');
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      Alert.alert('Thông báo', 'Email không hợp lệ.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Thông báo', 'Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Thông báo', 'Mật khẩu xác nhận không khớp.');
      return;
    }

    // Gửi yêu cầu đăng ký
    console.log('Sending register request with data:', {
      fullName: name,
      email: email,
      phone: phone,
      password: password,
      confirmPassword: confirmPassword
    });

    dispatch(register({
      fullName: name,
      email: email,
      phone: phone,
      password: password,
      confirmPassword: confirmPassword
    }));
    setRegistered(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Đăng ký tài khoản</Text>
          </View>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/logochat.jpeg')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                value={name}
                onChangeText={setName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu (ít nhất 8 ký tự)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)} 
                style={styles.passwordToggle}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#777" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
                style={styles.passwordToggle}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#777" 
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.registerButtonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 10,
  },
  contactToggle: {
    padding: 5,
  },
  contactToggleText: {
    color: '#2483ff',
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#2483ff',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#777',
  },
  loginLink: {
    color: '#2483ff',
    fontWeight: '500',
  },
});

export default RegisterScreen;