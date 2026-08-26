import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { User, Mail, Phone, Shield, CheckCircle } from 'lucide-react';

export const CustomerProfile = () => {
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await api.patch('/auth/me/', {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      });
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        setMsg('Profile updated successfully');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900">Account Profile</h1>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>{msg}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-2xl">
            {user?.first_name?.[0] || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-1 bg-pink-50 text-pink-700 font-bold text-xs px-2.5 py-0.5 rounded-full">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-pink-200 transition"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
