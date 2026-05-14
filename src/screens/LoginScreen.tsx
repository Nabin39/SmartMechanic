import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { AppButton } from '../components/AppButton';
import { AppTextField } from '../components/AppTextField';
import { loginWithEmail } from '../services/authService';
import { colors } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { firebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function onLogin() {
    setError(undefined);
    if (!firebaseConfigured) {
      setError('Firebase is not configured. Copy .env.example to .env and add keys.');
      return;
    }
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigation.replace('MainTabs');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.root}>
        <Text style={styles.title}>Welcome back</Text>
        <AppTextField
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <AppTextField
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <AppButton title="Log in" onPress={onLogin} loading={loading} />
        <AppButton
          title="Create account"
          variant="ghost"
          onPress={() => navigation.navigate('Signup')}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 20, paddingTop: 80, backgroundColor: colors.background, flexGrow: 1 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 20 },
  error: { color: colors.danger, marginBottom: 12 },
});
