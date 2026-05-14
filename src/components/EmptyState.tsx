import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';

type Props = { title: string; message: string };

export function EmptyState({ title, message }: Props) {
  return (
    <View style={styles.box} accessibilityRole="summary">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.msg}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 24, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  msg: { fontSize: 15, color: colors.muted, textAlign: 'center' },
});
