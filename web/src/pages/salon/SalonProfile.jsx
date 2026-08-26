import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Store, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';

export const SalonProfile = () => {
  const [salon, setSalon] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await api.get('/salons/my_salon/');
        if (res.data.success) {
          const s = res.data.data;
          setSalon(s);
          setName(s.name || '');
          setDescription(s.description || '');
          setAddress(s.address || '');
          setCity(s.city || '');
          setState(s.state || '');
          setPhone(s.phone || '');
          setEmail(s.email || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalon();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await api.patch(`/salons/${salon.id}/`, {
        name,
        description,
        address,
        city,
        state,
        phone,
        email
      });
      if (res.data) {
        setMsg('Salon profile updated successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-pulse text-gray-400">Loading salon profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Salon Profile & Info</h1>
        <p className="text-gray-500 text-sm">Update public salon description, location address, and contact information</p>
      </div>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>{msg}</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Salon Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-pink-200 transition"
          >
            {saving ? 'Saving...' : 'Save Salon Profile'}
          </button>
        </form>
      </div>

    </div>
  );
};
