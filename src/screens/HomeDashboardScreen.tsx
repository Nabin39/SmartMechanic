import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList } from '../navigation/types';
import type { RootStackParamList } from '../navigation/types';
import { AppButton } from '../components/AppButton';
import { AppCard, AppCardTitle } from '../components/AppCard';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/theme';
import { navigationRef } from '../navigation/navigationRef';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeDashboardScreen({ navigation }: Props) {
  const { profile } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.hi}>Hello, {profile?.name ?? 'driver'}</Text>
      <Text style={styles.sub}>Quick actions</Text>

      <AppCard>
        <AppCardTitle>Find mechanics</AppCardTitle>
        <Text style={styles.body}>Browse garages sorted by distance from your location.</Text>
        <AppButton
          title="Open map"
          onPress={() => {
            navigationRef.navigate('Map');
          }}
        />
      </AppCard>

      <AppCard>
        <AppCardTitle>Book a service</AppCardTitle>
        <Text style={styles.body}>Select a garage, describe the issue, attach photos.</Text>
        <AppButton title="My bookings" onPress={() => navigation.navigate('Bookings')} />
      </AppCard>

      <AppCard>
        <AppCardTitle>Stay updated</AppCardTitle>
        <Text style={styles.body}>Local notifications when your booking changes.</Text>
        <AppButton title="Notifications" onPress={() => navigation.navigate('Notifications')} />
      </AppCard>

      <AppButton title="Profile & settings" variant="secondary" onPress={() => navigation.navigate('Profile')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, backgroundColor: colors.background, paddingBottom: 40 },
  hi: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 4 },
  sub: { fontSize: 15, color: colors.muted, marginBottom: 16 },
  body: { color: colors.muted, marginBottom: 12 },
});
