import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Scissors, CheckCircle, AlertCircle } from 'lucide-react';

export const StaffProfile = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState(null);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experienceYears, setExperienceYears] = useState('0');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchStaffProfile = async () => {
      try {
        const res = await api.get('/staff/me/');
        if (res.data.success) {
          const st = res.data.data;
          setStaff(st);
          setName(st.name || '');
          setSpecialization(st.specialization || '');
          setExperienceYears(st.experience_years?.toString() || '0');
          setPhone(st.phone || '');
          setEmail(st.email || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await api.patch('/staff/me/', {
        name,
        specialization,
        experience_years: Number(experienceYears),
        phone,
        email
      });

      if (res.data.success) {
        setStaff(res.data.data);
        setMsg('Stylist profile updated successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-pulse text-gray-400">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Stylist Profile</h1>
        <p className="text-gray-500 text-sm">Update your public specialization, experience, and contact details</p>
      </div>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>{msg}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-2xl">
            {name[0] || 'S'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{name}</h2>
            <p className="text-sm text-pink-600 font-semibold">{specialization}</p>
            <span className="inline-block mt-1 bg-pink-50 text-pink-700 font-bold text-xs px-2.5 py-0.5 rounded-full">
              Salon: {staff?.salon_name}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Specialization</label>
            <input
              type="text"
              required
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. Hair Cut & Color Master"
              className="w-full px-4 py-2 border rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Public Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-pink-200 transition"
          >
            {saving ? 'Saving...' : 'Save Stylist Profile'}
          </button>
        </form>
      </div>

    </div>
  );
};
