import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

export const SalonDetailScreen = ({ route, navigation }) => {
  const { salon } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: salon.images?.[0]?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500' }}
        style={styles.heroImage}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{salon.name}</Text>
        <Text style={styles.rating}>Rating: ★ {salon.rating}</Text>
        <Text style={styles.address}>{salon.address}, {salon.city}</Text>
        <Text style={styles.desc}>{salon.description}</Text>

        <Text style={styles.sectionHeader}>Available Services</Text>
        {salon.services?.map((srv) => (
          <View key={srv.id} style={styles.serviceRow}>
            <View>
              <Text style={styles.serviceName}>{srv.name}</Text>
              <Text style={styles.serviceMeta}>{srv.duration_minutes} mins • ₹{srv.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => navigation.navigate('Booking', { salon, service: srv })}
            >
              <Text style={styles.bookBtnText}>Book</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroImage: { width: '100%', height: 200 },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  rating: { color: '#d97706', fontWeight: 'bold', marginVertical: 4 },
  address: { fontSize: 13, color: '#64748b' },
  desc: { fontSize: 13, color: '#334155', marginVertical: 12, lineHeight: 18 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginTop: 16, marginBottom: 12 },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  serviceName: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  serviceMeta: { fontSize: 12, color: '#be185d', fontWeight: '600' },
  bookBtn: { backgroundColor: '#be185d', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
