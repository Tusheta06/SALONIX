import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { Calendar as CalendarIcon, Clock, Scissors, User, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const BookingFlow = () => {
  const { user } = useAuth();
  const { bookingData, updateBooking, resetBooking } = useBooking();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [salons, setSalons] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotMessage, setSlotMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [error, setError] = useState('');
  const [bookingLimitModal, setBookingLimitModal] = useState({ isOpen: false, title: '', message: '' });

  // Step 1: Ensure salon & service exist
  useEffect(() => {
    if (!bookingData.salon) {
      api.get('/salons/').then((res) => {
        const list = res.data.results || res.data.data || [];
        if (list.length > 0) {
          const firstSalon = list[0];
          updateBooking({
            salon: firstSalon,
            service: firstSalon.services?.[0] || null,
            staff: firstSalon.staff?.[0] || null
          });
        }
      });
    }
  }, []);

  // Fetch available slots whenever staff, date, or service changes
  useEffect(() => {
    if (bookingData.salon?.id && bookingData.service?.id && bookingData.staff?.id && bookingData.date) {
      setLoadingSlots(true);
      setSlotMessage('');
      api.get(`/availability/`, {
        params: {
          salon_id: bookingData.salon.id,
          service_id: bookingData.service.id,
          staff_id: bookingData.staff.id,
          date: bookingData.date
        }
      })
      .then((res) => {
        if (res.data.success) {
          setAvailableSlots(res.data.slots || []);
          setSlotMessage(res.data.message || '');
        } else {
          setAvailableSlots([]);
          setSlotMessage(res.data.message || 'No available slots');
        }
      })
      .catch((err) => {
        setAvailableSlots([]);
        setSlotMessage('Failed to load slots');
      })
      .finally(() => setLoadingSlots(false));
    }
  }, [bookingData.salon, bookingData.service, bookingData.staff, bookingData.date]);

  const handleConfirmBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/booking' } } });
      return;
    }

    if (!bookingData.timeSlot) {
      setError('Please select an available time slot.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/appointments/', {
        salon: bookingData.salon.id,
        service: bookingData.service.id,
        staff: bookingData.staff.id,
        appointment_date: bookingData.date,
        start_time: bookingData.timeSlot.start_time,
        notes: bookingData.notes || 'Customer web booking'
      });

      if (res.data.success) {
        setBookingSuccess(res.data.data);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to book appointment. Selected slot may have just been taken.';
      setError(errorMsg);
      if (
        errorMsg.includes('Only one booking per day is allowed') ||
        errorMsg.includes('already have a booking on this date')
      ) {
        setBookingLimitModal({
          isOpen: true,
          title: 'Booking Not Allowed',
          message: errorMsg,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-extrabold">
          ✓
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Appointment Confirmed!</h1>
        <p className="text-gray-600">Your appointment has been successfully scheduled and locked in our database.</p>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Appointment ID</span>
            <span className="font-bold text-gray-900">#{bookingSuccess.id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Salon</span>
            <span className="font-bold text-gray-900">{bookingSuccess.salon?.name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Service</span>
            <span className="font-bold text-gray-900">{bookingSuccess.service?.name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Stylist</span>
            <span className="font-bold text-gray-900">{bookingSuccess.staff?.name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Date & Time</span>
            <span className="font-bold text-pink-600">{bookingSuccess.appointment_date} @ {bookingSuccess.start_time}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-gray-500">Total Price</span>
            <span className="font-extrabold text-lg text-gray-900">₹{bookingSuccess.price}</span>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            to="/my-bookings"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-pink-200 transition text-sm"
          >
            View My Bookings
          </Link>
          <button
            onClick={() => {
              resetBooking();
              setBookingSuccess(null);
              setStep(1);
            }}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold px-6 py-3 rounded-xl transition text-sm"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Wizard Step Indicator */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">Book Your Appointment</h1>
        <p className="text-sm text-gray-500">Real-time dynamic slot availability</p>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-xs font-bold text-gray-500">
        <span className={step >= 1 ? 'text-pink-600' : ''}>1. Service</span>
        <span>→</span>
        <span className={step >= 2 ? 'text-pink-600' : ''}>2. Stylist</span>
        <span>→</span>
        <span className={step >= 3 ? 'text-pink-600' : ''}>3. Date & Time</span>
        <span>→</span>
        <span className={step >= 4 ? 'text-pink-600' : ''}>4. Confirm</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Select Service from {bookingData.salon?.name || 'Salon'}</h2>
          
          <div className="space-y-3">
            {bookingData.salon?.services?.map((srv) => (
              <div
                key={srv.id}
                onClick={() => updateBooking({ service: srv })}
                className={`p-4 rounded-2xl border cursor-pointer transition flex justify-between items-center ${
                  bookingData.service?.id === srv.id
                    ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <div>
                  <h3 className="font-bold text-gray-900">{srv.name}</h3>
                  <p className="text-xs text-gray-500">{srv.duration_minutes} minutes duration</p>
                </div>
                <span className="font-extrabold text-pink-600 text-base">₹{srv.price}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!bookingData.service}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm flex items-center space-x-2 disabled:opacity-50"
            >
              <span>Next: Pick Stylist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Stylist Selection */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Select Stylist</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bookingData.salon?.staff?.map((st) => (
              <div
                key={st.id}
                onClick={() => updateBooking({ staff: st })}
                className={`p-5 rounded-2xl border cursor-pointer transition flex items-center space-x-4 ${
                  bookingData.staff?.id === st.id
                    ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-lg">
                  {st.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{st.name}</h3>
                  <p className="text-xs text-pink-600 font-semibold">{st.specialization}</p>
                  <p className="text-xs text-gray-500">{st.experience_years} yrs experience</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!bookingData.staff}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm flex items-center space-x-2 disabled:opacity-50"
            >
              <span>Next: Pick Date & Time</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Date & Live Time Slots */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Select Date & Available Slot</h2>
            <p className="text-xs text-gray-500">Slots generated in real-time based on working hours, leave & existing bookings</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Appointment Date</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={bookingData.date}
              onChange={(e) => updateBooking({ date: e.target.value, timeSlot: null })}
              className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500 font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Available Time Slots ({bookingData.date})
            </label>

            {loadingSlots ? (
              <div className="p-8 text-center text-gray-400 animate-pulse text-sm">Calculating real-time slots...</div>
            ) : availableSlots.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm">
                {slotMessage || 'No available slots for this date/stylist combinations.'}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => updateBooking({ timeSlot: slot })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                      !slot.available
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                        : bookingData.timeSlot?.start_time === slot.start_time
                        ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-pink-400'
                    }`}
                  >
                    {slot.display_time}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!bookingData.timeSlot}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm flex items-center space-x-2 disabled:opacity-50"
            >
              <span>Next: Review & Confirm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Summary & Confirmation */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Review & Confirm Booking</h2>

          <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Salon</span>
              <span className="font-bold text-gray-900">{bookingData.salon?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Service</span>
              <span className="font-bold text-gray-900">{bookingData.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Stylist</span>
              <span className="font-bold text-gray-900">{bookingData.staff?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date & Slot</span>
              <span className="font-bold text-pink-600">{bookingData.date} @ {bookingData.timeSlot?.display_time}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-pink-200">
              <span className="text-gray-700 font-semibold">Total Price</span>
              <span className="font-extrabold text-xl text-gray-900">₹{bookingData.service?.price}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Additional Notes (Optional)</label>
            <input
              type="text"
              placeholder="Special requests or hair preferences..."
              value={bookingData.notes}
              onChange={(e) => updateBooking({ notes: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={submitting}
              className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-pink-200 transition text-base disabled:opacity-50"
            >
              {submitting ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      )}

      {/* Booking Not Allowed Popup Modal */}
      {bookingLimitModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-gray-900">
                {bookingLimitModal.title || 'Booking Not Allowed'}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {bookingLimitModal.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBookingLimitModal({ isOpen: false, title: '', message: '' })}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-200 transition text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
