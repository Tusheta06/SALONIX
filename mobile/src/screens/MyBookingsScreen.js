import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import api from '../services/api';

export const MyBookingsScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('upcoming'); // 'upcoming' | 'past'

  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get('/appointments/');
      const list = res.data.results || res.data.data || (Array.isArray(res.data) ? res.data : []);
      setAppointments(list);
    } catch (err) {
      console.error('Error fetching bookings:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Re-fetch when screen gains focus
  useEffect(() => {
    const unsubscribe = navigation?.addListener?.('focus', () => {
      fetchBookings();
    });
    return unsubscribe;
  }, [navigation, fetchBookings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleCancel = (appointmentId) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'Keep Appointment', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await api.post(`/appointments/${appointmentId}/cancel/`);
              if (res.data.success || res.status === 200) {
                Alert.alert('Appointment Cancelled', 'Your booking has been cancelled successfully.');
                fetchBookings();
              } else {
                Alert.alert('Cancellation Error', res.data.message || 'Failed to cancel.');
              }
            } catch (err) {
              const msg = err.response?.data?.message || err.response?.data?.detail || 'Failed to cancel appointment.';
              Alert.alert('Error', msg);
            }
          },
        },
      ]
    );
  };

  const upcomingList = appointments.filter((apt) => ['PENDING', 'CONFIRMED'].includes(apt.status));
  const pastList = appointments.filter((apt) => ['COMPLETED', 'CANCELLED'].includes(apt.status));
  const displayList = activeFilter === 'upcoming' ? upcomingList : pastList;

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return { bg: '#dcfce7', text: '#15803d', label: 'CONFIRMED' };
      case 'PENDING':
        return { bg: '#fef3c7', text: '#b45309', label: 'PENDING' };
      case 'COMPLETED':
        return { bg: '#e0f2fe', text: '#0369a1', label: 'COMPLETED' };
      case 'CANCELLED':
        return { bg: '#fee2e2', text: '#b91c1c', label: 'CANCELLED' };
      default:
        return { bg: '#f1f5f9', text: '#475569', label: status };
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#be185d" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>View and manage your appointments</Text>

        {/* Filter Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeFilter === 'upcoming' && styles.toggleBtnActive]}
            onPress={() => setActiveFilter('upcoming')}
          >
            <Text style={[styles.toggleBtnText, activeFilter === 'upcoming' && styles.toggleBtnTextActive]}>
              Upcoming ({upcomingList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, activeFilter === 'past' && styles.toggleBtnActive]}
            onPress={() => setActiveFilter('past')}
          >
            <Text style={[styles.toggleBtnText, activeFilter === 'past' && styles.toggleBtnTextActive]}>
              Past / Cancelled ({pastList.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bookings List */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#be185d" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      ) : (
        <FlatList
          data={displayList}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#be185d']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                {activeFilter === 'upcoming' ? 'No Upcoming Appointments' : 'No Past Bookings'}
              </Text>
              <Text style={styles.emptySub}>
                {activeFilter === 'upcoming'
                  ? 'Book a service at top-rated salons nearby.'
                  : 'Your completed or cancelled appointments will appear here.'}
              </Text>
              {activeFilter === 'upcoming' && (
                <TouchableOpacity
                  style={styles.bookNowBtn}
                  onPress={() => navigation.navigate('HomeTab')}
                >
                  <Text style={styles.bookNowBtnText}>Discover Salons</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          renderItem={({ item }) => {
            const statusBadge = getStatusBadgeStyle(item.status);
            const canCancel = ['PENDING', 'CONFIRMED'].includes(item.status);

            return (
              <View style={styles.bookingCard}>
                {/* Header Row */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.salonName}>{item.salon?.name || 'Salon'}</Text>
                    <Text style={styles.salonLocation}>
                      📍 {item.salon?.address || ''}{item.salon?.city ? `, ${item.salon.city}` : ''}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                    <Text style={[styles.statusText, { color: statusBadge.text }]}>
                      {statusBadge.label}
                    </Text>
                  </View>
                </View>

                {/* Details Section */}
                <View style={styles.detailsBox}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Service</Text>
                    <Text style={styles.detailValueBold}>{item.service?.name || 'Service'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Stylist</Text>
                    <Text style={styles.detailValue}>{item.staff?.name || 'Any Stylist'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date & Time</Text>
                    <Text style={styles.dateTimeHighlight}>
                      📅 {item.appointment_date} @ {item.start_time}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount</Text>
                    <Text style={styles.priceHighlight}>₹{item.price}</Text>
                  </View>

                  {item.notes && item.notes !== 'Customer Mobile Expo App' ? (
                    <View style={styles.notesRow}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesText}>{item.notes}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Cancel Action */}
                {canCancel && (
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => handleCancel(item.id)}
                    >
                      <Text style={styles.cancelBtnText}>Cancel Booking</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#be185d',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#fce7f3',
    marginTop: 2,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#ffffff',
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  toggleBtnTextActive: {
    color: '#be185d',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  salonName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  salonLocation: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  detailsBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  detailValueBold: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '800',
  },
  dateTimeHighlight: {
    fontSize: 13,
    color: '#be185d',
    fontWeight: '800',
  },
  priceHighlight: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
  },
  notesRow: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  notesLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: 'bold',
  },
  notesText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  cardActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cancelBtnText: {
    color: '#e11d48',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  emptySub: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  bookNowBtn: {
    backgroundColor: '#be185d',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  bookNowBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
