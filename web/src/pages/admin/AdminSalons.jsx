import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Store, Check, X, ShieldAlert, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminSalons = () => {
  const [salons, setSalons] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING');
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

  const handleApprove = async (salonId) => {
    if (!window.confirm('Approve this salon for public listing?')) return;
    try {
      await api.post(`/salons/${salonId}/approve/`);
      fetchSalons();
    } catch (err) {
      alert('Failed approving salon');
    }
  };

  const handleReject = async (salonId) => {
    const reason = window.prompt('Enter rejection reason for owner:', 'Incomplete information or images.');
    if (reason === null) return;

    try {
      await api.post(`/salons/${salonId}/reject/`, { reason });
      fetchSalons();
    } catch (err) {
      alert('Failed rejecting salon');
    }
  };

  const pendingSalons = salons.filter((s) => s.approval_status === 'PENDING' || (!s.is_approved && s.approval_status !== 'REJECTED'));
  const approvedSalons = salons.filter((s) => s.approval_status === 'APPROVED' || s.is_approved);
  const rejectedSalons = salons.filter((s) => s.approval_status === 'REJECTED');

  const getDisplayedSalons = () => {
    if (activeTab === 'PENDING') return pendingSalons;
    if (activeTab === 'APPROVED') return approvedSalons;
    if (activeTab === 'REJECTED') return rejectedSalons;
    return salons;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Salon Governance</h1>
        <p className="text-gray-500 text-sm">Review pending salon applications, inspect details, approve or reject listings</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 text-sm font-semibold space-x-6">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'PENDING' ? 'border-amber-600 text-amber-600 font-extrabold' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Pending Review ({pendingSalons.length})
        </button>

        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'APPROVED' ? 'border-green-600 text-green-600 font-extrabold' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Approved ({approvedSalons.length})
        </button>

        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'REJECTED' ? 'border-red-600 text-red-600 font-extrabold' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Rejected ({rejectedSalons.length})
        </button>

        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'ALL' ? 'border-purple-600 text-purple-600 font-extrabold' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          All Salons ({salons.length})
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 animate-pulse">Loading salon records...</div>
      ) : getDisplayedSalons().length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center text-gray-400 space-y-2">
          <Store className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="font-semibold text-gray-600">No {activeTab.toLowerCase()} salons found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Salon Name</th>
                <th className="p-4">Owner / Contact</th>
                <th className="p-4">City</th>
                <th className="p-4">Catalog Counts</th>
                <th className="p-4">Created Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {getDisplayedSalons().map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{s.name}</div>
                    <div className="text-xs text-gray-400">{s.email}</div>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div>{s.owner?.email || s.email}</div>
                    <div className="text-xs text-gray-400">{s.phone}</div>
                  </td>
                  <td className="p-4 font-medium text-gray-800">{s.city}, {s.state}</td>
                  <td className="p-4 text-xs font-semibold text-gray-600">
                    <span>{s.services_count || s.services?.length || 0} services</span> • 
                    <span> {s.staff_count || s.staff?.length || 0} staff</span> • 
                    <span> {s.images_count || s.images?.length || 0} photos</span>
                  </td>
                  <td className="p-4 text-xs text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      s.approval_status === 'APPROVED' || s.is_approved ? 'bg-green-100 text-green-700' :
                      s.approval_status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {s.approval_status || (s.is_approved ? 'APPROVED' : 'PENDING')}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      to={`/admin/salons/${s.id}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-3 py-1.5 rounded-xl text-xs inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </Link>

                    {s.approval_status !== 'APPROVED' && (
                      <button
                        onClick={() => handleApprove(s.id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm"
                      >
                        Approve
                      </button>
                    )}

                    {s.approval_status !== 'REJECTED' && (
                      <button
                        onClick={() => handleReject(s.id)}
                        className="bg-red-50 text-red-600 hover:bg-red-100 font-bold px-3 py-1.5 rounded-xl text-xs"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
