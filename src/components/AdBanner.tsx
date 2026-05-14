import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * AdBanner is disabled for stable app startup.
 * Re-enable with a valid AdMob integration once the app is stable.
 */
export function AdBanner() {
  return <View style={styles.wrap} />;
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 8 },
});
