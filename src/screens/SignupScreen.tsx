import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Switch } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { AppButton } from '../components/AppButton';
import { AppTextField } from '../components/AppTextField';
import { registerWithEmail } from '../services/authService';
import { colors } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../firebase/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const { firebaseConfigured } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function onSignup() {
    setError(undefined);
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Enter name, email, and password (min 6 characters).');
      return;
    }
    if (!firebaseConfigured) {
      setError('Firebase is not configured. Copy .env.example to .env and add keys.');
      return;
    }
    setLoading(true);
    try {
      await registerWithEmail(email, password, name, role, phone);
      navigation.replace('MainTabs');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Signup failed');
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
        <Text style={styles.title}>Create account</Text>
        <AppTextField label="Full name" value={name} onChangeText={setName} />
        <AppTextField
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <AppTextField label="Phone (optional)" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
        <AppTextField label="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <View style={styles.row}>
          <Text style={styles.roleLabel}>Register as mechanic / garage admin</Text>
          <Switch value={role === 'mechanic'} onValueChange={(v) => setRole(v ? 'mechanic' : 'customer')} />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <AppButton title="Sign up" onPress={onSignup} loading={loading} />
        <AppButton title="Back to login" variant="ghost" onPress={() => navigation.goBack()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 20, paddingTop: 60, backgroundColor: colors.background, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  roleLabel: { flex: 1, marginRight: 12, color: colors.text, fontWeight: '600' },
  error: { color: colors.danger, marginBottom: 12 },
});
