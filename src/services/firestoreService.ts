import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirebase } from '../firebase/config';
import type { AppUser, Booking, BookingStatus, Mechanic } from '../firebase/types';

const USERS = 'users';
const MECHANICS = 'mechanics';
const BOOKINGS = 'bookings';

function requireDb() {
  const fb = getFirebase();
  if (!fb) throw new Error('Firebase is not configured. Add keys to .env per README.');
  return fb.db;
}

export async function upsertUserProfile(user: AppUser): Promise<void> {
  const db = requireDb();
  await setDoc(
    doc(db, USERS, user.uid),
    {
      uid: user.uid,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone ?? '',
      createdAt: user.createdAt ?? new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const db = requireDb();
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  const d = snap.data() as Record<string, unknown>;
  return {
    uid: String(d.uid ?? uid),
    name: String(d.name ?? ''),
    email: String(d.email ?? ''),
    role: (d.role === 'mechanic' ? 'mechanic' : 'customer') as AppUser['role'],
    phone: d.phone ? String(d.phone) : undefined,
    createdAt: d.createdAt ? String(d.createdAt) : undefined,
  };
}

export async function fetchMechanics(): Promise<Mechanic[]> {
  const db = requireDb();
  const snap = await getDocs(collection(db, MECHANICS));
  return snap.docs.map((d) => d.data() as Mechanic);
}

export async function fetchMechanicById(mechanicId: string): Promise<Mechanic | null> {
  const db = requireDb();
  const snap = await getDoc(doc(db, MECHANICS, mechanicId));
  if (!snap.exists()) return null;
  return snap.data() as Mechanic;
}

function bookingFromDoc(id: string, data: Record<string, unknown>): Booking {
  return {
    bookingId: id,
    userId: String(data.userId ?? ''),
    mechanicId: String(data.mechanicId ?? ''),
    vehicleType: String(data.vehicleType ?? ''),
    vehicleModel: String(data.vehicleModel ?? ''),
    issueDescription: String(data.issueDescription ?? ''),
    photoUrl: data.photoUrl ? String(data.photoUrl) : undefined,
    photoPath: data.photoPath ? String(data.photoPath) : undefined,
    serviceType: String(data.serviceType ?? ''),
    bookingDate: String(data.bookingDate ?? ''),
    status: (String(data.status ?? 'pending') as BookingStatus) || 'pending',
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : String(data.createdAt ?? ''),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : String(data.updatedAt ?? ''),
    mechanicName: data.mechanicName ? String(data.mechanicName) : undefined,
  };
}

export async function fetchBookingById(bookingId: string): Promise<Booking | null> {
  const db = requireDb();
  const snap = await getDoc(doc(db, BOOKINGS, bookingId));
  if (!snap.exists()) return null;
  return bookingFromDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function createBookingDoc(booking: Booking): Promise<void> {
  const db = requireDb();
  const ref = doc(db, BOOKINGS, booking.bookingId);
  await setDoc(ref, {
    ...booking,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, BOOKINGS, bookingId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function attachPhotoPaths(
  bookingId: string,
  photoPath?: string,
  photoUrl?: string
): Promise<void> {
  const db = requireDb();
  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (photoPath) updates.photoPath = photoPath;
  if (photoUrl) updates.photoUrl = photoUrl;
  await updateDoc(doc(db, BOOKINGS, bookingId), updates);
}

export async function fetchBookingsForUser(userId: string): Promise<Booking[]> {
  const db = requireDb();
  const q = query(collection(db, BOOKINGS), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => bookingFromDoc(d.id, d.data() as Record<string, unknown>));
}

export async function fetchBookingsForMechanic(mechanicId: string): Promise<Booking[]> {
  const db = requireDb();
  const q = query(collection(db, BOOKINGS), where('mechanicId', '==', mechanicId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => bookingFromDoc(d.id, d.data() as Record<string, unknown>));
}

export async function fetchAllBookingsDemo(): Promise<Booking[]> {
  const db = requireDb();
  const snap = await getDocs(collection(db, BOOKINGS));
  return snap.docs.map((d) => bookingFromDoc(d.id, d.data() as Record<string, unknown>));
}
