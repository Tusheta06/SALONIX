import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useBooking } from '../../context/BookingContext';
import { RatingStars } from '../../components/ui/RatingStars';
import { MapPin, Phone, Mail, Clock, Calendar, Scissors, UserCheck, Star, ArrowRight } from 'lucide-react';

export const SalonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBooking();

  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    const fetchSalonDetail = async () => {
      setLoading(true);
      try {
        const [salonRes, reviewsRes] = await Promise.all([
          api.get(`/salons/${id}/`),
          api.get(`/reviews/?salon_id=${id}`)
        ]);

        setSalon(salonRes.data);
        setReviews(reviewsRes.data.results || reviewsRes.data.data || []);
      } catch (err) {
        console.error('Failed loading salon detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalonDetail();
  }, [id]);

  const handleBookService = (service) => {
    updateBooking({
      salon: salon,
      service: service,
      staff: null,
      timeSlot: null
    });
    navigate('/booking');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-96 bg-white animate-pulse rounded-3xl border border-gray-100"></div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Salon not found</h2>
        <Link to="/salons" className="text-pink-600 font-semibold mt-4 inline-block">Return to Discovery</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Salon Header Hero Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Main Image */}
          <div className="h-72 md:h-full bg-slate-100 relative">
            <img
              src={salon.images?.[0]?.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'}
              alt={salon.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-extrabold text-gray-900">{salon.name}</h1>
                <div className="bg-pink-50 px-3 py-1 rounded-full text-sm font-bold text-pink-700">
                  <RatingStars rating={salon.rating} count={reviews.length} showNumber={true} />
                </div>
              </div>

              <p className="text-gray-500 text-sm flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span>{salon.address}, {salon.city}, {salon.state}</span>
              </p>

              <p className="text-gray-600 text-sm leading-relaxed">{salon.description}</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs font-semibold text-gray-600">
              <div className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <Phone className="w-4 h-4 text-pink-600" />
                <span>{salon.phone}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <Mail className="w-4 h-4 text-pink-600" />
                <span>{salon.email}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (salon.services?.[0]) {
                  handleBookService(salon.services[0]);
                } else {
                  navigate('/booking');
                }
              }}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 transition text-center flex items-center justify-center space-x-2"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 text-base font-semibold space-x-8">
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-4 transition border-b-2 ${
            activeTab === 'services' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Services ({salon.services?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`pb-4 transition border-b-2 ${
            activeTab === 'staff' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Stylists & Staff ({salon.staff?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('hours')}
          className={`pb-4 transition border-b-2 ${
            activeTab === 'hours' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Working Hours
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-4 transition border-b-2 ${
            activeTab === 'reviews' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Customer Reviews ({reviews.length})
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {salon.services?.map((srv) => (
              <div key={srv.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-pink-200 transition">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-gray-900 text-lg">{srv.name}</h3>
                    {srv.category_name && (
                      <span className="bg-pink-50 text-pink-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        {srv.category_name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{srv.description}</p>
                  <div className="flex items-center space-x-3 text-xs font-semibold text-gray-700 pt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{srv.duration_minutes} mins</span>
                    </span>
                    <span>•</span>
                    <span className="text-pink-600 font-extrabold text-sm">₹{srv.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookService(srv)}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition flex-shrink-0"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {salon.staff?.map((st) => (
              <div key={st.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-3">
                <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-full mx-auto flex items-center justify-center font-bold text-2xl">
                  {st.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{st.name}</h3>
                  <p className="text-xs text-pink-600 font-semibold">{st.specialization}</p>
                  <p className="text-xs text-gray-500 mt-1">{st.experience_years} years experience</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-lg space-y-3">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Weekly Schedule</h3>
            {salon.working_hours?.map((wh) => (
              <div key={wh.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-0">
                <span className="font-medium text-gray-700">{wh.day_name}</span>
                {wh.is_open ? (
                  <span className="font-semibold text-gray-900">{wh.opening_time} - {wh.closing_time}</span>
                ) : (
                  <span className="font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded text-xs">CLOSED</span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 max-w-3xl">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet for this salon.</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-sm">{rev.customer?.full_name || rev.customer?.email}</span>
                    <RatingStars rating={rev.rating} showNumber={false} />
                  </div>
                  <p className="text-sm text-gray-600">{rev.comment}</p>
                  <span className="text-xs text-gray-400 block">{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
};
