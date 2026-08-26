import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Clock, CheckCircle, XCircle, Check } from 'lucide-react';

export const SalonAppointments = () => {
  const [salon, setSalon] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/salons/my_salon/');
      const s = res.data.data;
      setSalon(s);
      if (s?.id) {
        const aptRes = await api.get(`/appointments/?salon_id=${s.id}${statusFilter ? `&status=${statusFilter}` : ''}`);
        setAppointments(aptRes.data.results || aptRes.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const handleUpdateStatus = async (aptId, newStatus) => {
    try {
      await api.patch(`/appointments/${aptId}/`, {
        status: newStatus
      });
      fetchAppointments();
    } catch (err) {
      alert('Failed updating appointment status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Salon Appointments</h1>
          <p className="text-gray-500 text-sm">Update status to CONFIRMED, COMPLETED, or CANCELLED</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-xl text-sm font-semibold bg-white"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Service</th>
              <th className="p-4">Stylist</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-900">{apt.customer?.full_name || apt.customer?.email}</td>
                <td className="p-4 text-pink-600 font-medium">{apt.service?.name}</td>
                <td className="p-4 text-gray-700">{apt.staff?.name}</td>
                <td className="p-4 text-gray-600">{apt.appointment_date} @ {apt.start_time}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
