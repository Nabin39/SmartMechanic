import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { fetchMechanics } from '../services/firestoreService';
import type { Mechanic } from '../firebase/types';
import { colors } from '../utils/theme';
import { AppButton } from '../components/AppButton';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { EmptyState } from '../components/EmptyState';
import { navigationRef } from '../navigation/navigationRef';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

/**
 * Map Screen — shows a list of mechanics with their coordinates.
 * Google Maps requires a valid API key to render. Since no API key
 * is configured, this screen shows a clean list view instead of
 * crashing with a native Maps error.
 */
export default function MapScreen({ route }: Props) {
  const { firebaseConfigured } = useAuth();
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!firebaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const list = await fetchMechanics();
        if (!cancelled) setMechanics(list);
      } catch {
        // Silently fail — empty list is fine
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [firebaseConfigured]);

  const focusId = route.params?.focusMechanicId;

  return (
    <View style={styles.root}>
      <LoadingOverlay visible={loading} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mechanics Map</Text>
        <Text style={styles.hint}>
          Showing {mechanics.length} mechanics in Coventry. Tap a card to view details.
        </Text>
        <Text style={styles.note}>
          To enable the interactive map, add a Google Maps API key to your .env file
          (EXPO_PUBLIC_GOOGLE_MAPS_API_KEY) and rebuild.
        </Text>

        {mechanics.length === 0 && !loading ? (
          <EmptyState title="No mechanics loaded" message="Pull to refresh or check your connection." />
        ) : null}

        {mechanics.map((m) => (
          <TouchableOpacity
            key={m.mechanicId}
            style={[
              styles.card,
              m.mechanicId === focusId && styles.cardFocused,
            ]}
            onPress={() => navigationRef.navigate('MechanicDetails', { mechanicId: m.mechanicId })}
          >
            <Text style={styles.name}>{m.name}</Text>
            <Text style={styles.addr}>{m.address}</Text>
            <Text style={styles.coords}>
              📍 {m.latitude.toFixed(4)}, {m.longitude.toFixed(4)}
            </Text>
            <Text style={styles.meta}>
              Rating {m.rating.toFixed(1)} · {m.services.join(', ')}
            </Text>
            <Text style={styles.phone}>{m.phone}</Text>
          </TouchableOpacity>
        ))}

        <AppButton
          title="List view"
          variant="secondary"
          onPress={() => navigationRef.navigate('MainTabs', { screen: 'Find' })}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  hint: { marginTop: 6, color: colors.muted, marginBottom: 4 },
  note: {
    color: colors.muted,
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  cardFocused: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  name: { fontSize: 17, fontWeight: '700', color: colors.text },
  addr: { marginTop: 2, color: colors.muted, fontSize: 13 },
  coords: { marginTop: 4, color: colors.primary, fontSize: 12 },
  meta: { marginTop: 4, color: colors.muted },
  phone: { marginTop: 6, color: colors.primary, fontWeight: '600' },
});
