import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import api from '../services/api';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800';

export const SalonDetailScreen = ({ route, navigation }) => {
  const { salonId, salon: initialSalon } = route.params || {};
  const effectiveId = salonId || initialSalon?.id;

  const [salon, setSalon] = useState(initialSalon || null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(!initialSalon?.services);
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'staff' | 'hours' | 'reviews'

  useEffect(() => {
    const fetchFullDetails = async () => {
      if (!effectiveId) return;
      try {
        const [salonRes, reviewsRes] = await Promise.all([
          api.get(`/salons/${effectiveId}/`),
          api.get(`/reviews/?salon_id=${effectiveId}`).catch(() => ({ data: [] })),
        ]);

        if (salonRes.data) {
          setSalon(salonRes.data);
        }
        const revList =
          reviewsRes.data?.results ||
          reviewsRes.data?.data ||
          (Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
        setReviews(revList);
      } catch (err) {
        console.error('Failed to load salon details:', err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFullDetails();
  }, [effectiveId]);

  const handleBookService = (service) => {
    navigation.navigate('Booking', {
      salon: salon,
      service: service,
      salonId: effectiveId,
    });
  };

  if (loading && !salon) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#be185d" />
        <Text style={styles.loadingText}>Loading salon details...</Text>
      </View>
    );
  }

  if (!salon) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Salon not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const services = salon.services || [];
  const staff = salon.staff || [];
  const workingHours = salon.working_hours || [];

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#be185d" />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.heroImageWrapper}>
          <Image
            source={{ uri: salon.images?.[0]?.image || DEFAULT_IMAGE }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingNumber}>
                {salon.rating ? Number(salon.rating).toFixed(1) : '5.0'}
              </Text>
              <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
            </View>
          </View>
        </View>

        {/* Salon Header Card */}
        <View style={styles.infoCard}>
          <Text style={styles.salonTitle}>{salon.name}</Text>
          <Text style={styles.addressText}>
            📍 {salon.address}, {salon.city} {salon.state ? `, ${salon.state}` : ''}
          </Text>

          {salon.description ? (
            <Text style={styles.descText}>{salon.description}</Text>
          ) : null}

          {/* Quick contact pills */}
          <View style={styles.contactRow}>
            {salon.phone ? (
              <View style={styles.contactPill}>
                <Text style={styles.contactPillText}>📞 {salon.phone}</Text>
              </View>
            ) : null}
            {salon.email ? (
              <View style={styles.contactPill}>
                <Text style={styles.contactPillText}>✉️ {salon.email}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Segmented Tabs */}
        <View style={styles.tabsWrapper}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'services' && styles.tabBtnActive]}
            onPress={() => setActiveTab('services')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'services' && styles.tabBtnTextActive]}>
              Services ({services.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'staff' && styles.tabBtnActive]}
            onPress={() => setActiveTab('staff')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'staff' && styles.tabBtnTextActive]}>
              Stylists ({staff.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'hours' && styles.tabBtnActive]}
            onPress={() => setActiveTab('hours')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'hours' && styles.tabBtnTextActive]}>
              Hours
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'reviews' && styles.tabBtnActive]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'reviews' && styles.tabBtnTextActive]}>
              Reviews ({reviews.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentArea}>
          {/* 1. Services Tab */}
          {activeTab === 'services' && (
            <View style={styles.tabSection}>
              {services.length === 0 ? (
                <Text style={styles.emptyTabText}>No services listed for this salon yet.</Text>
              ) : (
                services.map((srv) => (
                  <View key={srv.id} style={styles.serviceCard}>
                    <View style={styles.serviceLeft}>
                      <View style={styles.serviceHeaderRow}>
                        <Text style={styles.serviceName}>{srv.name}</Text>
                        {srv.category_name ? (
                          <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{srv.category_name}</Text>
                          </View>
                        ) : null}
                      </View>

                      {srv.description ? (
                        <Text style={styles.serviceDesc} numberOfLines={2}>
                          {srv.description}
                        </Text>
                      ) : null}

                      <View style={styles.serviceMetaRow}>
                        <Text style={styles.durationText}>⏱ {srv.duration_minutes} mins</Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.servicePrice}>₹{srv.price}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.bookSmallBtn}
                      activeOpacity={0.8}
                      onPress={() => handleBookService(srv)}
                    >
                      <Text style={styles.bookSmallBtnText}>Book</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}

          {/* 2. Stylists / Staff Tab */}
          {activeTab === 'staff' && (
            <View style={styles.tabSection}>
              {staff.length === 0 ? (
                <Text style={styles.emptyTabText}>No stylists listed for this salon yet.</Text>
              ) : (
                staff.map((st) => (
                  <View key={st.id} style={styles.staffCard}>
                    <View style={styles.staffAvatar}>
                      <Text style={styles.staffAvatarText}>{st.name ? st.name[0] : 'S'}</Text>
                    </View>
                    <View style={styles.staffInfo}>
                      <Text style={styles.staffName}>{st.name}</Text>
                      <Text style={styles.staffSpec}>{st.specialization || 'Professional Stylist'}</Text>
                      <Text style={styles.staffExp}>
                        {st.experience_years ? `${st.experience_years} years experience` : 'Experienced'}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* 3. Working Hours Tab */}
          {activeTab === 'hours' && (
            <View style={styles.tabSection}>
              <View style={styles.hoursCard}>
                <Text style={styles.hoursCardTitle}>Weekly Opening Hours</Text>
                {workingHours.length === 0 ? (
                  <Text style={styles.emptyTabText}>Working hours not configured yet.</Text>
                ) : (
                  workingHours.map((wh) => (
                    <View key={wh.id} style={styles.hourRow}>
                      <Text style={styles.hourDay}>{wh.day_name || `Day ${wh.day_of_week}`}</Text>
                      {wh.is_open ? (
                        <Text style={styles.hourTime}>
                          {wh.opening_time?.substring(0, 5)} - {wh.closing_time?.substring(0, 5)}
                        </Text>
                      ) : (
                        <View style={styles.closedPill}>
                          <Text style={styles.closedPillText}>CLOSED</Text>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>
            </View>
          )}

          {/* 4. Reviews Tab */}
          {activeTab === 'reviews' && (
            <View style={styles.tabSection}>
              {reviews.length === 0 ? (
                <Text style={styles.emptyTabText}>No customer reviews yet. Be the first to review!</Text>
              ) : (
                reviews.map((rev) => (
                  <View key={rev.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>
                        {rev.customer?.full_name || rev.customer?.email || 'Verified Customer'}
                      </Text>
                      <View style={styles.reviewStars}>
                        <Text style={styles.starText}>{'★'.repeat(rev.rating || 5)}</Text>
                      </View>
                    </View>
                    {rev.comment ? <Text style={styles.reviewBody}>{rev.comment}</Text> : null}
                    <Text style={styles.reviewDate}>
                      {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recent'}
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      {services.length > 0 && (
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomPriceLabel}>Starting from</Text>
            <Text style={styles.bottomPrice}>₹{salon.starting_price || services[0]?.price || 350}</Text>
          </View>
          <TouchableOpacity
            style={styles.bottomBookBtn}
            onPress={() => handleBookService(services[0])}
          >
            <Text style={styles.bottomBookBtnText}>Book Appointment →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#be185d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  heroImageWrapper: {
    width: '100%',
    height: 220,
    backgroundColor: '#e2e8f0',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ratingBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  ratingStar: {
    color: '#fbbf24',
    fontSize: 14,
    marginRight: 4,
  },
  ratingNumber: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  reviewCount: {
    color: '#94a3b8',
    fontSize: 11,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  salonTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  addressText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
    marginBottom: 8,
  },
  descText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  contactPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  contactPillText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingHorizontal: 12,
  },
  tabBtn: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: 8,
  },
  tabBtnActive: {
    borderBottomColor: '#be185d',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  tabBtnTextActive: {
    color: '#be185d',
    fontWeight: 'bold',
  },
  tabContentArea: {
    padding: 16,
  },
  tabSection: {
    gap: 12,
  },
  emptyTabText: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 24,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  serviceLeft: {
    flex: 1,
    paddingRight: 12,
  },
  serviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  categoryBadge: {
    backgroundColor: '#fdf2f8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#be185d',
    fontWeight: '700',
  },
  serviceDesc: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 16,
  },
  serviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  dotSeparator: {
    color: '#cbd5e1',
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#be185d',
  },
  bookSmallBtn: {
    backgroundColor: '#be185d',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  bookSmallBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  staffCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  staffAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fce7f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  staffAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#be185d',
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  staffSpec: {
    fontSize: 12,
    color: '#be185d',
    fontWeight: '600',
    marginTop: 2,
  },
  staffExp: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  hoursCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  hoursCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  hourDay: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  hourTime: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
  },
  closedPill: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  closedPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 6,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  reviewStars: {
    flexDirection: 'row',
  },
  starText: {
    color: '#fbbf24',
    fontSize: 12,
  },
  reviewBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  reviewDate: {
    fontSize: 10,
    color: '#94a3b8',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomPriceLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  bottomBookBtn: {
    backgroundColor: '#be185d',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#be185d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  bottomBookBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
