require('dotenv').config();

module.exports = ({ config }) => {
  // We provide every possible variation of the keys to ensure the 
  // react-native-google-mobile-ads config plugin captures it.
  const adMobConfig = {
    android_app_id: 'ca-app-pub-3940256099942544~3347511713',
    ios_app_id: 'ca-app-pub-3940256099942544~1458002511',
    androidAppId: 'ca-app-pub-3940256099942544~3347511713',
    iosAppId: 'ca-app-pub-3940256099942544~1458002511',
  };

  return {
    ...config,
    // Some versions of the plugin look here
    'react-native-google-mobile-ads': adMobConfig,
    android: {
      ...config.android,
      config: {
        ...(config.android && config.android.config),
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        },
        // Legacy Expo AdMob location
        googleMobileAdsAppId: adMobConfig.android_app_id,
      },
    },
    extra: {
      ...config.extra,
      ...adMobConfig, // Some plugins look in extra
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    },
  };
};
