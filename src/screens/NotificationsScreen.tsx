import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import * as Notifications from 'expo-notifications';
import { colors } from '../utils/theme';
import { EmptyState } from '../components/EmptyState';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Notifications'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function NotificationsScreen(_props: Props) {
  const [items, setItems] = useState<Notifications.Notification[]>([]);

  useEffect(() => {
    Notifications.getPresentedNotificationsAsync().then(setItems);
  }, []);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.sub}>
        Local alerts are scheduled when bookings are created or statuses change. Remote FCM can extend this using
        device tokens stored in Firestore (see docs).
      </Text>
      <FlatList
        data={items}
        keyExtractor={(_, i) => String(i)}
        ListEmptyComponent={<EmptyState title="No queued notifications" message="Trigger a booking update to see alerts." />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.line}>{item.request.content.title}</Text>
            <Text style={styles.body}>{item.request.content.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  sub: { marginTop: 8, marginBottom: 12, color: colors.muted },
  card: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  line: { fontWeight: '700', color: colors.text },
  body: { marginTop: 4, color: colors.muted },
});
