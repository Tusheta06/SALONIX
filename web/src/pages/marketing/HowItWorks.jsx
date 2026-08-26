import React from 'react';

export const HowItWorks = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">How Salonix Works</h1>
        <p className="text-gray-600">Step-by-step guide for customers booking beauty services online.</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-6">
          <div className="w-12 h-12 rounded-xl bg-pink-600 text-white font-extrabold text-xl flex items-center justify-center flex-shrink-0">
            1
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Search & Select a Salon</h3>
            <p className="text-gray-600 mt-1">Browse salons by city, category, price range, and customer ratings.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-6">
          <div className="w-12 h-12 rounded-xl bg-pink-600 text-white font-extrabold text-xl flex items-center justify-center flex-shrink-0">
            2
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Choose Service & Stylist</h3>
            <p className="text-gray-600 mt-1">Select haircuts, facials, coloring, nails, or spa packages with your preferred stylist.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-6">
          <div className="w-12 h-12 rounded-xl bg-pink-600 text-white font-extrabold text-xl flex items-center justify-center flex-shrink-0">
            3
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Pick Live Available Time Slot</h3>
            <p className="text-gray-600 mt-1">Select date and real-time available slot calculated dynamically respecting salon hours & staff leave.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-6">
          <div className="w-12 h-12 rounded-xl bg-pink-600 text-white font-extrabold text-xl flex items-center justify-center flex-shrink-0">
            4
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Confirm & Enjoy Your Appointment</h3>
            <p className="text-gray-600 mt-1">Receive instant confirmation. Visit the salon, get styled, and leave a review!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
