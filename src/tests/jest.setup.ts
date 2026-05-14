jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(async () => ({
    execAsync: jest.fn(),
    runAsync: jest.fn(),
    getAllAsync: jest.fn(async () => []),
  })),
}));

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(async () => ({ granted: true, status: 'granted' })),
  requestPermissionsAsync: jest.fn(async () => ({ granted: true, status: 'granted' })),
  scheduleNotificationAsync: jest.fn(),
  getPresentedNotificationsAsync: jest.fn(async () => []),
  AndroidImportance: { DEFAULT: 3 },
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(async () => ({
    coords: { latitude: 0, longitude: 0, altitude: null, accuracy: 10, altitudeAccuracy: null, heading: null, speed: null },
    timestamp: Date.now(),
  })),
  Accuracy: { Balanced: 3 },
}));

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = (props: Record<string, unknown>) => React.createElement(View, props);
  const MockMarker = (props: Record<string, unknown>) => React.createElement(View, props);
  return { __esModule: true, default: MockMapView, Marker: MockMarker, PROVIDER_GOOGLE: 'google' };
});

jest.mock('react-native-google-mobile-ads', () => ({
  __esModule: true,
  default: () => ({ initialize: jest.fn(async () => undefined) }),
  BannerAd: () => null,
  BannerAdSize: { ANCHORED_ADAPTIVE_BANNER: 'adaptive' },
  TestIds: { BANNER: 'banner-test', INTERSTITIAL: 'interstitial-test' },
  InterstitialAd: {
    createForAdRequest: () => ({
      addAdEventListener: jest.fn(() => jest.fn()),
      load: jest.fn(),
      show: jest.fn(),
    }),
  },
  AdEventType: { LOADED: 'loaded', CLOSED: 'closed' },
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        firebaseApiKey: 'test',
        firebaseAuthDomain: 'test.firebaseapp.com',
        firebaseProjectId: 'test',
        firebaseStorageBucket: 'test.appspot.com',
        firebaseMessagingSenderId: '123',
        firebaseAppId: '1:123:web:test',
      },
    },
  },
}));
