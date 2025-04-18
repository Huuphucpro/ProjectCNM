import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootStackNavigationProp, RootStackRouteProp } from '../types/navigation';

const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const navigation = useNavigation<RootStackNavigationProp<'OTPVerification'>>();
  const route = useRoute<RootStackRouteProp<'OTPVerification'>>();
  const dispatch = useDispatch();
  
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { email } = route.params;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResending]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current is empty
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = () => {
    if (timer > 0) return;
    
    setIsResending(true);
    
    // Dispatch action to resend OTP
    /* 
    dispatch(resendOTP(email, 
      () => {
        setIsResending(false);
        setTimer(60);
        Alert.alert('Thông báo', 'Mã OTP mới đã được gửi');
      },
      (error) => {
        setIsResending(false);
        Alert.alert('Lỗi', error || 'Không thể gửi lại mã OTP');
      }
    ));
    */
    
    // Placeholder for now
    setTimeout(() => {
      setIsResending(false);
      setTimer(60);
      Alert.alert('Thông báo', 'Mã OTP mới đã được gửi');
    }, 1000);
  };

  const handleVerifyOTP = () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      Alert.alert('Thông báo', 'Vui lòng nhập đủ 6 số');
      return;
    }
    
    setIsLoading(true);
    
    // Dispatch action to verify OTP
    /* 
    dispatch(verifyOTP(email, otpCode, 
      () => {
        setIsLoading(false);
        navigation.navigate('NewPassword', { email, otp: otpCode });
      },
      (error) => {
        setIsLoading(false);
        Alert.alert('Lỗi', error || 'Mã OTP không hợp lệ');
      }
    ));
    */
    
    // Placeholder for now
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('NewPassword', { email, otp: otpCode });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2483ff" />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Text style={styles.title}>Xác thực OTP</Text>
          <Text style={styles.subtitle}>
            Chúng tôi đã gửi mã xác thực đến email {email}
          </Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
              />
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.resendContainer}
            onPress={handleResendOTP}
            disabled={timer > 0}
          >
            <Text style={[
              styles.resendText,
              timer > 0 ? styles.resendDisabled : null
            ]}>
              Gửi lại mã OTP {timer > 0 ? `(${timer}s)` : ''}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, isLoading ? styles.buttonDisabled : null]}
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
  },
  resendContainer: {
    marginBottom: 30,
  },
  resendText: {
    color: '#2483ff',
    fontSize: 16,
  },
  resendDisabled: {
    color: '#999',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2483ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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

export default OTPVerificationScreen; 