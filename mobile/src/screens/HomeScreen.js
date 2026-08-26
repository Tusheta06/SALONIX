import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import api from '../services/api';

export const HomeScreen = ({ navigation }) => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await api.get(`/salons/?search=${search}`);
        setSalons(res.data.results || res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, [search]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Salonix Mobile</Text>
        <Text style={styles.subtitle}>Discover salons & book appointments</Text>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search salon or city..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={salons}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('SalonDetail', { salon: item })}
            >
              <Image
                source={{ uri: item.images?.[0]?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500' }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.salonName}>{item.name}</Text>
                  <Text style={styles.rating}>★ {item.rating}</Text>
                </View>
                <Text style={styles.location}>{item.address}, {item.city}</Text>
                <Text style={styles.price}>Starting from ₹{item.starting_price || 350}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, paddingTop: 50, backgroundColor: '#db2777' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 13, color: '#fbcfe8', marginBottom: 12 },
  searchInput: { backgroundColor: '#fff', padding: 10, borderRadius: 10, fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9' },
  cardImage: { width: '100%', height: 140 },
  cardContent: { padding: 14 },
  salonName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  rating: { fontWeight: 'bold', color: '#d97706' },
  location: { fontSize: 12, color: '#64748b', marginVertical: 4 },
  price: { fontSize: 14, fontWeight: 'bold', color: '#be185d' },
});
