import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { AppButton } from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';
import { getUserProfile, upsertUserProfile } from '../services/firestoreService';
import type { AppUser } from '../firebase/types';
import { colors } from '../utils/theme';
import { navigationRef } from '../navigation/navigationRef';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ProfileScreen({ navigation: _navigation }: Props) {
  const { profile, firebaseConfigured, firebaseUser, refreshProfile } = useAuth();
  const [localProfile, setLocalProfile] = useState<AppUser | null>(profile);
  const [profileLoading, setProfileLoading] = useState(false);

  // When auth profile updates, sync local state
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  // Fetch or create user profile from Firestore
  useEffect(() => {
    if (!firebaseConfigured || !firebaseUser) return;
    let cancelled = false;

    (async () => {
      setProfileLoading(true);
      try {
        let p = await getUserProfile(firebaseUser.uid);
        if (!p) {
          // Create profile in Firestore if it doesn't exist
          const newProfile: AppUser = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'User',
            email: firebaseUser.email ?? '',
            role: 'customer',
            phone: '',
            createdAt: new Date().toISOString(),
          };
          await upsertUserProfile(newProfile);
          p = newProfile;
        }
        if (!cancelled) setLocalProfile(p);
      } catch {
        // Fall back to auth context profile
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [firebaseConfigured, firebaseUser]);

  async function onLogout() {
    if (!firebaseConfigured) {
      navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
      return;
    }
    await logoutUser();
    navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  const displayProfile = localProfile ?? profile;

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>Profile</Text>

      {profileLoading ? (
        <ActivityIndicator style={{ marginVertical: 20 }} color={colors.primary} />
      ) : (
        <>
          <Text style={styles.row}>
            <Text style={styles.label}>Name: </Text>
            {displayProfile?.name ?? firebaseUser?.displayName ?? '—'}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Email: </Text>
            {displayProfile?.email ?? firebaseUser?.email ?? '—'}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Role: </Text>
            {displayProfile?.role ?? '—'}
          </Text>
          <Text style={styles.row}>
            <Text style={styles.label}>Phone: </Text>
            {displayProfile?.phone ?? '—'}
          </Text>
        </>
      )}

      <AppButton title="Refresh profile" variant="secondary" onPress={refreshProfile} />
      <AppButton title="Settings & about" variant="secondary" onPress={() => navigationRef.navigate('Settings')} />
      {displayProfile?.role === 'mechanic' ? (
        <AppButton title="Mechanic dashboard" variant="secondary" onPress={() => navigationRef.navigate('AdminDashboard')} />
      ) : null}
      <AppButton title="Log out" onPress={onLogout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, backgroundColor: colors.background, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 12 },
  row: { marginBottom: 8, color: colors.text },
  label: { fontWeight: '700' },
});
