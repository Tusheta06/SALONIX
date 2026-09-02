import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState('customer@salonix.demo');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (route?.params?.prefillEmail) {
      setEmail(route.params.prefillEmail);
      setPassword('');
    }
  }, [route?.params?.prefillEmail]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigation.navigate('Main', { screen: 'HomeTab' });
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salonix Mobile</Text>
      <Text style={styles.sub}>Sign in to your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#be185d', textAlign: 'center' },
  sub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24 },
  input: { borderBottomWidth: 1, borderColor: '#cbd5e1', paddingVertical: 10, fontSize: 15, marginBottom: 16 },
  btn: { backgroundColor: '#be185d', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  linkText: {
    color: '#be185d',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

