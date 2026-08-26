import React from 'react';
import { Scissors, Award, Users, Heart, ShieldCheck } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">About Salonix</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Salonix is a next-generation salon discovery and appointment booking platform empowering customers and beauty business owners with real-time digital scheduling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <Award className="w-10 h-10 text-pink-600" />
          <h3 className="text-xl font-bold text-gray-900">Curated Quality</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            We partner with certified salons, spa lounges, and premier hair studios offering top-tier customer satisfaction.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <Users className="w-10 h-10 text-pink-600" />
          <h3 className="text-xl font-bold text-gray-900">Empowering Stylists</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Salon owners get complete operational control over staff schedules, leaves, pricing, and automated appointments.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <ShieldCheck className="w-10 h-10 text-pink-600" />
          <h3 className="text-xl font-bold text-gray-900">Zero Double-Booking</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Our dynamic concurrency engine prevents overlapping bookings at the database level for total peace of mind.
          </p>
        </div>
      </div>
    </div>
  );
};
