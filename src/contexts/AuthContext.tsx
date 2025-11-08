import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, LoginCredentials, LoginResponse } from '../services/api';
import { Alert } from 'react-native';
import i18n from '../i18n';

interface User {
  id_usuario: number;
  nome_usuario: string;
  email_usuario: string;
  role: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const storedUser = await AsyncStorage.getItem('@iottu:user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }

  async function signIn(credentials: LoginCredentials) {
    try {
      const response: LoginResponse = await apiLogin(credentials);
      
      if (!response || !response.id_usuario || !response.email_usuario || !response.nome_usuario) {
        throw new Error('VALIDATION_ERROR');
      }
      
      const userData: User = {
        id_usuario: response.id_usuario,
        nome_usuario: response.nome_usuario,
        email_usuario: response.email_usuario,
        role: response.role,
      };

      await AsyncStorage.setItem('@iottu:user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      await AsyncStorage.removeItem('@iottu:user');
      setUser(null);
      
      let errorMessage = i18n.t('auth.loginError');
      
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = i18n.t('auth.invalidCredentials');
        } else if (error.response.status === 400) {
          errorMessage = i18n.t('auth.validateEmailError');
        } else if (error.response.data) {
          const data = error.response.data;
          const serverMessage = data.detail || data.message || data.error;
          if (serverMessage && typeof serverMessage === 'string') {
            errorMessage = serverMessage;
          }
        }
      } else if (error.message === 'VALIDATION_ERROR') {
        errorMessage = i18n.t('auth.serverResponseError');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem('@iottu:user');
      setUser(null);
    } catch (error) {
      Alert.alert(i18n.t('common.error'), i18n.t('auth.logoutError'));
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(i18n.t('auth.useAuthError'));
  }

  return context;
}
