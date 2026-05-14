import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { fetchBookingById } from '../services/firestoreService';
import { changeBookingStatus } from '../services/bookingService';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { AppButton } from '../components/AppButton';
import { navigationRef } from '../navigation/navigationRef';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/theme';
import { getBookingStatusLabel, canTransitionStatus } from '../utils/bookingStatus';
import type { Booking, BookingStatus } from '../firebase/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingDetails'>;

export default function BookingDetailsScreen({ route }: Props) {
  const { bookingId } = route.params;
  const { profile } = useAuth();
  const [b, setB] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBookingById(bookingId);
      setB(data);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function cancelBooking() {
    if (!b) return;
    setBusy(true);
    try {
      await changeBookingStatus(b.bookingId, 'cancelled');
      await reload();
    } finally {
      setBusy(false);
    }
  }

  if (!b && !loading) {
    return (
      <View style={styles.center}>
        <Text>Booking not found.</Text>
        <AppButton title="Back" onPress={() => navigationRef.goBack()} />
      </View>
    );
  }

  const nextStatuses: BookingStatus[] = ['accepted', 'in_progress', 'completed', 'cancelled'];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LoadingOverlay visible={loading} />
      <ScrollView contentContainerStyle={styles.root}>
        <Text style={styles.title}>Booking</Text>
        <Text style={styles.status}>{getBookingStatusLabel(b?.status ?? 'pending')}</Text>
        <Row label="Garage" value={b?.mechanicName ?? b?.mechanicId} />
        <Row label="Vehicle" value={`${b?.vehicleType} ${b?.vehicleModel}`} />
        <Row label="Service" value={b?.serviceType} />
        <Row label="When" value={b?.bookingDate} />
        <Row label="Issue" value={b?.issueDescription} />
        <Row label="Photo" value={b?.photoUrl || b?.photoPath || 'No photo attached'} />

        <AppButton
          title="Upload / capture photo"
          variant="secondary"
          onPress={() => navigationRef.navigate('UploadPhoto', { bookingId })}
        />

        {profile?.role === 'customer' && b?.status === 'pending' ? (
          <AppButton title="Cancel booking" variant="secondary" onPress={cancelBooking} loading={busy} />
        ) : null}

        {profile?.role === 'mechanic' ? (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.section}>Mechanic tools (demo)</Text>
            {nextStatuses.map((s) => (
              <AppButton
                key={s}
                title={`Set status: ${getBookingStatusLabel(s)}`}
                variant="secondary"
                onPress={async () => {
                  if (!b) return;
                  if (!canTransitionStatus(b.status, s, 'mechanic')) return;
                  setBusy(true);
                  try {
                    await changeBookingStatus(b.bookingId, s);
                    await reload();
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  status: { marginTop: 6, marginBottom: 16, fontSize: 16, color: colors.primary, fontWeight: '700' },
  label: { fontWeight: '700', color: colors.text },
  value: { marginTop: 4, color: colors.muted },
  section: { fontWeight: '800', marginBottom: 8, color: colors.text },
});
