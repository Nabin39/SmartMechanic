import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const { loading, firebaseUser } = useAuth();

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      navigation.replace(firebaseUser ? 'MainTabs' : 'Login');
    }, 900);
    return () => clearTimeout(t);
  }, [loading, firebaseUser, navigation]);

  return (
    <View style={styles.root}>
      <Text style={styles.logo}>Smart Mechanic</Text>
      <Text style={styles.tag}>Book trusted garages nearby</Text>
      <ActivityIndicator style={{ marginTop: 24 }} color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 28, fontWeight: '800', color: '#fff' },
  tag: { marginTop: 8, color: '#cfe8ff', fontSize: 15 },
});
