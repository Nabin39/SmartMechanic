import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { fetchAllBookingsDemo } from '../services/firestoreService';
import { changeBookingStatus } from '../services/bookingService';
import type { Booking, BookingStatus } from '../firebase/types';
import { AppButton } from '../components/AppButton';
import { getBookingStatusLabel, canTransitionStatus } from '../utils/bookingStatus';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/EmptyState';
import { navigationRef } from '../navigation/navigationRef';
import { colors } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>;

function nextMechanicStatus(s: BookingStatus): BookingStatus | null {
  if (s === 'pending') return 'accepted';
  if (s === 'accepted') return 'in_progress';
  if (s === 'in_progress') return 'completed';
  return null;
}

export default function AdminDashboardScreen(_props: Props) {
  const { profile } = useAuth();
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchAllBookingsDemo();
      setRows(data);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (profile?.role !== 'mechanic') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Mechanic access only</Text>
        <AppButton title="Back" onPress={() => navigationRef.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Mechanic / admin dashboard</Text>
      <Text style={styles.sub}>
        Demo view loads bookings from Firestore. In production, restrict reads with security rules to the signed-in
        mechanic&apos;s `mechanicId`.
      </Text>
      <FlatList
        data={rows}
        keyExtractor={(b) => b.bookingId}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        ListEmptyComponent={
          !loading ? <EmptyState title="No bookings" message="Create a booking as a customer first." /> : null
        }
        renderItem={({ item }) => {
          const next = nextMechanicStatus(item.status);
          return (
            <View style={styles.card}>
              <Text style={styles.line}>{item.mechanicName ?? item.mechanicId}</Text>
              <Text style={styles.meta}>
                {item.vehicleModel} · {getBookingStatusLabel(item.status)}
              </Text>
              <Text style={styles.meta}>{item.issueDescription}</Text>
              {next && canTransitionStatus(item.status, next, 'mechanic') ? (
                <AppButton
                  title={`Advance to ${getBookingStatusLabel(next)}`}
                  onPress={async () => {
                    await changeBookingStatus(item.bookingId, next);
                    await load();
                  }}
                />
              ) : null}
              {item.status !== 'cancelled' && item.status !== 'completed' ? (
                <AppButton
                  title="Cancel job"
                  variant="secondary"
                  onPress={async () => {
                    if (!canTransitionStatus(item.status, 'cancelled', 'mechanic')) return;
                    await changeBookingStatus(item.bookingId, 'cancelled');
                    await load();
                  }}
                />
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  sub: { marginTop: 8, marginBottom: 12, color: colors.muted },
  card: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  line: { fontWeight: '700', color: colors.text },
  meta: { marginTop: 4, color: colors.muted },
});
