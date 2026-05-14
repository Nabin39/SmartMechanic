import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { AppButton } from '../components/AppButton';
import { colors } from '../utils/theme';
import { attachPhotoPaths } from '../services/firestoreService';
import { upsertCachedBooking } from '../database/sqliteService';
import { fetchBookingById } from '../services/firestoreService';
import { navigationRef } from '../navigation/navigationRef';

type Props = NativeStackScreenProps<RootStackParamList, 'UploadPhoto'>;

export default function UploadPhotoScreen({ route }: Props) {
  const { bookingId } = route.params;
  const [uri, setUri] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | undefined>();

  async function pick(useCamera: boolean) {
    setMsg(undefined);
    const perm = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setMsg('Permission denied for camera/photos.');
      return;
    }
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.6 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.6, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets[0]) {
      setUri(result.assets[0].uri);
    }
  }

  async function save() {
    if (!uri) {
      setMsg('Pick or capture a photo first.');
      return;
    }
    setLoading(true);
    try {
      await attachPhotoPaths(bookingId, uri);
      const b = await fetchBookingById(bookingId);
      if (b) {
        await upsertCachedBooking({
          bookingId: b.bookingId,
          mechanicName: b.mechanicName ?? 'Mechanic',
          serviceType: b.serviceType,
          status: b.status,
          bookingDate: b.bookingDate,
          synced: 1,
        });
      }
      navigationRef.goBack();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Car issue photo</Text>
      <Text style={styles.sub}>Booking ID: {bookingId}</Text>
      {uri ? <Image source={{ uri }} style={styles.preview} /> : null}
      <AppButton title="Take photo" onPress={() => pick(true)} />
      <AppButton title="Choose from library" variant="secondary" onPress={() => pick(false)} />
      <AppButton title="Attach to booking" onPress={save} loading={loading} />
      {msg ? <Text style={styles.err}>{msg}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  sub: { marginTop: 6, marginBottom: 12, color: colors.muted },
  preview: { width: '100%', height: 220, borderRadius: 12, marginBottom: 12, backgroundColor: colors.surface },
  err: { marginTop: 12, color: colors.danger },
});
