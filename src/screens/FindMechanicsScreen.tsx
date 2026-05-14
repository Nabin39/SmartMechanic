import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { fetchMechanics } from '../services/firestoreService';
import type { Mechanic } from '../firebase/types';
import { getCurrentLocationOnce } from '../services/locationService';
import { distanceKm, formatDistanceKm } from '../utils/distance';
import { colors } from '../utils/theme';
import { EmptyState } from '../components/EmptyState';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { navigationRef } from '../navigation/navigationRef';
import { useAuth } from '../context/AuthContext';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Find'>,
  NativeStackScreenProps<RootStackParamList>
>;

type Row = Mechanic & { distanceKm?: number };

export default function FindMechanicsScreen({ navigation: _navigation }: Props) {
  const { firebaseConfigured } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const load = useCallback(async () => {
    setError(undefined);
    if (!firebaseConfigured) {
      setError('Configure Firebase in .env to load mechanics from Firestore.');
      setRows([]);
      setLoading(false);
      return;
    }
    try {
      // Fetch mechanics from Firestore first — never block on location
      const mechanics = await fetchMechanics();

      // Show mechanics immediately, then try location in background
      const enriched: Row[] = mechanics.map((m) => ({ ...m }));
      setRows(enriched);
      setLoading(false);
      setRefreshing(false);

      // Try to get location with a 3-second timeout — non-blocking
      try {
        const loc = await Promise.race([
          getCurrentLocationOnce(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
        ]);

        if (loc?.coords) {
          const withDistance: Row[] = mechanics
            .map((m) => ({
              ...m,
              distanceKm: distanceKm(loc.coords.latitude, loc.coords.longitude, m.latitude, m.longitude),
            }))
            .sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9));
          setRows(withDistance);
        }
      } catch {
        // Location unavailable — mechanics are already displayed without distances
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load mechanics');
      setLoading(false);
      setRefreshing(false);
    }
  }, [firebaseConfigured]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.root}>
      <LoadingOverlay visible={loading} />
      <Text style={styles.title}>Nearby mechanics</Text>
      <Text style={styles.hint}>
        Location is requested once per refresh (battery-aware — no continuous tracking).
      </Text>
      {error ? <Text style={styles.err}>{error}</Text> : null}
      <FlatList
        data={rows}
        keyExtractor={(item) => item.mechanicId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={
          !loading ? (
            <EmptyState title="No mechanics yet" message="Check Firebase configuration or pull to refresh." />
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigationRef.navigate('MechanicDetails', { mechanicId: item.mechanicId })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.addr}>{item.address}</Text>
            <Text style={styles.meta}>
              {item.distanceKm != null ? `${formatDistanceKm(item.distanceKm)} · ` : ''}
              Rating {item.rating.toFixed(1)} · {item.services.slice(0, 2).join(', ')}
            </Text>
            <Text style={styles.phone}>{item.phone}</Text>
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
  err: { color: colors.danger, marginBottom: 8 },
  card: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  name: { fontSize: 17, fontWeight: '700', color: colors.text },
  addr: { marginTop: 2, color: colors.muted, fontSize: 13 },
  meta: { marginTop: 4, color: colors.muted },
  phone: { marginTop: 6, color: colors.primary, fontWeight: '600' },
});
