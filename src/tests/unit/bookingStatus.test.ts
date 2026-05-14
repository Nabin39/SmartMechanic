import { getBookingStatusLabel, canTransitionStatus } from '../../utils/bookingStatus';

describe('booking status helpers (unit)', () => {
  it('returns readable labels', () => {
    expect(getBookingStatusLabel('in_progress')).toBe('In progress');
  });

  it('allows mechanic forward transitions', () => {
    expect(canTransitionStatus('pending', 'accepted', 'mechanic')).toBe(true);
    expect(canTransitionStatus('pending', 'completed', 'mechanic')).toBe(false);
  });

  it('allows customer to cancel only from pending', () => {
    expect(canTransitionStatus('pending', 'cancelled', 'customer')).toBe(true);
    expect(canTransitionStatus('accepted', 'cancelled', 'customer')).toBe(false);
  });
});
