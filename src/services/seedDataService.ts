/**
 * Seed Data Service
 *
 * Seeds Firestore with demo mechanics, a user profile, and sample bookings
 * after login. Uses fixed document IDs so data is never duplicated.
 */
import { doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { getFirebase } from '../firebase/config';
import type { AppUser, Booking, Mechanic } from '../firebase/types';

const USERS = 'users';
const MECHANICS = 'mechanics';
const BOOKINGS = 'bookings';

/** Coventry-based demo mechanics matching assessment specification. */
const DEMO_MECHANICS: Mechanic[] = [
  {
    mechanicId: 'mechanic_001',
    name: 'City Auto Garage',
    address: 'Coventry City Centre',
    latitude: 52.4068,
    longitude: -1.5197,
    services: ['Oil change', 'Brake repair', 'Engine diagnostics'],
    rating: 4.5,
    phone: '07123456789',
    priceRange: '£80–£350',
  },
  {
    mechanicId: 'mechanic_002',
    name: 'FastFix Motors',
    address: 'Near Coventry University',
    latitude: 52.4075,
    longitude: -1.5030,
    services: ['Tyres', 'Battery', 'MOT check'],
    rating: 4.2,
    phone: '07987654321',
    priceRange: '£60–£280',
  },
  {
    mechanicId: 'mechanic_003',
    name: 'Quick Repair Hub',
    address: 'Earlsdon Coventry',
    latitude: 52.4009,
    longitude: -1.5335,
    services: ['Battery replacement', 'General repair', 'Diagnostics'],
    rating: 4.7,
    phone: '07888999111',
    priceRange: '£70–£400',
  },
];

/**
 * Seeds the three demo mechanic documents using fixed IDs.
 */
async function seedMechanics(): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;

  for (const m of DEMO_MECHANICS) {
    const ref = doc(fb.db, MECHANICS, m.mechanicId);
    await setDoc(ref, m, { merge: true });
  }
}

/**
 * Seeds (or updates) the current user's profile document.
 */
async function seedUserProfile(
  uid: string,
  email: string,
  displayName?: string | null
): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;

  const ref = doc(fb.db, USERS, uid);
  const snap = await getDoc(ref);

  const user: AppUser = {
    uid,
    name: displayName ?? email.split('@')[0] ?? 'User',
    email,
    role: 'customer',
    phone: '',
    createdAt: snap.exists()
      ? (snap.data().createdAt as string) ?? new Date().toISOString()
      : new Date().toISOString(),
  };

  await setDoc(ref, user, { merge: true });
}

/**
 * Creates demo bookings for the current user to populate the "My Bookings" screen.
 * Uses fixed IDs — safe to call repeatedly.
 */
async function seedDemoBookings(uid: string, email: string): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;

  const now = new Date().toISOString();
  const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const fiveDaysFromNow = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const demoBookings: Array<Booking & { userEmail: string }> = [
    {
      bookingId: 'booking_demo_001',
      userId: uid,
      userEmail: email,
      mechanicId: 'mechanic_001',
      mechanicName: 'City Auto Garage',
      vehicleType: 'Sedan',
      vehicleModel: '2022 Toyota Corolla',
      issueDescription: 'Engine warning light on, occasional rough idling at low RPM.',
      serviceType: 'Engine diagnostics',
      status: 'pending',
      bookingDate: twoDaysFromNow,
      createdAt: now,
      updatedAt: now,
    },
    {
      bookingId: 'booking_demo_002',
      userId: uid,
      userEmail: email,
      mechanicId: 'mechanic_002',
      mechanicName: 'FastFix Motors',
      vehicleType: 'SUV',
      vehicleModel: '2021 Honda CR-V',
      issueDescription: 'Front tyres worn unevenly, needs alignment check and tyre replacement.',
      serviceType: 'Tyres',
      status: 'accepted',
      bookingDate: fiveDaysFromNow,
      createdAt: now,
      updatedAt: now,
    },
    {
      bookingId: 'booking_demo_003',
      userId: uid,
      userEmail: email,
      mechanicId: 'mechanic_003',
      mechanicName: 'Quick Repair Hub',
      vehicleType: 'Hatchback',
      vehicleModel: '2020 VW Golf',
      issueDescription: 'Battery not holding charge, car struggles to start in cold weather.',
      serviceType: 'Battery replacement',
      status: 'completed',
      bookingDate: threeDaysAgo,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const booking of demoBookings) {
    const ref = doc(fb.db, BOOKINGS, booking.bookingId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, booking);
    }
  }
}

/**
 * Main entry point — call after a successful login or signup.
 * Seeds mechanics, user profile, and demo bookings.
 * Safe to call multiple times; fixed IDs prevent duplicates.
 */
export async function seedAllDemoData(
  uid: string,
  email: string,
  displayName?: string | null
): Promise<void> {
  try {
    // Seed sequentially to avoid overwhelming Firestore on first run
    await seedMechanics();
    await seedUserProfile(uid, email, displayName);
    await seedDemoBookings(uid, email);
    console.log('[seedDataService] Demo data seeded successfully.');
  } catch (err) {
    // Non-fatal: log but don't crash the app
    console.warn('[seedDataService] Failed to seed demo data:', err);
  }
}
