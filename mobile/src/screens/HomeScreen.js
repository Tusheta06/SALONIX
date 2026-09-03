import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
} from 'react-native';
import api from '../services/api';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800';

export const HomeScreen = ({ navigation }) => {
  const [salons, setSalons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/');
      const list = res.data.results || res.data.data || (Array.isArray(res.data) ? res.data : []);
      setCategories(list);
    } catch (err) {
      console.log('Error fetching categories:', err?.message);
    }
  };

  const fetchSalons = useCallback(async () => {
    try {
      let url = '/salons/';
      const params = [];
      if (search.trim()) {
        params.push(`search=${encodeURIComponent(search.trim())}`);
      }
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const res = await api.get(url);
      const list = res.data.results || res.data.data || (Array.isArray(res.data) ? res.data : []);
      setSalons(list);
    } catch (err) {
      console.error('Error fetching salons:', err?.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSalons();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [fetchSalons]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
    fetchSalons();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#be185d" />

      {/* Header Banner */}
      <View style={styles.header}>
        <Text style={styles.appName}>Salonix</Text>
        <Text style={styles.subtitle}>Discover top salons & book appointments</Text>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by salon name, city or area..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories Horizontal Filter */}
      {categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === null && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === null && styles.categoryChipTextActive,
                ]}
              >
                All Salons
              </Text>
            </TouchableOpacity>

            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => {
                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                  if (selectedCategory !== cat.id) {
                    setSearch(cat.name);
                  } else {
                    setSearch('');
                  }
                }}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === cat.id && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Salon List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#be185d" />
          <Text style={styles.loadingText}>Finding nearby salons...</Text>
        </View>
      ) : (
        <FlatList
          data={salons}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#be185d']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No salons found</Text>
              <Text style={styles.emptySub}>
                {search ? `No salons matching "${search}"` : 'No approved salons available right now.'}
              </Text>
              {search ? (
                <TouchableOpacity style={styles.resetBtn} onPress={() => setSearch('')}>
                  <Text style={styles.resetBtnText}>Clear Search</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('SalonDetail', { salonId: item.id, salon: item })}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.images?.[0]?.image || DEFAULT_IMAGE }}
                  style={styles.cardImage}
                />
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingNumber}>
                    {item.rating ? Number(item.rating).toFixed(1) : '5.0'}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.salonName}>{item.name}</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  📍 {item.address}, {item.city}
                </Text>

                {item.description ? (
                  <Text style={styles.descText} numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.priceLabel}>Starting from</Text>
                    <Text style={styles.priceValue}>₹{item.starting_price || 350}</Text>
                  </View>

                  <View style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>View Services →</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#be185d',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  appName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#fce7f3',
    marginTop: 2,
    marginBottom: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    paddingVertical: 8,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#be185d',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrapper: {
    width: '100%',
    height: 160,
    backgroundColor: '#e2e8f0',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingStar: {
    color: '#fbbf24',
    fontSize: 12,
    marginRight: 4,
  },
  ratingNumber: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 16,
  },
  salonName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  locationText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 6,
  },
  descText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  priceLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#be185d',
  },
  viewBtn: {
    backgroundColor: '#fdf2f8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fbcfe8',
  },
  viewBtnText: {
    color: '#be185d',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  emptySub: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
    textAlign: 'center',
  },
  resetBtn: {
    marginTop: 16,
    backgroundColor: '#be185d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
