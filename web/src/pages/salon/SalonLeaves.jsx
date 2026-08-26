import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Calendar, Trash2 } from 'lucide-react';

export const SalonLeaves = () => {
  const [salon, setSalon] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [staffId, setStaffId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get('/salons/my_salon/');
      const s = res.data.data;
      setSalon(s);
      if (s?.id) {
        const stRes = await api.get(`/staff/?salon_id=${s.id}`);
        const stData = stRes.data.results || stRes.data.data || [];
        setStaffList(stData);

        const lRes = await api.get('/leaves/');
        setLeaves(lRes.data.results || lRes.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddLeave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves/', {
        staff: staffId || staffList[0]?.id,
        start_date: startDate,
        end_date: endDate,
        reason
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to register staff leave');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete leave entry?')) return;
    try {
      await api.delete(`/leaves/${id}/`);
      fetchData();
    } catch (err) {
      alert('Failed deleting leave');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Staff Leave Schedules</h1>
          <p className="text-gray-500 text-sm">Availability engine automatically locks out leave dates</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Leave</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {leaves.map((l) => (
          <div key={l.id} className="p-4 flex justify-between items-center text-sm">
            <div>
              <div className="font-bold text-gray-900">Staff #{l.staff} Leave</div>
              <div className="text-xs text-pink-600 font-semibold">{l.start_date} to {l.end_date}</div>
              {l.reason && <p className="text-xs text-gray-500 mt-1">{l.reason}</p>}
            </div>
            <button onClick={() => handleDelete(l.id)} className="text-red-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Add Staff Leave</h3>
            <form onSubmit={handleAddLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Stylist</label>
                <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm bg-white">
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>{st.name} ({st.specialization})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date</label>
                  <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">End Date</label>
                  <input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Reason</label>
                <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Vacation, personal leave..." className="w-full px-3 py-2 border rounded-xl text-sm" />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600">Cancel</button>
                <button type="submit" className="bg-pink-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-pink-700">Save Leave</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
