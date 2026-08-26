import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Profile</Text>
      
      <View style={styles.box}>
        <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>Role: {user?.role || 'CUSTOMER'}</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          logout();
          navigation.navigate('Login');
        }}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 20 },
  box: { padding: 16, backgroundColor: '#f8fafc', borderRadius: 16, marginBottom: 24 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  email: { fontSize: 13, color: '#64748b', marginVertical: 4 },
  role: { fontSize: 12, fontWeight: 'bold', color: '#be185d' },
  logoutBtn: { backgroundColor: '#fff1f2', padding: 14, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#e11d48', fontWeight: 'bold' }
});
