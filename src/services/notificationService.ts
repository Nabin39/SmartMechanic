import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { BookingStatus } from '../firebase/types';
import { getBookingStatusLabel } from '../utils/bookingStatus';

/**
 * Local notifications for confirmations and status updates.
 * Remote FCM: register for push token with `Notifications.getExpoPushTokenAsync`
 * after configuring `projectId` in app.json — store token in Firestore `users/{uid}/pushTokens`.
 */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('bookings', {
      name: 'Bookings',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
    });
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

export async function notifyBookingConfirmed(bookingId: string, mechanicName: string) {
  await ensureNotificationChannel();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Booking submitted',
      body: `Your request with ${mechanicName} is pending confirmation.`,
      data: { bookingId, type: 'booking_created' },
    },
    trigger: null,
  });
}

export async function notifyBookingStatusChange(bookingId: string, status: BookingStatus) {
  await ensureNotificationChannel();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Booking update',
      body: `Status: ${getBookingStatusLabel(status)}`,
      data: { bookingId, type: 'status', status },
    },
    trigger: null,
  });
}
