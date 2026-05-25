import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Map: { focusMechanicId?: string } | undefined;
  MechanicDetails: { mechanicId: string };
  CreateBooking: { mechanicId: string; mechanicName?: string };
  BookingDetails: { bookingId: string };
  UploadPhoto: { bookingId: string };
  Settings: undefined;
  AdminDashboard: undefined;
};

export type MainTabParamList = {
  Home: { bookingSuccess?: boolean; message?: string } | undefined;
  Find: undefined;
  Bookings: undefined;
  Notifications: undefined;
  Profile: undefined;
};
