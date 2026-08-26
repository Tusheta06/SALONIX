import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';

export const StaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments/');
      setAppointments(res.data.results || res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (aptId, newStatus) => {
    try {
      await api.patch(`/appointments/${aptId}/`, {
        status: newStatus
      });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed updating appointment status');
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'UPCOMING') return ['PENDING', 'CONFIRMED'].includes(apt.status);
    if (activeTab === 'COMPLETED') return apt.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return apt.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">My Assigned Appointments</h1>
        <p className="text-gray-500 text-sm">Manage treatments, confirm schedule, or mark appointments completed</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 text-sm font-semibold space-x-6">
        {['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 transition border-b-2 ${
              activeTab === tab ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()} ({
              tab === 'ALL' ? appointments.length :
              appointments.filter((a) => tab === 'UPCOMING' ? ['PENDING', 'CONFIRMED'].includes(a.status) : a.status === tab).length
            })
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400 animate-pulse">Loading assigned appointments...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time Slot</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">
                    No appointments found for this view.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-gray-900">{apt.customer?.full_name || apt.customer?.email}</td>
                    <td className="p-4 font-semibold text-pink-600">{apt.service?.name}</td>
                    <td className="p-4 text-gray-700">{apt.appointment_date}</td>
                    <td className="p-4 text-gray-600 font-mono">{apt.start_time} - {apt.end_time}</td>
                    <td className="p-4 font-bold text-gray-900">₹{apt.price}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                        apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {apt.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition"
                        >
                          Confirm
                        </button>
                      )}
                      {apt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition"
                        >
                          Complete
                        </button>
                      )}
                      {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg text-xs font-bold transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
