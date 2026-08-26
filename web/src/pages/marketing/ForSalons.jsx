import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Calendar, TrendingUp, Users, CheckCircle } from 'lucide-react';

export const ForSalons = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">Grow Your Salon Business with Salonix</h1>
        <p className="text-lg text-gray-600">
          The complete management & booking platform designed specifically for modern beauty salons and barbershops.
        </p>
        <div className="pt-4">
          <Link
            to="/register"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-pink-200 transition inline-block"
          >
            Register Your Salon Now
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <Calendar className="w-10 h-10 text-pink-600" />
          <h3 className="text-xl font-bold text-gray-900">Automated Booking</h3>
          <p className="text-sm text-gray-600">Fill your appointment calendar 24/7 without manual phone calls or scheduling hassles.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <Users className="w-10 h-10 text-pink-600" />
          <h3 className="text-xl font-bold text-gray-900">Staff & Leave Management</h3>
          <p className="text-sm text-gray-600">Manage individual stylist availability, weekly working hours, and vacation leave effortless.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <TrendingUp className="w-10 h-10 text-pink-600" />
          <h3 className="text-xl font-bold text-gray-900">Real-Time Analytics</h3>
          <p className="text-sm text-gray-600">Track daily revenue, popular services, active customer counts, and completion rates in your salon dashboard.</p>
        </div>
      </div>
    </div>
  );
};
