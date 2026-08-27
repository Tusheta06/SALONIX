import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white font-bold text-2xl">
              <div className="w-9 h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center">
                <Scissors className="w-5 h-5 transform -rotate-45" />
              </div>
              <span>Salonix</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your next beauty appointment is just a few clicks away. Discover top-rated salons, expert stylists, and seamless real-time booking.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-pink-500 transition"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-pink-500 transition"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-pink-500 transition"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/salons" className="hover:text-pink-400 transition">Explore Salons</Link></li>
              <li><Link to="/how-it-works" className="hover:text-pink-400 transition">How It Works</Link></li>
              <li><Link to="/for-salons" className="hover:text-pink-400 transition">For Salon Owners</Link></li>
              <li><Link to="/about" className="hover:text-pink-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-pink-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Support &amp; Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-pink-400 transition">Help Center &amp; FAQ</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-pink-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-pink-400 transition">Terms of Service</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-pink-400 transition">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Contact Salonix</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                <span>Bandra West, Mumbai, Maharashtra 400050</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <span>+91 1800-SALONIX (7256649)</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <span>support@salonix.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Salonix Platform. All rights reserved.</p>
          <p className="text-xs text-slate-600">Built with Django REST API, React, Tailwind CSS, & Expo React Native.</p>
        </div>
      </div>
    </footer>
  );
};
