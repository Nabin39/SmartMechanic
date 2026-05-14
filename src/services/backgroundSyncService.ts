import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { getFirebase } from '../firebase/config';
import { fetchBookingsForUser } from './firestoreService';
import { upsertCachedBooking, getUnsyncedCachedBookings } from '../database/sqliteService';

export const BACKGROUND_SYNC_TASK = 'SMART_MECHANIC_BOOKING_SYNC';

/**
 * Background task (Expo BackgroundFetch — analogous to periodic WorkManager jobs on Android).
 * Battery-aware: minimum interval is kept at 15+ minutes; no continuous GPS — only pulls
 * Firestore booking documents when the OS allows a short background window.
 */
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    const fb = getFirebase();
    if (!fb) return BackgroundFetch.BackgroundFetchResult.NoData;

    const user = fb.auth.currentUser;
    if (!user) return BackgroundFetch.BackgroundFetchResult.NoData;

    const remoteList = await fetchBookingsForUser(user.uid);
    for (const b of remoteList) {
      await upsertCachedBooking({
        bookingId: b.bookingId,
        mechanicName: b.mechanicName ?? 'Mechanic',
        serviceType: b.serviceType,
        status: b.status,
        bookingDate: b.bookingDate,
        synced: 1,
      });
    }

    const unsynced = await getUnsyncedCachedBookings();
    if (unsynced.length) {
      // Placeholder: retry queue upload — could re-call createBookingDoc for failed writes
      console.log('[BackgroundSync] Pending local rows:', unsynced.length);
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (e) {
    console.warn('[BackgroundSync] task error', e);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundSync(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
  if (isRegistered) return;
  await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
    minimumInterval: 15 * 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export async function unregisterBackgroundSync(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
  if (isRegistered) {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
  }
}
