import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { RatingStars } from '../../components/ui/RatingStars';
import { Calendar, Clock, MapPin, XCircle, CheckCircle, Star, AlertCircle } from 'lucide-react';

export const MyBookings = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [reviewModalApt, setReviewModalApt] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments/');
      setAppointments(res.data.results || res.data.data || []);
    } catch (err) {
      console.error('Failed fetching appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (aptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.post(`/appointments/${aptId}/cancel/`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await api.post('/reviews/', {
        salon: reviewModalApt.salon.id,
        appointment: reviewModalApt.id,
        rating: Number(rating),
        comment: comment
      });
      setReviewModalApt(null);
      setComment('');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const upcomingList = appointments.filter((a) => ['PENDING', 'CONFIRMED'].includes(a.status));
  const completedList = appointments.filter((a) => a.status === 'COMPLETED');
  const cancelledList = appointments.filter((a) => a.status === 'CANCELLED');

  const getDisplayedList = () => {
    if (activeTab === 'upcoming') return upcomingList;
    if (activeTab === 'completed') return completedList;
    return cancelledList;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">My Appointments</h1>
        <p className="text-gray-500 mt-1">Track your upcoming salon visits and review past completed services</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 text-sm font-semibold space-x-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'upcoming' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Upcoming ({upcomingList.length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'completed' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Completed ({completedList.length})
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'cancelled' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Cancelled ({cancelledList.length})
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white h-36 animate-pulse rounded-2xl border border-gray-100"></div>
          ))}
        </div>
      ) : getDisplayedList().length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-gray-500 space-y-2 border border-gray-100">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="font-semibold">No {activeTab} appointments found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {getDisplayedList().map((apt) => (
            <div key={apt.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h3 className="font-bold text-gray-900 text-lg">{apt.salon?.name}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                    apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>

                <p className="text-sm font-semibold text-pink-600">{apt.service?.name} • ₹{apt.price}</p>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-pink-500" />
                    <span>{apt.appointment_date} @ {apt.start_time}</span>
                  </span>
                  <span>•</span>
                  <span>Stylist: <strong>{apt.staff?.name}</strong></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {activeTab === 'upcoming' && (
                  <button
                    onClick={() => handleCancel(apt.id)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-4 py-2 rounded-xl text-xs transition"
                  >
                    Cancel Booking
                  </button>
                )}

                {activeTab === 'completed' && !apt.review && (
                  <button
                    onClick={() => setReviewModalApt(apt)}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-sm"
                  >
                    Leave Review
                  </button>
                )}

                {apt.review && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                    ★ Reviewed ({apt.review.rating}/5)
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModalApt && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Review {reviewModalApt.salon?.name}</h3>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-bold text-sm bg-white"
                >
                  <option value={5}>5★ - Excellent</option>
                  <option value={4}>4★ - Very Good</option>
                  <option value={3}>3★ - Average</option>
                  <option value={2}>2★ - Poor</option>
                  <option value={1}>1★ - Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Comment</label>
                <textarea
                  required
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with the haircut/service & stylist..."
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalApt(null)}
                  className="px-4 py-2 text-sm text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="bg-pink-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-pink-700"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
