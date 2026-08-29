import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';

export const BookingScreen = ({ route, navigation }) => {
  const { salon, service } = route.params;
  const [selectedStaff, setSelectedStaff] = useState(salon.staff?.[0] || null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (salon?.id && service?.id && selectedStaff?.id) {
      setLoading(true);
      api.get('/availability/', {
        params: {
          salon_id: salon.id,
          service_id: service.id,
          staff_id: selectedStaff.id,
          date: date
        }
      })
      .then((res) => {
        if (res.data.success) {
          setSlots(res.data.slots || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    }
  }, [selectedStaff, date]);

  const handleConfirm = async () => {
    if (!selectedSlot) {
      Alert.alert('Selection Error', 'Please select an available time slot.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/appointments/', {
        salon: salon.id,
        service: service.id,
        staff: selectedStaff.id,
        appointment_date: date,
        start_time: selectedSlot.start_time,
        notes: 'Customer Mobile Expo App'
      });

      if (res.data.success) {
        Alert.alert('Appointment Confirmed!', `Booked for ${date} at ${selectedSlot.display_time}`, [
          { text: 'View My Bookings', onPress: () => navigation.navigate('Main', { screen: 'MyBookings' }) }
        ]);
      }
    } catch (err) {
      Alert.alert('Booking Conflict', err.response?.data?.message || 'Slot no longer available.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Book Appointment</Text>
      <Text style={styles.sub}>{service.name} at {salon.name} (₹{service.price})</Text>

      {/* Select Staff */}
      <Text style={styles.label}>1. Select Stylist</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {salon.staff?.map((st) => (
          <TouchableOpacity
            key={st.id}
            style={[styles.chip, selectedStaff?.id === st.id && styles.chipActive]}
            onPress={() => setSelectedStaff(st)}
          >
            <Text style={[styles.chipText, selectedStaff?.id === st.id && styles.chipTextActive]}>{st.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Select Time Slots */}
      <Text style={styles.label}>2. Available Time Slots ({date})</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#be185d" />
      ) : (
        <View style={styles.slotsGrid}>
          {slots.map((slot, idx) => (
            <TouchableOpacity
              key={idx}
              disabled={!slot.available}
              style={[
                styles.slotBtn,
                !slot.available && styles.slotDisabled,
                selectedSlot?.start_time === slot.start_time && styles.slotActive
              ]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[
                styles.slotText,
                !slot.available && styles.slotTextDisabled,
                selectedSlot?.start_time === slot.start_time && styles.slotTextActive
              ]}>{slot.display_time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.confirmBtn, submitting && { opacity: 0.5 }]}
        disabled={submitting}
        onPress={handleConfirm}
      >
        <Text style={styles.confirmBtnText}>{submitting ? 'Booking...' : 'Confirm Appointment'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  sub: { fontSize: 13, color: '#be185d', fontWeight: '600', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderBottomWidth: 1, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 8 },
  chipActive: { backgroundColor: '#be185d', borderColor: '#be185d' },
  chipText: { fontSize: 13, color: '#334155' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  slotBtn: { width: '30%', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  slotDisabled: { backgroundColor: '#f1f5f9', borderColor: '#f1f5f9' },
  slotActive: { backgroundColor: '#be185d', borderColor: '#be185d' },
  slotText: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
  slotTextDisabled: { color: '#94a3b8', textDecorationLine: 'line-through' },
  slotTextActive: { color: '#fff' },
  confirmBtn: { backgroundColor: '#be185d', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
