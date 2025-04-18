import React, { useState } from 'react';
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
import { login } from '../redux/actions/UserActions';
import { RootState } from '../redux/reducers';
import { RootStackNavigationProp } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';




const LoginScreen = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  
  const dispatch = useDispatch();
  const navigation = useNavigation<RootStackNavigationProp<'Login'>>();
  
  const { isLoading, error } = useSelector((state: RootState) => state.user);

  // Automatically detect if input is an email
  const handleIdentifierChange = (value: string) => {
    setIdentifier(value);
    setIsEmail(value.includes('@'));
  };

  // Hiển thị lỗi nếu có
  React.useEffect(() => {
    if (error) {
      console.log('Login error detected:', error);
      Alert.alert('Lỗi đăng nhập', error.error || 'Đã có lỗi xảy ra khi đăng nhập.');
    }
  }, [error]);

  const handleLogin = () => {
    // Check required fields
    if (!identifier.trim() || !password.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }
    
    // Validate email format if using email
    if (isEmail) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(identifier)) {
        Alert.alert('Thông báo', 'Định dạng email không hợp lệ.');
        return;
      }
    }
    
    // Log attempt
    console.log('Attempting login with:', { phone: identifier, isEmail });
    
    // Dispatch login action
    dispatch(login(identifier, password));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Image 
              source={require('../assets/logochat.jpeg')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
            <Text style={styles.title}>
              Đăng nhập tài khoản
            </Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons 
                name={isEmail ? "mail-outline" : "call-outline"} 
                size={20} 
                color="#777" 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại hoặc email"
                value={identifier}
                onChangeText={handleIdentifierChange}
                keyboardType={isEmail ? "email-address" : "default"}
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
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
            
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Bạn chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Đăng ký</Text>
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
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    lineHeight: 24,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#2483ff',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#2483ff',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#777',
  },
  registerLink: {
    color: '#2483ff',
    fontWeight: '500',
  },
});

export default LoginScreen;