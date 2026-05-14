import { validateBookingForm } from '../../utils/validation';

describe('booking form validation (unit)', () => {
  it('passes when all required fields are present', () => {
    const r = validateBookingForm({
      userName: 'Alex',
      vehicleType: 'SUV',
      vehicleModel: '2020 RAV4',
      problemDescription: 'Brakes squeal',
      serviceType: 'Brakes',
      bookingDate: '2026-05-20 10:00',
    });
    expect(r.ok).toBe(true);
  });

  it('fails when required fields are missing', () => {
    const r = validateBookingForm({
      userName: '',
      vehicleType: '',
      vehicleModel: '',
      problemDescription: '',
      serviceType: '',
      bookingDate: '',
    });
    expect(r.ok).toBe(false);
    expect(r.errors.userName).toBeDefined();
  });
});
