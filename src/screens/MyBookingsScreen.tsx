import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { fetchBookingsForUser } from '../services/firestoreService';
import type { Booking } from '../firebase/types';
import { getBookingStatusLabel } from '../utils/bookingStatus';
import { colors } from '../utils/theme';
import { EmptyState } from '../components/EmptyState';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { navigationRef } from '../navigation/navigationRef';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Bookings'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function MyBookingsScreen({ route: _route }: Props) {
  const { firebaseUser, firebaseConfigured } = useAuth();
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const load = useCallback(async () => {
    setError(undefined);
    if (!firebaseConfigured) {
      setError('Firebase is not configured. Add keys to .env.');
      setItems([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    if (!firebaseUser) {
      setError('Please log in to see your bookings.');
      setItems([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const remote = await fetchBookingsForUser(firebaseUser.uid);
      setItems(remote.sort((a, b) => (a.bookingDate < b.bookingDate ? 1 : -1)));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load bookings';
      // Give a helpful hint if it's a permissions issue
      if (msg.includes('permission') || msg.includes('Permission')) {
        setError('Missing or insufficient permissions. Please update your Firestore security rules in Firebase Console to allow authenticated reads/writes.');
      } else {
        setError(msg);
      }
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [firebaseConfigured, firebaseUser]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  return (
    <View style={styles.root}>
      <LoadingOverlay visible={loading} />
      <Text style={styles.title}>My bookings</Text>
      <Text style={styles.hint}>Shows your bookings from Firestore.</Text>
      {error ? <Text style={styles.err}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(b) => b.bookingId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={
          !loading && !error ? (
            <EmptyState title="No bookings yet" message="Create a booking from a mechanic profile." />
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigationRef.navigate('BookingDetails', { bookingId: item.bookingId })}
          >
            <Text style={styles.line}>{item.mechanicName ?? item.mechanicId}</Text>
            <Text style={styles.meta}>
              {item.serviceType} · {getBookingStatusLabel(item.status)}
            </Text>
            <Text style={styles.meta}>{item.bookingDate}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  hint: { marginTop: 6, color: colors.muted, marginBottom: 12 },
  err: { color: colors.danger, marginBottom: 8, lineHeight: 20 },
  card: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  line: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { marginTop: 4, color: colors.muted },
});
