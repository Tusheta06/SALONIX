import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Scissors, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';

export const Register = () => {
  const [role, setRole] = useState('CUSTOMER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        role,
      });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.message || 'Registration failed. Check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center mx-auto shadow-md shadow-pink-200">
            <Scissors className="w-6 h-6 transform -rotate-45" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-500">Join Salonix as a customer or salon owner</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl text-sm font-semibold">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`py-2 rounded-lg transition ${
              role === 'CUSTOMER' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            I'm a Customer
          </button>

          <button
            type="button"
            onClick={() => setRole('SALON_OWNER')}
            className={`py-2 rounded-lg transition ${
              role === 'SALON_OWNER' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Salon Owner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Priya"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Verma"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-200 transition text-sm disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'CUSTOMER' ? 'Customer' : 'Salon Owner'}`}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-pink-600 hover:text-pink-700">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
