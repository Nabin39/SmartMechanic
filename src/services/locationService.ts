import * as Location from 'expo-location';

/**
 * Location helper — uses balanced accuracy and a single fix to reduce battery drain
 * (no high-frequency watchPosition in this app).
 */

export async function requestLocationPermission(): Promise<boolean> {
  const fg = await Location.requestForegroundPermissionsAsync();
  return fg.status === 'granted';
}

export async function getCurrentLocationOnce(): Promise<Location.LocationObject | null> {
  const ok = await requestLocationPermission();
  if (!ok) return null;
  return Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    mayShowUserSettingsDialog: true,
  });
}
