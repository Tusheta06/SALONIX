import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Shield } from 'lucide-react';

export const AdminCustomers = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats/').then((res) => setStats(res.data.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Platform Users & Customers</h1>
        <p className="text-gray-500 text-sm">System accounts summary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-semibold uppercase">Customers</span>
          <p className="text-3xl font-extrabold text-gray-900">{stats?.total_customers}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-semibold uppercase">Salon Owners</span>
          <p className="text-3xl font-extrabold text-pink-600">{stats?.total_owners}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs text-gray-400 font-semibold uppercase">Total Staff</span>
          <p className="text-3xl font-extrabold text-purple-600">{stats?.total_staff}</p>
        </div>
      </div>
    </div>
  );
};
