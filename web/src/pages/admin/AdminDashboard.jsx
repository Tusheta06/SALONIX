import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Users, Store, DollarSign, Calendar, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats/');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse text-center">Loading platform stats...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-purple-900 text-white p-8 rounded-3xl shadow-xl flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Administration</span>
          </div>
          <h1 className="text-3xl font-extrabold">Salonix System Overview</h1>
          <p className="text-purple-200 text-sm mt-1">Global platform metrics, revenue tracking, and salon moderation</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Total Customers</span>
          <p className="text-3xl font-extrabold text-gray-900">{stats?.total_customers}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Total Salons</span>
          <p className="text-3xl font-extrabold text-pink-600">{stats?.total_salons}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Total Appointments</span>
          <p className="text-3xl font-extrabold text-gray-900">{stats?.total_appointments}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase">Total Gross Revenue</span>
          <p className="text-3xl font-extrabold text-green-600">₹{stats?.total_revenue?.toLocaleString()}</p>
        </div>
      </div>

      {/* Admin Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/salons" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-300 transition space-y-2">
          <Store className="w-8 h-8 text-purple-600" />
          <h3 className="font-bold text-gray-900 text-lg">Salon Management</h3>
          <p className="text-xs text-gray-500">Approve, suspend, or view verified salons on Salonix.</p>
        </Link>

        <Link to="/admin/categories" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-300 transition space-y-2">
          <ShieldCheck className="w-8 h-8 text-purple-600" />
          <h3 className="font-bold text-gray-900 text-lg">Categories & Taxonomy</h3>
          <p className="text-xs text-gray-500">Add, edit, or delete platform service categories.</p>
        </Link>

        <Link to="/admin/customers" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-300 transition space-y-2">
          <Users className="w-8 h-8 text-purple-600" />
          <h3 className="font-bold text-gray-900 text-lg">User Oversight</h3>
          <p className="text-xs text-gray-500">Inspect customer accounts and salon owner profiles.</p>
        </Link>
      </div>

    </div>
  );
};
