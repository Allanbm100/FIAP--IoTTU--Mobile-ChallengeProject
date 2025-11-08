import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import MainTabs from './src/components/MainTabs';
import './src/i18n';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AntennaFormScreen from './src/screens/AntennaFormScreen';
import MotorcycleFormScreen from './src/screens/MotorcycleFormScreen';
import YardFormScreen from './src/screens/YardFormScreen';
import TagFormScreen from './src/screens/TagFormScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

function Navigation() {
  const { signed, loading } = useAuth();
  const { colors, isDark } = useTheme();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.BACKGROUND }]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
      </View>
    );
  }

  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.PRIMARY,
      background: colors.BACKGROUND,
      card: colors.CONTAINER_BG,
      text: colors.TEXT_PRIMARY,
      border: colors.BORDER,
      notification: colors.PRIMARY,
    },
  } as typeof baseTheme;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        {signed ? (
          <>
            <Stack.Screen
              name='MainTabs'
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='AntennaFormScreen'
              component={AntennaFormScreen}
              options={({ route }: any) => ({
                title: route?.params?.antena ? 'Editar Antena' : 'Nova Antena',
                headerStyle: { backgroundColor: colors.BACKGROUND },
                headerTintColor: colors.TEXT_PRIMARY,
                headerTitleStyle: { color: colors.TEXT_PRIMARY }
              })}
            />
            <Stack.Screen
              name='MotorcycleFormScreen'
              component={MotorcycleFormScreen}
              options={({ route }: any) => ({
                title: route?.params?.moto ? 'Editar Moto' : 'Nova Moto',
                headerStyle: { backgroundColor: colors.BACKGROUND },
                headerTintColor: colors.TEXT_PRIMARY,
                headerTitleStyle: { color: colors.TEXT_PRIMARY }
              })}
            />
            <Stack.Screen
              name='YardFormScreen'
              component={YardFormScreen}
              options={({ route }: any) => ({
                title: route?.params?.patio ? 'Editar Pátio' : 'Novo Pátio',
                headerStyle: { backgroundColor: colors.BACKGROUND },
                headerTintColor: colors.TEXT_PRIMARY,
                headerTitleStyle: { color: colors.TEXT_PRIMARY }
              })}
            />
            <Stack.Screen
              name='TagFormScreen'
              component={TagFormScreen}
              options={({ route }: any) => ({
                title: route?.params?.tag ? 'Editar Tag' : 'Nova Tag',
                headerStyle: { backgroundColor: colors.BACKGROUND },
                headerTintColor: colors.TEXT_PRIMARY,
                headerTitleStyle: { color: colors.TEXT_PRIMARY }
              })}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name='Login'
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Register'
              component={RegisterScreen}
              options={{ 
                title: 'Criar Conta',
                headerStyle: { backgroundColor: colors.BACKGROUND },
                headerTintColor: colors.TEXT_PRIMARY,
                headerTitleStyle: { color: colors.TEXT_PRIMARY }
              }}
            />
          </>
        )}
      </Stack.Navigator>
      <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.BACKGROUND} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <Navigation />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
