import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors, User, LogOut, Calendar, LayoutDashboard, Shield, UserCheck, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-pink-600 font-bold text-2xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-md shadow-pink-200">
              <Scissors className="w-5 h-5 transform -rotate-45" />
            </div>
            <span>Salonix</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/salons" className="text-gray-600 hover:text-pink-600 font-medium transition">
              Explore Salons
            </Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-pink-600 font-medium transition">
              How It Works
            </Link>
            <Link to="/for-salons" className="text-gray-600 hover:text-pink-600 font-medium transition">
              For Salon Owners
            </Link>
          </nav>

          {/* User Auth Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'CUSTOMER' && (
                  <Link
                    to="/my-bookings"
                    className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 font-medium px-3 py-2 rounded-lg hover:bg-pink-50 transition"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>My Bookings</span>
                  </Link>
                )}

                {(user.role === 'SALON_OWNER' || user.role === 'SALON_MANAGER') && (
                  <Link
                    to="/salon/dashboard"
                    className="flex items-center space-x-1 bg-pink-50 text-pink-700 hover:bg-pink-100 font-medium px-3 py-2 rounded-lg transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Salon Dashboard</span>
                  </Link>
                )}

                {user.role === 'STAFF' && (
                  <Link
                    to="/staff/dashboard"
                    className="flex items-center space-x-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium px-3 py-2 rounded-lg transition"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Stylist Portal</span>
                  </Link>
                )}

                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium px-3 py-2 rounded-lg transition"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
                  <Link
                    to={user.role === 'STAFF' ? '/staff/profile' : '/profile'}
                    className="flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-pink-600"
                  >
                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                      {user.first_name?.[0] || 'U'}
                    </div>
                    <span className="max-w-[120px] truncate">{user.first_name || user.email}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-gray-100 transition"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-pink-600 font-medium px-4 py-2 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-2 rounded-xl shadow-md shadow-pink-200 transition"
                >
                  Book Appointment
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-pink-600 p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/salons"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-medium py-2 hover:text-pink-600"
          >
            Explore Salons
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-medium py-2 hover:text-pink-600"
          >
            How It Works
          </Link>
          <Link
            to="/for-salons"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-700 font-medium py-2 hover:text-pink-600"
          >
            For Salon Owners
          </Link>
          {user ? (
            <>
              {user.role === 'CUSTOMER' && (
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 font-medium py-2 hover:text-pink-600"
                >
                  My Bookings
                </Link>
              )}
              {(user.role === 'SALON_OWNER' || user.role === 'SALON_MANAGER') && (
                <Link
                  to="/salon/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-pink-600 font-semibold py-2"
                >
                  Salon Dashboard
                </Link>
              )}
              {user.role === 'STAFF' && (
                <Link
                  to="/staff/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-rose-600 font-semibold py-2"
                >
                  Stylist Portal
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-purple-600 font-semibold py-2"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-red-600 font-medium py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-gray-700 font-medium py-2 border border-gray-300 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-pink-600 text-white font-medium py-2 rounded-xl"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
