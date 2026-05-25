jest.mock('../../database/sqliteService', () => ({
  upsertCachedBooking: jest.fn(async () => undefined),
  markBookingSynced: jest.fn(async () => undefined),
}));

jest.mock('../../services/notificationService', () => ({
  notifyBookingConfirmed: jest.fn(async () => undefined),
}));

jest.mock('../../services/storageService', () => ({
  uploadBookingPhotoPlaceholder: jest.fn(async () => ({ remoteUrl: null })),
}));

jest.mock('../../services/firestoreService', () => ({
  createBookingDoc: jest.fn(async () => undefined),
  attachPhotoPaths: jest.fn(async () => undefined),
}));

import { createBooking } from '../../services/bookingService';
import { createBookingDoc } from '../../services/firestoreService';
import { upsertCachedBooking, markBookingSynced } from '../../database/sqliteService';

describe('bookingService.createBooking (integration-style)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls Firestore and SQLite persistence helpers', async () => {
    const booking = await createBooking({
      userId: 'u1',
      userEmail: 'alex@example.com',
      userName: 'Alex',
      mechanicId: 'm1',
      mechanicName: 'Garage',
      vehicleType: 'Sedan',
      vehicleModel: 'Civic',
      issueDescription: 'Oil leak',
      serviceType: 'Service',
      bookingDate: '2026-06-01 09:00',
    });

    expect(booking.bookingId).toMatch(/^bk_/);
    expect(createBookingDoc).toHaveBeenCalled();
    expect(upsertCachedBooking).toHaveBeenCalled();
    expect(markBookingSynced).toHaveBeenCalled();
  });
});
