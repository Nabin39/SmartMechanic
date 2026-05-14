import { distanceKm, formatDistanceKm, toRad } from '../../utils/distance';

describe('distance utils (unit)', () => {
  it('computes haversine distance between two points', () => {
    const km = distanceKm(-37.8136, 144.9631, -37.8155, 144.9669);
    expect(km).toBeGreaterThan(0);
    expect(km).toBeLessThan(5);
  });

  it('formats sub-kilometre distances in metres', () => {
    expect(formatDistanceKm(0.4)).toContain('m');
  });

  it('converts degrees to radians', () => {
    expect(toRad(180)).toBeCloseTo(Math.PI, 5);
  });
});
