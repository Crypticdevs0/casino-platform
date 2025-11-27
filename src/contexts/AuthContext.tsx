import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';

type User = {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  walletAddress?: string;
  is2FAEnabled: boolean;
  isVerified: boolean;
  kycStatus: 'none' | 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithWallet: (address: string, signature: string) => Promise<void>;
  enable2FA: () => Promise<{ secret: string; qrCodeUrl: string }>;
  verify2FA: (token: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Implement token refresh and validation
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Validate token and get user data
          // const userData = await authService.getMe();
          // setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement login logic
      // const { token, user: userData } = await authService.login(email, password);
      // localStorage.setItem('auth_token', token);
      // setUser(userData);
      // navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; name: string }) => {
    try {
      setIsLoading(true);
      // TODO: Implement registration logic
      // await authService.register(data);
      // await login(data.email, data.password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement logout logic
      // await authService.logout();
      localStorage.removeItem('auth_token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement Google OAuth
      // const { token, user: userData } = await authService.loginWithGoogle();
      // localStorage.setItem('auth_token', token);
      // setUser(userData);
      // navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement Facebook OAuth
      // const { token, user: userData } = await authService.loginWithFacebook();
      // localStorage.setItem('auth_token', token);
      // setUser(userData);
      // navigate('/dashboard');
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithWallet = async (address: string, signature: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement wallet login
      // const { token, user: userData } = await authService.loginWithWallet(address, signature);
      // localStorage.setItem('auth_token', token);
      // setUser(userData);
      // navigate('/dashboard');
    } catch (error) {
      console.error('Wallet login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const enable2FA = async (): Promise<{ secret: string; qrCodeUrl: string }> => {
    try {
      // TODO: Implement 2FA enable
      // return await authService.enable2FA();
      return { secret: '', qrCodeUrl: '' };
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
      throw error;
    }
  };

  const verify2FA = async (token: string) => {
    try {
      // TODO: Implement 2FA verification
      // const result = await authService.verify2FA(token);
      // return result;
      return true;
    } catch (error) {
      console.error('2FA verification failed:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // TODO: Implement password reset
      // await authService.resetPassword(email);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      // TODO: Implement profile update
      // const updatedUser = await authService.updateProfile(data);
      // setUser(prev => (prev ? { ...prev, ...updatedUser } : null));
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    loginWithWallet,
    enable2FA,
    verify2FA,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
