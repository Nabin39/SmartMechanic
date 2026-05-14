import React, { PropsWithChildren } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';

export function AppCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

export function AppCardTitle({ children }: PropsWithChildren) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
});
