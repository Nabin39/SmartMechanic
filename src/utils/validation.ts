import { BookingStatus } from '../firebase/types';
import { isValidBookingStatus } from './bookingStatus';

export interface BookingFormInput {
  userName: string;
  vehicleType: string;
  vehicleModel: string;
  problemDescription: string;
  serviceType: string;
  bookingDate: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: Partial<Record<keyof BookingFormInput | 'general', string>>;
}

export function validateBookingForm(input: BookingFormInput): ValidationResult {
  const errors: ValidationResult['errors'] = {};
  if (!input.userName?.trim()) errors.userName = 'Name is required';
  if (!input.vehicleType?.trim()) errors.vehicleType = 'Vehicle type is required';
  if (!input.vehicleModel?.trim()) errors.vehicleModel = 'Vehicle model is required';
  if (!input.problemDescription?.trim()) errors.problemDescription = 'Describe the issue';
  if (!input.serviceType?.trim()) errors.serviceType = 'Select a service type';
  if (!input.bookingDate?.trim()) errors.bookingDate = 'Pick date and time';
  return { ok: Object.keys(errors).length === 0, errors };
}

export function parseBookingStatus(raw: string): BookingStatus | null {
  const s = raw?.toLowerCase?.() ?? '';
  if (isValidBookingStatus(s)) return s;
  return null;
}
