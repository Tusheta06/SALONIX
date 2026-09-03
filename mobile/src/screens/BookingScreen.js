import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import api from '../services/api';

export const BookingScreen = ({ route, navigation }) => {
  const { salon: initialSalon, service: initialService, salonId } = route.params || {};
  const effectiveSalonId = salonId || initialSalon?.id;

  const [salon, setSalon] = useState(initialSalon || null);
  const [loadingSalon, setLoadingSalon] = useState(!initialSalon?.services || !initialSalon?.staff);

  const [selectedService, setSelectedService] = useState(initialService || null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Generate next 14 days dates list
  const dateList = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      list.push({ iso, dayName, monthDay });
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState(dateList[0]?.iso || new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotMessage, setSlotMessage] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const isSubmitting = useRef(false);

  // Fetch full salon data if services or staff are missing
  useEffect(() => {
    const fetchSalon = async () => {
      if (!effectiveSalonId) return;
      try {
        const res = await api.get(`/salons/${effectiveSalonId}/`);
        if (res.data) {
          setSalon(res.data);
          if (!selectedService && res.data.services?.length > 0) {
            setSelectedService(res.data.services[0]);
          }
          if (res.data.staff?.length > 0) {
            setSelectedStaff(res.data.staff[0]);
          }
        }
      } catch (err) {
        console.error('Failed fetching salon in booking screen:', err?.message);
      } finally {
        setLoadingSalon(false);
      }
    };

    if (loadingSalon) {
      fetchSalon();
    } else if (salon?.staff?.length > 0 && !selectedStaff) {
      setSelectedStaff(salon.staff[0]);
    }
  }, [effectiveSalonId, loadingSalon]);

  // When salon is loaded, set initial staff if not set
  useEffect(() => {
    if (salon?.staff?.length > 0 && !selectedStaff) {
      setSelectedStaff(salon.staff[0]);
    }
    if (salon?.services?.length > 0 && !selectedService) {
      setSelectedService(salon.services[0]);
    }
  }, [salon]);

  // Fetch availability slots when salon, service, staff, or date changes
  useEffect(() => {
    if (effectiveSalonId && selectedService?.id && selectedStaff?.id && selectedDate) {
      setLoadingSlots(true);
      setSelectedSlot(null);
      setSlotMessage('');

      api
        .get('/availability/', {
          params: {
            salon_id: effectiveSalonId,
            service_id: selectedService.id,
            staff_id: selectedStaff.id,
            date: selectedDate,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setSlots(res.data.slots || []);
            setSlotMessage(res.data.message || '');
          } else {
            setSlots([]);
            setSlotMessage(res.data.message || 'No available slots');
          }
        })
        .catch((err) => {
          setSlots([]);
          setSlotMessage('Failed to load slots for this date.');
          console.log('Slots fetch error:', err?.message);
        })
        .finally(() => setLoadingSlots(false));
    }
  }, [effectiveSalonId, selectedService?.id, selectedStaff?.id, selectedDate]);

  const handleConfirmBooking = async () => {
    if (isSubmitting.current || submitting) return;

    if (!selectedService) {
      Alert.alert('Selection Error', 'Please select a service.');
      return;
    }
    if (!selectedStaff) {
      Alert.alert('Selection Error', 'Please select a stylist.');
      return;
    }
    if (!selectedSlot) {
      Alert.alert('Selection Error', 'Please select an available time slot.');
      return;
    }

    isSubmitting.current = true;
    setSubmitting(true);

    try {
      const res = await api.post('/appointments/', {
        salon: effectiveSalonId,
        service: selectedService.id,
        staff: selectedStaff.id,
        appointment_date: selectedDate,
        start_time: selectedSlot.start_time,
        notes: notes.trim() || 'Booked via Mobile App',
      });

      if (res.data.success) {
        setBookingSuccess(res.data.data);
      } else {
        Alert.alert('Booking Error', res.data.message || 'Could not schedule appointment.');
        isSubmitting.current = false;
        setSubmitting(false);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'The selected slot may have just been booked. Please choose another slot.';
      Alert.alert('Booking Failed', msg);
      isSubmitting.current = false;
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (bookingSuccess) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <ScrollView contentContainerStyle={styles.successScroll}>
          <View style={styles.successIconBox}>
            <Text style={styles.successCheck}>✓</Text>
          </View>

          <Text style={styles.successTitle}>Appointment Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your appointment has been successfully scheduled.
          </Text>

          {/* Receipt Card */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Appointment ID</Text>
              <Text style={styles.receiptValue}>#{bookingSuccess.id}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Salon</Text>
              <Text style={styles.receiptValue}>{bookingSuccess.salon?.name || salon?.name}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Service</Text>
              <Text style={styles.receiptValue}>{bookingSuccess.service?.name || selectedService?.name}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Stylist</Text>
              <Text style={styles.receiptValue}>{bookingSuccess.staff?.name || selectedStaff?.name}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Date & Time</Text>
              <Text style={styles.receiptTimeHighlight}>
                {bookingSuccess.appointment_date} @ {bookingSuccess.start_time || selectedSlot?.display_time}
              </Text>
            </View>
            <View style={[styles.receiptRow, styles.receiptTotalRow]}>
              <Text style={styles.receiptTotalLabel}>Total Price</Text>
              <Text style={styles.receiptTotalValue}>₹{bookingSuccess.price || selectedService?.price}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Main', { screen: 'MyBookings' })}
          >
            <Text style={styles.primaryBtnText}>View My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
          >
            <Text style={styles.secondaryBtnText}>Discover More Salons</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (loadingSalon) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#be185d" />
        <Text style={styles.loadingText}>Preparing booking options...</Text>
      </View>
    );
  }

  const services = salon?.services || [];
  const staffList = salon?.staff || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#be185d" />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header Summary */}
        <View style={styles.headerBox}>
          <Text style={styles.salonHeading}>{salon?.name || 'Salon Booking'}</Text>
          <Text style={styles.salonSubHeading}>
            📍 {salon?.address}, {salon?.city}
          </Text>
        </View>

        {/* STEP 1: Select Service */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Select Service</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalPills}>
            {services.map((srv) => {
              const isSelected = selectedService?.id === srv.id;
              return (
                <TouchableOpacity
                  key={srv.id}
                  style={[styles.servicePill, isSelected && styles.servicePillActive]}
                  onPress={() => setSelectedService(srv)}
                >
                  <Text style={[styles.servicePillName, isSelected && styles.servicePillNameActive]}>
                    {srv.name}
                  </Text>
                  <Text style={[styles.servicePillMeta, isSelected && styles.servicePillMetaActive]}>
                    {srv.duration_minutes}m • ₹{srv.price}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* STEP 2: Select Stylist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Select Stylist</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalPills}>
            {staffList.map((st) => {
              const isSelected = selectedStaff?.id === st.id;
              return (
                <TouchableOpacity
                  key={st.id}
                  style={[styles.staffPill, isSelected && styles.staffPillActive]}
                  onPress={() => setSelectedStaff(st)}
                >
                  <View style={[styles.staffAvatarSmall, isSelected && styles.staffAvatarSmallActive]}>
                    <Text style={[styles.staffAvatarInitial, isSelected && styles.staffAvatarInitialActive]}>
                      {st.name ? st.name[0] : 'S'}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.staffPillName, isSelected && styles.staffPillNameActive]}>
                      {st.name}
                    </Text>
                    <Text style={[styles.staffPillSpec, isSelected && styles.staffPillSpecActive]}>
                      {st.specialization || 'Stylist'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* STEP 3: Select Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalPills}>
            {dateList.map((item) => {
              const isSelected = selectedDate === item.iso;
              return (
                <TouchableOpacity
                  key={item.iso}
                  style={[styles.dateCard, isSelected && styles.dateCardActive]}
                  onPress={() => setSelectedDate(item.iso)}
                >
                  <Text style={[styles.dateDayName, isSelected && styles.dateDayNameActive]}>
                    {item.dayName}
                  </Text>
                  <Text style={[styles.dateMonthDay, isSelected && styles.dateMonthDayActive]}>
                    {item.monthDay}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* STEP 4: Select Available Time Slot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Available Time Slots</Text>

          {loadingSlots ? (
            <View style={styles.slotsLoadingBox}>
              <ActivityIndicator size="small" color="#be185d" />
              <Text style={styles.slotsLoadingText}>Checking live availability...</Text>
            </View>
          ) : slots.length === 0 ? (
            <View style={styles.noSlotsBox}>
              <Text style={styles.noSlotsText}>
                {slotMessage || 'No slots available for this date/stylist.'}
              </Text>
              <Text style={styles.noSlotsSub}>Please choose another date or stylist.</Text>
            </View>
          ) : (
            <View style={styles.slotsGrid}>
              {slots.map((slot, idx) => {
                const isSelected = selectedSlot?.start_time === slot.start_time;
                const isAvailable = slot.available;

                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={!isAvailable}
                    style={[
                      styles.slotBtn,
                      !isAvailable && styles.slotBtnDisabled,
                      isSelected && styles.slotBtnActive,
                    ]}
                    onPress={() => setSelectedSlot(slot)}
                  >
                    <Text
                      style={[
                        styles.slotBtnText,
                        !isAvailable && styles.slotBtnTextDisabled,
                        isSelected && styles.slotBtnTextActive,
                      ]}
                    >
                      {slot.display_time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* STEP 5: Special Notes (Optional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Special Requests (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="e.g., hair wash preference, specific style ideas..."
            placeholderTextColor="#94a3b8"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* STEP 6: Booking Summary Card */}
        {selectedService && selectedStaff && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryHeading}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service</Text>
              <Text style={styles.summaryValue}>{selectedService.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Stylist</Text>
              <Text style={styles.summaryValue}>{selectedStaff.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date & Time</Text>
              <Text style={styles.summaryTimeText}>
                {selectedDate} {selectedSlot ? `@ ${selectedSlot.display_time}` : '(Select slot above)'}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotalRow]}>
              <Text style={styles.summaryTotalLabel}>Total Price</Text>
              <Text style={styles.summaryTotalPrice}>₹{selectedService.price}</Text>
            </View>
          </View>
        )}

        {/* Confirm Booking Button */}
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            (!selectedSlot || submitting) && styles.confirmBtnDisabled,
          ]}
          disabled={!selectedSlot || submitting}
          onPress={handleConfirmBooking}
        >
          {submitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.confirmBtnText}>
              {selectedSlot ? 'Confirm & Book Appointment' : 'Select Time Slot Above'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
  },
  headerBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  salonHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  salonSubHeading: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
  },
  horizontalPills: {
    gap: 8,
    paddingRight: 8,
  },
  servicePill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 140,
  },
  servicePillActive: {
    backgroundColor: '#fdf2f8',
    borderColor: '#be185d',
    borderWidth: 2,
  },
  servicePillName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  servicePillNameActive: {
    color: '#be185d',
  },
  servicePillMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '600',
  },
  servicePillMetaActive: {
    color: '#be185d',
  },
  staffPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  staffPillActive: {
    backgroundColor: '#fdf2f8',
    borderColor: '#be185d',
    borderWidth: 2,
  },
  staffAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  staffAvatarSmallActive: {
    backgroundColor: '#fce7f3',
  },
  staffAvatarInitial: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
  staffAvatarInitialActive: {
    color: '#be185d',
  },
  staffPillName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
  staffPillNameActive: {
    color: '#be185d',
  },
  staffPillSpec: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  staffPillSpecActive: {
    color: '#be185d',
  },
  dateCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    minWidth: 70,
  },
  dateCardActive: {
    backgroundColor: '#be185d',
    borderColor: '#be185d',
  },
  dateDayName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  dateDayNameActive: {
    color: '#fce7f3',
  },
  dateMonthDay: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 2,
  },
  dateMonthDayActive: {
    color: '#ffffff',
  },
  slotsLoadingBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  slotsLoadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748b',
  },
  noSlotsBox: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: 16,
    borderRadius: 14,
  },
  noSlotsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400e',
    textAlign: 'center',
  },
  noSlotsSub: {
    fontSize: 11,
    color: '#b45309',
    textAlign: 'center',
    marginTop: 4,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotBtn: {
    width: '31%',
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  slotBtnActive: {
    backgroundColor: '#be185d',
    borderColor: '#be185d',
  },
  slotBtnDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#f1f5f9',
  },
  slotBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  slotBtnTextActive: {
    color: '#ffffff',
  },
  slotBtnTextDisabled: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  notesInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: '#0f172a',
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fbcfe8',
    backgroundColor: '#fdf2f8',
    marginBottom: 20,
    gap: 8,
  },
  summaryHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#be185d',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  summaryTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#be185d',
  },
  summaryTotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#fbcfe8',
    marginTop: 4,
  },
  summaryTotalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  summaryTotalPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#be185d',
  },
  confirmBtn: {
    backgroundColor: '#be185d',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#be185d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmBtnDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  successScroll: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successCheck: {
    fontSize: 40,
    color: '#16a34a',
    fontWeight: '900',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
    gap: 10,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  receiptValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  receiptTimeHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: '#be185d',
  },
  receiptTotalRow: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    marginTop: 4,
  },
  receiptTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  receiptTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#be185d',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#be185d',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
});
