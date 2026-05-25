import 'react-native-gesture-handler';
import './src/services/backgroundSyncService';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { BookingToastProvider } from './src/context/BookingToastContext';
import { navigationRef } from './src/navigation/navigationRef';
import { initFirebase, isFirebaseConfigured } from './src/firebase/config';
import { registerBackgroundSync } from './src/services/backgroundSyncService';
import { requestNotificationPermissions, ensureNotificationChannel } from './src/services/notificationService';
import { colors } from './src/utils/theme';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    text: colors.text,
    card: colors.surface,
    border: colors.border,
  },
};

export default function App() {
  useEffect(() => {
    if (isFirebaseConfigured()) {
      initFirebase();
    }
    ensureNotificationChannel();
    requestNotificationPermissions().catch(() => undefined);
    registerBackgroundSync().catch(() => undefined);
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BookingToastProvider>
          <NavigationContainer ref={navigationRef} theme={theme}>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>
        </BookingToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
