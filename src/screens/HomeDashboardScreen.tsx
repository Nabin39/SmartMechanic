import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList } from '../navigation/types';
import type { RootStackParamList } from '../navigation/types';
import type { Booking } from '../firebase/types';
import { AppButton } from '../components/AppButton';
import { AppCard, AppCardTitle } from '../components/AppCard';
import { useAuth } from '../context/AuthContext';
import { useBookingToast } from '../context/BookingToastContext';
import { colors } from '../utils/theme';
import { navigationRef } from '../navigation/navigationRef';
import { loadBookingsHybrid } from '../services/bookingService';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeDashboardScreen({ navigation }: Props) {
  const { firebaseConfigured, firebaseUser, profile } = useAuth();
  const { toastMessage, clearToast } = useBookingToast();
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadBookingSummary = useCallback(async () => {
    setSummaryError(undefined);
    setSummaryLoading(true);
    if (!firebaseConfigured || !firebaseUser) {
      setLatestBooking(null);
      setBookingCount(0);
      setSummaryLoading(false);
      return;
    }

    try {
      const { remote, localRows } = await loadBookingsHybrid(firebaseUser.uid);
      const userBookings = remote.length
        ? remote
        : localRows.map((row) => ({
            bookingId: row.bookingId,
            userId: firebaseUser.uid,
            userEmail: firebaseUser.email ?? '',
            mechanicId: '',
            vehicleType: '',
            vehicleModel: '',
            issueDescription: '',
            serviceType: row.serviceType,
            bookingDate: row.bookingDate,
            status: row.status as Booking['status'],
            createdAt: row.bookingDate,
            updatedAt: row.bookingDate,
            mechanicName: row.mechanicName,
          }));

      const sortedBookings = [...userBookings].sort((a, b) => (a.bookingDate < b.bookingDate ? 1 : -1));
      setBookingCount(userBookings.length);
      setLatestBooking(sortedBookings[0] ?? null);
    } catch (e: unknown) {
      setSummaryError(e instanceof Error ? e.message : 'Unable to load booking summary');
      setLatestBooking(null);
      setBookingCount(0);
    } finally {
      setSummaryLoading(false);
    }
  }, [firebaseConfigured, firebaseUser]);

  useEffect(() => {
    if (toastMessage) {
      setSuccessMessage(toastMessage);
      clearToast();
    }
  }, [clearToast, toastMessage]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4200);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useFocusEffect(
    useCallback(() => {
      loadBookingSummary();
    }, [loadBookingSummary])
  );

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <AppCard>
        <AppCardTitle>Booking summary</AppCardTitle>
        {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
        {summaryLoading ? (
          <Text style={styles.body}>Loading your latest booking...</Text>
        ) : summaryError ? (
          <Text style={styles.err}>{summaryError}</Text>
        ) : bookingCount === 0 ? (
          <Text style={styles.body}>No bookings yet. Book any mechanic to get started.</Text>
        ) : (
          <>
            <Text style={styles.body}>You have {bookingCount} booking{bookingCount !== 1 ? 's' : ''}.</Text>
            <Text style={styles.body}>
              Latest: {latestBooking?.mechanicName ?? 'Unknown'} · {latestBooking?.serviceType}
            </Text>
            {latestBooking?.bookingDate ? <Text style={styles.body}>{latestBooking.bookingDate}</Text> : null}
          </>
        )}
      </AppCard>
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
  success: { color: colors.primary, marginBottom: 12, fontWeight: '600' },
  err: { color: colors.danger, marginBottom: 12 },
});
