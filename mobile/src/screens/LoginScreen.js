import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('customer@salonix.demo');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Check credentials');
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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#be185d', textAlign: 'center' },
  sub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24 },
  input: { borderBottomWidth: 1, borderColor: '#cbd5e1', paddingVertical: 10, fontSize: 15, marginBottom: 16 },
  btn: { backgroundColor: '#be185d', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
