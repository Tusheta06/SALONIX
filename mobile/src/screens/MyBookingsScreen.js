import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';

export const MyBookingsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/appointments/');
      setAppointments(res.data.results || res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = (id) => {
    Alert.alert('Cancel Appointment', 'Are you sure?', [
      { text: 'No' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.post(`/appointments/${id}/cancel/`);
            fetchBookings();
          } catch (err) {
            Alert.alert('Error', 'Failed to cancel');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Appointments</Text>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justify: 'space-between' }}>
              <Text style={styles.salonName}>{item.salon?.name}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>

            <Text style={styles.service}>{item.service?.name} • ₹{item.price}</Text>
            <Text style={styles.datetime}>{item.appointment_date} @ {item.start_time} (Stylist: {item.staff?.name})</Text>

            {['PENDING', 'CONFIRMED'].includes(item.status) && (
              <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.id)}>
                <Text style={styles.cancelBtnText}>Cancel Booking</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', paddingHorizontal: 16, marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  salonName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  status: { fontSize: 11, fontWeight: 'bold', color: '#be185d', backgroundColor: '#fce7f3', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  service: { fontSize: 13, fontWeight: 'bold', color: '#be185d', marginVertical: 4 },
  datetime: { fontSize: 12, color: '#64748b' },
  cancelBtn: { marginTop: 10, alignSelf: 'flex-start', backgroundColor: '#fff1f2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  cancelBtnText: { color: '#e11d48', fontSize: 12, fontWeight: 'bold' }
});
