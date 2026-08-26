import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { RatingStars } from '../../components/ui/RatingStars';
import { Search, MapPin, Filter, Star, Sparkles, SlidersHorizontal } from 'lucide-react';

export const SalonDiscovery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [salons, setSalons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const search = searchParams.get('search') || '';
  const city = searchParams.get('city') || '';
  const categoryId = searchParams.get('category_id') || '';
  const minRating = searchParams.get('min_rating') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories/');
        setCategories(res.data.results || res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (city) params.set('city', city);
        if (categoryId) params.set('category_id', categoryId);
        if (minRating) params.set('min_rating', minRating);

        const res = await api.get(`/salons/?${params.toString()}`);
        setSalons(res.data.results || res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Discover Salons & Beauty Lounges</h1>
        <p className="text-gray-500 mt-1">Book top-rated salons, hair studios, and spa centers with instant online booking</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Search text */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search salon name..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* City */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="City (Mumbai, Delhi...)"
              value={city}
              onChange={(e) => updateParam('city', e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={categoryId}
              onChange={(e) => updateParam('category_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Rating filter */}
          <div>
            <select
              value={minRating}
              onChange={(e) => updateParam('min_rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 bg-white"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5★ & above</option>
              <option value="4.0">4.0★ & above</option>
              <option value="3.5">3.5★ & above</option>
            </select>
          </div>

        </div>
      </div>

      {/* Salons List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"></div>
          ))}
        </div>
      ) : salons.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center space-y-4 border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="text-xl font-bold text-gray-900">No salons found</h3>
          <p className="text-gray-500 text-sm">Try relaxing your search terms or selecting another city filter.</p>
          <button
            onClick={() => setSearchParams(new URLSearchParams())}
            className="bg-pink-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-pink-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {salons.map((salon) => (
            <div key={salon.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group">
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={salon.images?.[0]?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'}
                  alt={salon.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow">
                  <RatingStars rating={salon.rating} showNumber={true} />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition">
                    {salon.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
                    <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
                    <span>{salon.address}, {salon.city}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                    {salon.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block">Starting from</span>
                    <span className="text-lg font-bold text-slate-900">₹{salon.starting_price || 350}</span>
                  </div>

                  <Link
                    to={`/salons/${salon.id}`}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-xl transition text-sm shadow-md shadow-pink-200"
                  >
                    View Salon
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
