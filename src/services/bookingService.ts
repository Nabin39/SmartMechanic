import type { Booking, BookingStatus } from '../firebase/types';
import {
  attachPhotoPaths,
  createBookingDoc,
  fetchBookingById,
  fetchBookingsForUser,
  updateBookingStatus,
} from './firestoreService';
import { upsertCachedBooking, markBookingSynced } from '../database/sqliteService';
import { notifyBookingConfirmed, notifyBookingStatusChange } from './notificationService';
import { uploadBookingPhotoPlaceholder } from './storageService';

function newBookingId(): string {
  return `bk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export interface CreateBookingPayload {
  userId: string;
  userName: string;
  mechanicId: string;
  mechanicName: string;
  vehicleType: string;
  vehicleModel: string;
  issueDescription: string;
  serviceType: string;
  bookingDate: string;
  localPhotoUri?: string;
}

/**
 * Parallel programming: after the booking document is prepared we run
 * (1) Firestore write and (2) SQLite upsert concurrently via `Promise.all`
 * so network I/O and local disk I/O overlap — reduces perceived save time.
 */
export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const now = new Date().toISOString();
  const bookingId = newBookingId();
  const booking: Booking = {
    bookingId,
    userId: payload.userId,
    mechanicId: payload.mechanicId,
    vehicleType: payload.vehicleType,
    vehicleModel: payload.vehicleModel,
    issueDescription: payload.issueDescription,
    serviceType: payload.serviceType,
    bookingDate: payload.bookingDate,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    mechanicName: payload.mechanicName,
  };

  await Promise.all([
    createBookingDoc(booking),
    upsertCachedBooking({
      bookingId,
      mechanicName: payload.mechanicName,
      serviceType: payload.serviceType,
      status: 'pending',
      bookingDate: payload.bookingDate,
      synced: 1,
    }),
  ]);

  await markBookingSynced(bookingId, 1);
  await notifyBookingConfirmed(bookingId, payload.mechanicName);

  /**
   * Parallel programming: persist local photo path to Firestore while the Storage
   * placeholder runs concurrently — overlaps network calls / async work.
   */
  if (payload.localPhotoUri) {
    const [, upload] = await Promise.all([
      attachPhotoPaths(bookingId, payload.localPhotoUri),
      uploadBookingPhotoPlaceholder(payload.localPhotoUri, bookingId),
    ]);
    if (upload.remoteUrl) {
      await attachPhotoPaths(bookingId, payload.localPhotoUri, upload.remoteUrl);
    }
    return { ...booking, photoPath: payload.localPhotoUri, ...(upload.remoteUrl ? { photoUrl: upload.remoteUrl } : {}) };
  }

  return booking;
}

export async function changeBookingStatus(bookingId: string, status: BookingStatus) {
  await updateBookingStatus(bookingId, status);
  const b = await fetchBookingById(bookingId);
  if (b) {
    await upsertCachedBooking({
      bookingId: b.bookingId,
      mechanicName: b.mechanicName ?? 'Mechanic',
      serviceType: b.serviceType,
      status: b.status,
      bookingDate: b.bookingDate,
      synced: 1,
    });
  }
  await notifyBookingStatusChange(bookingId, status);
}

/**
 * Parallel fetch: loads remote bookings and SQLite cache together for fast UI merge.
 */
export async function loadBookingsHybrid(userId: string): Promise<{
  remote: Booking[];
  localRows: Awaited<ReturnType<typeof import('../database/sqliteService').getAllCachedBookings>>;
}> {
  const { getAllCachedBookings } = await import('../database/sqliteService');
  const [remote, localRows] = await Promise.all([
    fetchBookingsForUser(userId),
    getAllCachedBookings(),
  ]);
  return { remote, localRows };
}
