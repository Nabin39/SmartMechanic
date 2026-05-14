import { BookingStatus } from '../firebase/types';

const ORDER: BookingStatus[] = [
  'pending',
  'accepted',
  'in_progress',
  'completed',
  'cancelled',
];

export function isValidBookingStatus(value: string): value is BookingStatus {
  return ORDER.includes(value as BookingStatus);
}

export function getBookingStatusLabel(status: BookingStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Accepted';
    case 'in_progress':
      return 'In progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

export function canTransitionStatus(
  from: BookingStatus,
  to: BookingStatus,
  role: 'customer' | 'mechanic'
): boolean {
  if (role === 'customer') {
    return to === 'cancelled' && from === 'pending';
  }
  if (from === 'cancelled' || from === 'completed') return false;
  const next: Record<BookingStatus, BookingStatus[]> = {
    pending: ['accepted', 'cancelled'],
    accepted: ['in_progress', 'cancelled'],
    in_progress: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  };
  return (next[from] ?? []).includes(to);
}
