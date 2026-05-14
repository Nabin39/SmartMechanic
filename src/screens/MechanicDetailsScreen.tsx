import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { fetchMechanicById } from '../services/firestoreService';
import type { Mechanic } from '../firebase/types';
import { AppButton } from '../components/AppButton';
import { colors } from '../utils/theme';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { navigationRef } from '../navigation/navigationRef';

type Props = NativeStackScreenProps<RootStackParamList, 'MechanicDetails'>;

export default function MechanicDetailsScreen({ route }: Props) {
  const { mechanicId } = route.params;
  const [m, setM] = useState<Mechanic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const data = await fetchMechanicById(mechanicId);
        if (!c) setM(data);
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [mechanicId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <LoadingOverlay visible />
      </View>
    );
  }

  if (!m) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Mechanic not found</Text>
        <AppButton title="Back" onPress={() => navigationRef.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>{m.name}</Text>
      <Text style={styles.addr}>{m.address}</Text>
      <Text style={styles.label}>Phone</Text>
      <Text style={styles.value}>{m.phone}</Text>
      <Text style={styles.label}>Rating</Text>
      <Text style={styles.value}>{m.rating.toFixed(1)} / 5</Text>
      <Text style={styles.label}>Estimated price range</Text>
      <Text style={styles.value}>{m.priceRange ?? 'Contact garage'}</Text>
      <Text style={styles.label}>Services</Text>
      <Text style={styles.value}>{m.services.join(', ')}</Text>
      <AppButton
        title="Book now"
        onPress={() =>
          navigationRef.navigate('CreateBooking', {
            mechanicId: m.mechanicId,
            mechanicName: m.name,
          })
        }
      />
      <AppButton
        title="View on map"
        variant="secondary"
        onPress={() => navigationRef.navigate('Map', { focusMechanicId: m.mechanicId })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, paddingBottom: 40, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  addr: { marginTop: 8, color: colors.muted, marginBottom: 16 },
  label: { marginTop: 10, fontWeight: '700', color: colors.text },
  value: { marginTop: 4, color: colors.muted },
});
