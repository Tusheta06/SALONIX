import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, Clock, CheckCircle2, AlertCircle, Scissors, UserCheck, ArrowRight, User } from 'lucide-react';

export const StaffDashboard = () => {
  const [staff, setStaff] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const staffRes = await api.get('/staff/me/');
        if (staffRes.data.success) {
          setStaff(staffRes.data.data);
        }
        const aptRes = await api.get('/appointments/');
        setAppointments(aptRes.data.results || aptRes.data.data || []);
      } catch (err) {
        console.error('Failed to load staff dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appointment_date === todayStr);
  const upcomingAppointments = appointments.filter((a) => ['PENDING', 'CONFIRMED'].includes(a.status));
  const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED');
  const cancelledAppointments = appointments.filter((a) => a.status === 'CANCELLED');

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse text-gray-500">Loading Stylist Portal...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-700 via-rose-700 to-purple-800 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-pink-100 mb-2">
            <UserCheck className="w-4 h-4" />
            <span>Stylist & Staff Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold">Welcome back, {staff?.name || 'Stylist'}!</h1>
          <p className="text-pink-100 text-sm mt-1">{staff?.specialization} • {staff?.salon_name || 'Salon Studio'}</p>
        </div>
        <Link
          to="/staff/schedule"
          className="bg-white text-pink-700 hover:bg-pink-50 font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition"
        >
          View Today's Schedule
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
            <span className="text-xs font-semibold text-gray-400 uppercase">Upcoming Assigned</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Clock className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{upcomingAppointments.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase">Completed Services</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{completedAppointments.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase">Cancelled</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl"><AlertCircle className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{cancelledAppointments.length}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/staff/appointments" className="bg-white p-4 rounded-2xl border border-gray-100 font-bold text-center text-gray-800 hover:border-pink-300 hover:text-pink-600 transition shadow-sm text-sm">
          My Appointments ({appointments.length})
        </Link>
        <Link to="/staff/schedule" className="bg-white p-4 rounded-2xl border border-gray-100 font-bold text-center text-gray-800 hover:border-pink-300 hover:text-pink-600 transition shadow-sm text-sm">
          Work Schedule
        </Link>
        <Link to="/staff/leave" className="bg-white p-4 rounded-2xl border border-gray-100 font-bold text-center text-gray-800 hover:border-pink-300 hover:text-pink-600 transition shadow-sm text-sm">
          Request Leave
        </Link>
        <Link to="/staff/profile" className="bg-white p-4 rounded-2xl border border-gray-100 font-bold text-center text-gray-800 hover:border-pink-300 hover:text-pink-600 transition shadow-sm text-sm">
          Stylist Profile
        </Link>
      </div>

      {/* Today's Schedule Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Today's Schedule ({todayStr})</h2>
          <Link to="/staff/appointments" className="text-pink-600 font-semibold text-sm hover:underline">View All</Link>
        </div>

        {todayAppointments.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">No appointments scheduled for today.</p>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex justify-between items-center text-sm">
                <div className="space-y-1">
                  <div className="font-bold text-gray-900">{apt.customer?.full_name || apt.customer?.email}</div>
                  <div className="text-xs text-pink-600 font-semibold">{apt.service?.name} • ₹{apt.price}</div>
                  <div className="text-xs text-gray-500">Duration: {apt.start_time} - {apt.end_time}</div>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
