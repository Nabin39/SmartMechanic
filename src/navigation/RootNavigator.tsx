import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MainTabsNavigator from './MainTabsNavigator';
import MapScreen from '../screens/MapScreen';
import MechanicDetailsScreen from '../screens/MechanicDetailsScreen';
import CreateBookingScreen from '../screens/CreateBookingScreen';
import BookingDetailsScreen from '../screens/BookingDetailsScreen';
import UploadPhotoScreen from '../screens/UploadPhotoScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import { colors } from '../utils/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log in' }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign up' }} />
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Map' }} />
      <Stack.Screen name="MechanicDetails" component={MechanicDetailsScreen} options={{ title: 'Mechanic' }} />
      <Stack.Screen name="CreateBooking" component={CreateBookingScreen} options={{ title: 'New booking' }} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ title: 'Booking' }} />
      <Stack.Screen name="UploadPhoto" component={UploadPhotoScreen} options={{ title: 'Photo' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin' }} />
    </Stack.Navigator>
  );
}
