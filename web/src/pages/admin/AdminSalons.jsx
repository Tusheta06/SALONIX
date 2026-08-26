import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Store, Check, X, ShieldAlert } from 'lucide-react';

export const AdminSalons = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSalons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/salons/');
      setSalons(res.data.results || res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const handleToggleApprove = async (salonId, currentStatus) => {
    try {
      await api.patch(`/salons/${salonId}/`, {
        is_approved: !currentStatus
      });
      fetchSalons();
    } catch (err) {
      alert('Failed updating salon status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Salon Management</h1>
        <p className="text-gray-500 text-sm">Approve, suspend, or audit salon profiles across the platform</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-4">Salon Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Owner</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {salons.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-900">{s.name}</td>
                <td className="p-4 text-gray-600">{s.city}, {s.state}</td>
                <td className="p-4 text-gray-600">{s.owner?.email || s.email}</td>
                <td className="p-4 font-bold text-amber-600">★{s.rating}</td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    s.is_approved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {s.is_approved ? 'APPROVED' : 'SUSPENDED'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleToggleApprove(s.id, s.is_approved)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      s.is_approved ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {s.is_approved ? 'Suspend Salon' : 'Approve Salon'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
