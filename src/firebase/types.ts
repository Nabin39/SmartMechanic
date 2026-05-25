/**
 * Firestore / domain types for Smart Mechanic.
 * Collection shapes match assessment specification.
 */

export type UserRole = 'customer' | 'mechanic';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt?: string;
}

export interface Mechanic {
  mechanicId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  services: string[];
  rating: number;
  phone: string;
  /** Optional UI field — estimated price range label */
  priceRange?: string;
}

export interface Booking {
  bookingId: string;
  userId: string;
  userEmail?: string;
  mechanicId: string;
  vehicleType: string;
  vehicleModel: string;
  issueDescription: string;
  /** Local file URI or remote URL placeholder */
  photoUrl?: string;
  photoPath?: string;
  serviceType: string;
  bookingDate: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  /** Denormalized for SQLite cache display */
  mechanicName?: string;
}
