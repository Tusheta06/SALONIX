import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900">Get in Touch</h1>
          <p className="text-gray-600">Have questions about Salonix or need support with your salon account? We're here to help.</p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-4 text-gray-700">
              <MapPin className="w-6 h-6 text-pink-600" />
              <span>Hill Road, Bandra West, Mumbai, Maharashtra 400050</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-700">
              <Phone className="w-6 h-6 text-pink-600" />
              <span>+91 1800-SALONIX (7256649)</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-700">
              <Mail className="w-6 h-6 text-pink-600" />
              <span>support@salonix.com</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
              <p className="text-gray-600">Your message has been sent. Our team will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Send us a Message</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input required type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required rows="4" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500"></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl shadow-md shadow-pink-200 transition flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
