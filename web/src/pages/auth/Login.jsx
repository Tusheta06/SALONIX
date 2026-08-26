import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Scissors, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.role === 'SALON_OWNER' || userData.role === 'SALON_MANAGER') {
        navigate('/salon/dashboard');
      } else if (userData.role === 'STAFF') {
        navigate('/staff/dashboard');
      } else if (userData.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/salons' : from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center mx-auto shadow-md shadow-pink-200">
            <Scissors className="w-6 h-6 transform -rotate-45" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500">Sign in to manage your appointments or dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 transition duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Accounts Panel */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center space-x-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-pink-500" />
            <span>One-Click Demo Accounts</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => fillDemoAccount('customer@salonix.demo')}
              type="button"
              className="p-2 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 text-left font-medium text-gray-700 transition"
            >
              <div className="font-bold text-pink-600">Customer</div>
              <div className="text-[10px] text-gray-500">customer@salonix.demo</div>
            </button>

            <button
              onClick={() => fillDemoAccount('owner@salonix.demo')}
              type="button"
              className="p-2 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 text-left font-medium text-gray-700 transition"
            >
              <div className="font-bold text-pink-600">Salon Owner</div>
              <div className="text-[10px] text-gray-500">owner@salonix.demo</div>
            </button>

            <button
              onClick={() => fillDemoAccount('stylist@salonix.demo')}
              type="button"
              className="p-2 border border-gray-200 rounded-lg hover:bg-rose-50 hover:border-rose-300 text-left font-medium text-gray-700 transition"
            >
              <div className="font-bold text-rose-600">Staff Stylist</div>
              <div className="text-[10px] text-gray-500">stylist@salonix.demo</div>
            </button>

            <button
              onClick={() => fillDemoAccount('admin@salonix.demo')}
              type="button"
              className="p-2 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 text-left font-medium text-gray-700 transition"
            >
              <div className="font-bold text-purple-600">Admin</div>
              <div className="text-[10px] text-gray-500">admin@salonix.demo</div>
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-pink-600 hover:text-pink-700">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};
