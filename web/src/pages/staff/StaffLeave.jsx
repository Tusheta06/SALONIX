import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Calendar, AlertCircle } from 'lucide-react';

export const StaffLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [staff, setStaff] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchLeaveData = async () => {
    setLoading(true);
    try {
      const staffRes = await api.get('/staff/me/');
      if (staffRes.data.success) {
        setStaff(staffRes.data.data);
      }
      const leaveRes = await api.get('/leaves/');
      setLeaves(leaveRes.data.results || leaveRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const handleRequestLeave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/leaves/', {
        start_date: startDate,
        end_date: endDate,
        reason: reason
      });

      if (res.data) {
        setShowModal(false);
        setStartDate('');
        setEndDate('');
        setReason('');
        fetchLeaveData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Leave Requests</h1>
          <p className="text-gray-500 text-sm">Request vacation or personal leave (automatically updates availability engine)</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Request Leave</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400 animate-pulse">Loading leave records...</div>
      ) : leaves.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center text-gray-400 space-y-2">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="font-semibold text-gray-600">No leave records submitted yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-100">
          {leaves.map((l) => (
            <div key={l.id} className="p-5 flex justify-between items-center text-sm">
              <div className="space-y-1">
                <div className="font-bold text-gray-900">Leave Period</div>
                <div className="text-sm font-semibold text-pink-600">{l.start_date} to {l.end_date}</div>
                {l.reason && <p className="text-xs text-gray-500">{l.reason}</p>}
              </div>

              <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                APPROVED / ACTIVE
              </span>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Request Stylist Leave</h3>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRequestLeave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date</label>
                  <input
                    required
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">End Date</label>
                  <input
                    required
                    type="date"
                    min={startDate || new Date().toISOString().split('T')[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for Leave</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Annual Vacation, Health Leave..."
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-pink-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-pink-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
