import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useDispatch } from 'react-redux';
import { setPhoneVerified, setLoading, loginSuccess } from '../../store/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

type PhoneVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'PhoneVerification'>;
type PhoneVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'PhoneVerification'>;

interface Props {
  navigation: PhoneVerificationScreenNavigationProp;
  route: PhoneVerificationScreenRouteProp;
}

export default function PhoneVerificationScreen({ navigation, route }: Props) {
  const dispatch = useDispatch();
  const { phoneNumber } = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoadingState] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '')) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (verificationCode: string) => {
    setIsLoadingState(true);
    dispatch(setLoading(true));

    try {
      // Mock verification - replace with actual API call
      if (verificationCode === '123456') {
        dispatch(setPhoneVerified(true));
        
        // Check if user exists or is new
        const isExistingUser = Math.random() > 0.5; // Mock check
        
        if (isExistingUser) {
          // Existing user - log them in
          dispatch(loginSuccess({
            token: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token'
          }));
        } else {
          // New user - continue to account setup
          navigation.navigate('AccountType');
        }
      } else {
        Alert.alert('Error', 'Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      Alert.alert('Error', 'Verification failed. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoadingState(true);
    
    try {
      // Mock resend - replace with actual API call
      setTimeout(() => {
        setTimeLeft(60);
        setCanResend(false);
        setIsLoadingState(false);
        Alert.alert('Success', 'Verification code sent!');
      }, 1000);
    } catch (error) {
      setIsLoadingState(false);
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      const number = cleaned.slice(1);
      return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    }
    return phone;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Verify Phone Number</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.phoneNumber}>{formatPhoneNumber(phoneNumber)}</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => inputRefs.current[index] = ref!}
                style={[
                  styles.codeInput,
                  digit && styles.codeInputFilled,
                  isLoading && styles.disabledInput
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                autoFocus={index === 0}
                editable={!isLoading}
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendCode}
                disabled={isLoading}
              >
                <Text style={styles.resendButtonText}>Resend Code</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                Resend code in {timeLeft}s
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.changeNumberButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.changeNumberText}>
              Wrong number? Change it
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.helpText}>
            For testing, use code: <Text style={styles.testCode}>123456</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
  },
  phoneNumber: {
    fontWeight: '600',
    color: '#00BCD4',
  },
  form: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    width: '100%',
    maxWidth: 300,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#F8F9FA',
  },
  codeInputFilled: {
    borderColor: '#00BCD4',
    backgroundColor: '#E0F7FA',
  },
  disabledInput: {
    opacity: 0.6,
  },
  resendContainer: {
    marginBottom: 30,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  resendButtonText: {
    fontSize: 16,
    color: '#00BCD4',
    fontWeight: '600',
  },
  timerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  changeNumberButton: {
    paddingVertical: 12,
  },
  changeNumberText: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  testCode: {
    fontWeight: 'bold',
    color: '#00BCD4',
  },
});