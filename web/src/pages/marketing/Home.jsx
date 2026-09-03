import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { RatingStars } from '../../components/ui/RatingStars';
import { Search, MapPin, Sparkles, Calendar, ShieldCheck, Clock, Award, ArrowRight, Smartphone, Star, QrCode } from 'lucide-react';

export const Home = () => {
  const [salons, setSalons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salonsRes, catRes] = await Promise.all([
          api.get('/salons/'),
          api.get('/categories/')
        ]);

        const salonsList = salonsRes.data.results || salonsRes.data.data || [];
        const catList = catRes.data.results || catRes.data.data || [];

        setSalons(salonsList.slice(0, 6));
        setCategories(catList.slice(0, 8));
      } catch (err) {
        console.error('Failed loading home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (cityQuery) params.set('city', cityQuery);
    navigate(`/salons?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-900 via-purple-900 to-slate-900 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          
          <div className="inline-flex items-center space-x-2 bg-pink-500/20 border border-pink-400/30 px-4 py-1.5 rounded-full text-pink-300 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Discover Top-Rated Beauty Professionals Near You</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Your next beauty appointment is <br />
            <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              just a few clicks away.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-light">
            Book haircuts, luxury facials, balayage coloring, spa massages, and bridal makeovers with instant real-time slot confirmation.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="bg-white p-3 rounded-2xl shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-3 border border-gray-100 text-gray-800">
            <div className="flex items-center space-x-3 px-4 py-2 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search Salon or Service (e.g. Haircut, Facial)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm font-medium text-gray-800 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center space-x-3 px-4 py-2 w-full md:w-1/3">
              <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="City (Mumbai, Delhi, Pune...)"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm font-medium text-gray-800 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-pink-600/30 transition duration-200 flex items-center justify-center space-x-2"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Key Trust Stats */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-center border-t border-slate-800 text-slate-300 text-sm font-medium">
            <div><span className="text-white font-bold text-lg block">500+</span> Verified Salons</div>
            <div><span className="text-white font-bold text-lg block">1,200+</span> Expert Stylists</div>
            <div><span className="text-white font-bold text-lg block">4.9/5</span> Rating Average</div>
            <div><span className="text-white font-bold text-lg block">100%</span> Real Availability</div>
          </div>

        </div>
      </section>

      {/* Featured Salons Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Salons & Studios</h2>
            <p className="text-gray-600 mt-1">Explore top-rated luxury lounges handpicked for quality and comfort</p>
          </div>
          <Link to="/salons" className="text-pink-600 font-semibold hover:text-pink-700 flex items-center space-x-1">
            <span>View All Salons</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"></div>
            ))}
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
                      className="bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white font-semibold px-4 py-2 rounded-xl transition text-sm"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Categories */}
      <section className="bg-slate-100/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore by Category</h2>
            <p className="text-gray-600 mt-2">Find dedicated beauty specialists for your specific style requirements</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/salons?category_id=${cat.id}`}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-300 transition text-center space-y-3 group"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white flex items-center justify-center transition duration-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-800 text-base group-hover:text-pink-600 transition">{cat.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{cat.description || 'Professional beauty services'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900">How Salonix Works</h2>
          <p className="text-gray-600 mt-2">Booking your favorite salon service takes less than 60 seconds</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-pink-100 text-pink-600 font-extrabold text-2xl rounded-2xl flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900">Discover Salons</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Browse top salons, read verified customer reviews, compare services, transparent pricing, and view stylist profiles.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 font-extrabold text-2xl rounded-2xl flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900">Pick Real Time Slots</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Select your preferred stylist, date, and live available time slots dynamically calculated by our availability engine.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 font-extrabold text-2xl rounded-2xl flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900">Instant Confirmation</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Receive immediate appointment confirmation with zero waiting or double booking locks. Manage or cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile App CTA Section */}
      <section className="bg-slate-900 text-white rounded-3xl mx-4 sm:mx-8 p-10 md:p-16 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-pink-500/20 text-pink-300 text-xs font-semibold px-3 py-1 rounded-full border border-pink-500/30">
              <Smartphone className="w-4 h-4" />
              <span>Available on iOS & Android</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
              Get the Salonix Mobile App
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Book on the go, receive live appointment notifications, rebook past stylists, and access mobile-exclusive beauty rewards.
            </p>

            <div className="space-y-5 pt-2">
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-sm font-semibold flex items-center space-x-3">
                  <Smartphone className="w-6 h-6 text-pink-400" />
                  <div>
                    <div className="text-xs text-slate-400">Download for</div>
                    <div className="text-white font-bold">Expo / Android</div>
                  </div>
                </div>
              </div>

              {/* OR Divider */}
              <div className="flex items-center space-x-4 max-w-xs">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">OR</span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* QR Code Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-bold text-pink-300">
                  <QrCode className="w-4 h-4 text-pink-400" />
                  <span>Scan QR Code to Open</span>
                </div>

                <div className="inline-block bg-white p-3.5 rounded-2xl shadow-2xl border border-white/20">
                  <img
                    src="/salonix-mobile-qr.png"
                    alt="Scan QR Code to open Salonix Mobile App"
                    className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-xl"
                  />
                </div>

                <p className="text-xs text-slate-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                  <span>Open your camera and scan to open Salonix Mobile App</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 p-6 sm:p-8 rounded-3xl shadow-2xl text-white max-w-sm w-full space-y-5 border border-white/10 relative">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-pink-200" />
                  <span className="font-bold text-base">Salonix Mobile</span>
                </div>
                <span className="bg-white text-pink-600 text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-sm">Expo Live</span>
              </div>
              <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl space-y-2 border border-white/10">
                <div className="text-xs text-pink-200 font-medium">Upcoming Booking</div>
                <div className="font-bold text-sm">Luxe & Glow Lounge</div>
                <div className="text-xs text-slate-200">Royal Haircut & Style • 11:00 AM</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-200">Dynamic Slot Engine</span>
                <span className="font-semibold text-pink-200">Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
