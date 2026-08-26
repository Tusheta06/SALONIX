import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, DollarSign, Users, Scissors, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export const SalonDashboard = () => {
  const [salon, setSalon] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const salonRes = await api.get('/salons/my_salon/');
        const currentSalon = salonRes.data.data;
        setSalon(currentSalon);

        if (currentSalon?.id) {
          const aptRes = await api.get(`/appointments/?salon_id=${currentSalon.id}`);
          setAppointments(aptRes.data.results || aptRes.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const totalRevenue = appointments
    .filter((a) => ['CONFIRMED', 'COMPLETED'].includes(a.status))
    .reduce((sum, a) => sum + Number(a.price || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appointment_date === todayStr);
  const pendingAppointments = appointments.filter((a) => a.status === 'PENDING');

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse text-center">Loading salon dashboard...</div>;
  }

  if (!salon) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">No Salon Registered</h2>
        <p className="text-gray-500">You are logged in as Salon Owner but have not set up a salon profile yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{salon.name} Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">{salon.address}, {salon.city} • Rating: ★{salon.rating}</p>
        </div>
        <Link
          to={`/salons/${salon.id}`}
          className="bg-pink-50 text-pink-600 hover:bg-pink-100 font-bold px-4 py-2 rounded-xl text-sm transition"
        >
          View Public Page
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase">Today's Appointments</span>
            <div className="p-2 bg-pink-50 text-pink-600 rounded-xl"><Calendar className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{todayAppointments.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase">Total Revenue</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-xl"><DollarSign className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase">Active Staff</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{salon.staff?.length || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase">Active Services</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Scissors className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{salon.services?.length || 0}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/salon/appointments" className="bg-white p-4 rounded-2xl border border-gray-100 font-bold text-center text-gray-800 hover:border-pink-300 hover:text-pink-600 transition shadow-sm text-sm">
          Appointments ({appointments.length})
        </Link>
        <Link to="/salon/services" className="bg-white p-4 rounded-2xl border border-gray-100 font-bold text-center text-gray-800 hover:border-pink-300 hover:text-pink-600 transition shadow-sm text-sm">
          Manage Services
        </Link>
        <Link to="/salon/staff" className="bg-white p-4 rounded-2xl border border-gray-100 font-bold text-center text-gray-800 hover:border-pink-300 hover:text-pink-600 transition shadow-sm text-sm">
          Manage Staff
        </Link>
        <Link to="/salon/hours" className="bg-white p-4 rounded-2xl border border-gray-100 font-bold text-center text-gray-800 hover:border-pink-300 hover:text-pink-600 transition shadow-sm text-sm">
          Working Hours
        </Link>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Recent Customer Bookings</h2>
          <Link to="/salon/appointments" className="text-pink-600 font-semibold text-sm hover:underline">View All</Link>
        </div>

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-sm">No appointments booked yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {appointments.slice(0, 5).map((apt) => (
              <div key={apt.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <div className="font-bold text-gray-900">{apt.customer?.full_name || apt.customer?.email}</div>
                  <div className="text-xs text-gray-500">{apt.service?.name} with {apt.staff?.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-pink-600">{apt.appointment_date} @ {apt.start_time}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
