import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../utils/theme';
import { AppButton } from '../components/AppButton';
import { navigationRef } from '../navigation/navigationRef';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen(_props: Props) {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>Settings & about</Text>
      <Text style={styles.p}>
        Smart Mechanic requests location only when you refresh the nearby list or open the map — not on a tight polling
        loop — to reduce battery use. Background sync runs at OS-controlled intervals (15+ minutes) and only pulls
        lightweight Firestore documents.
      </Text>
      <Text style={styles.p}>
        Version 1.0.0 — academic demonstration build. Replace placeholder Firebase keys using `.env` and EAS Secrets for
        production.
      </Text>
      <AppButton title="Back" variant="secondary" onPress={() => navigationRef.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, backgroundColor: colors.background, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 12 },
  p: { color: colors.muted, marginBottom: 12, lineHeight: 22 },
});
