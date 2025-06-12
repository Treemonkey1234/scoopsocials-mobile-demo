import axios from 'axios';

const API_BASE_URL = 'https://api.scoopsocials.com'; // Replace with actual API URL

export interface LoginRequest {
  phoneNumber: string;
  verificationCode: string;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  accountType: 'free' | 'professional';
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    accountType: 'free' | 'professional';
  };
  message?: string;
}

class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Sending verification code to:', phoneNumber);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Verification code sent successfully'
      };
    } catch (error) {
      console.error('Send verification code error:', error);
      return {
        success: false,
        message: 'Failed to send verification code'
      };
    }
  }

  async verifyPhoneNumber(phoneNumber: string, code: string): Promise<AuthResponse> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Verifying phone number:', phoneNumber, 'with code:', code);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success for code 123456
      if (code === '123456') {
        return {
          success: true,
          message: 'Phone number verified successfully'
        };
      } else {
        return {
          success: false,
          message: 'Invalid verification code'
        };
      }
    } catch (error) {
      console.error('Verify phone number error:', error);
      return {
        success: false,
        message: 'Verification failed'
      };
    }
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Login request:', request);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock existing user
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: {
          id: 'user123',
          phoneNumber: request.phoneNumber,
          firstName: 'Nick',
          lastName: 'Hemingway',
          isVerified: true,
          accountType: 'professional'
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed'
      };
    }
  }

  async signup(request: SignupRequest): Promise<AuthResponse> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Signup request:', request);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        user: {
          id: 'user' + Date.now(),
          phoneNumber: request.phoneNumber,
          firstName: request.firstName,
          lastName: request.lastName,
          isVerified: true,
          accountType: request.accountType
        }
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Account creation failed'
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Refreshing token:', refreshToken);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        token: 'mock-jwt-token-refreshed-' + Date.now(),
        refreshToken: 'mock-refresh-token-refreshed-' + Date.now()
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: 'Token refresh failed'
      };
    }
  }

  async logout(): Promise<{ success: boolean }> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Logging out user');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }
}

export default new AuthService();