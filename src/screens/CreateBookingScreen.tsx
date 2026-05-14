import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { AppButton } from '../components/AppButton';
import { AppTextField } from '../components/AppTextField';
import { validateBookingForm } from '../utils/validation';
import { createBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/theme';
import { navigationRef } from '../navigation/navigationRef';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateBooking'>;

export default function CreateBookingScreen({ route }: Props) {
  const { mechanicId, mechanicName } = route.params;
  const { firebaseUser, profile } = useAuth();
  const [userName, setUserName] = useState(profile?.name ?? '');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [serviceType, setServiceType] = useState('Diagnostics');
  const [bookingDate, setBookingDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function submit() {
    setError(undefined);
    const v = validateBookingForm({
      userName,
      vehicleType,
      vehicleModel,
      problemDescription,
      serviceType,
      bookingDate,
    });
    if (!v.ok) {
      setError(Object.values(v.errors).filter(Boolean).join('\n'));
      return;
    }
    if (!firebaseUser) {
      setError('You must be logged in.');
      return;
    }
    setLoading(true);
    try {
      const booking = await createBooking({
        userId: firebaseUser.uid,
        userName: userName.trim(),
        mechanicId,
        mechanicName: mechanicName ?? 'Garage',
        vehicleType: vehicleType.trim(),
        vehicleModel: vehicleModel.trim(),
        issueDescription: problemDescription.trim(),
        serviceType: serviceType.trim(),
        bookingDate: bookingDate.trim(),
      });
      navigationRef.navigate('BookingDetails', { bookingId: booking.bookingId });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not create booking');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.root}>
        <Text style={styles.title}>Create booking</Text>
        <Text style={styles.sub}>Garage: {mechanicName ?? mechanicId}</Text>

        <AppTextField label="Your name" value={userName} onChangeText={setUserName} />
        <AppTextField label="Vehicle type" placeholder="e.g. Sedan" value={vehicleType} onChangeText={setVehicleType} />
        <AppTextField label="Vehicle model" placeholder="e.g. 2019 Civic" value={vehicleModel} onChangeText={setVehicleModel} />
        <AppTextField
          label="Problem description"
          multiline
          value={problemDescription}
          onChangeText={setProblemDescription}
        />
        <AppTextField label="Service type" value={serviceType} onChangeText={setServiceType} />
        <AppTextField
          label="Preferred date & time"
          placeholder="e.g. 2026-05-20 09:30"
          value={bookingDate}
          onChangeText={setBookingDate}
        />

        {error ? <Text style={styles.err}>{error}</Text> : null}

        <AppButton title="Submit booking" onPress={submit} loading={loading} />
        <Text style={styles.note}>
          After submitting, open the booking to attach photos or track status updates.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, backgroundColor: colors.background, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  sub: { marginTop: 6, marginBottom: 12, color: colors.muted },
  err: { color: colors.danger, marginBottom: 10 },
  note: { marginTop: 10, color: colors.muted, fontSize: 13 },
});
