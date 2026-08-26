import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, User, Trash2 } from 'lucide-react';

export const SalonStaff = () => {
  const [salon, setSalon] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [spec, setSpec] = useState('');
  const [exp, setExp] = useState('3');
  const [phone, setPhone] = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get('/salons/my_salon/');
      const s = res.data.data;
      setSalon(s);
      if (s?.id) {
        const stRes = await api.get(`/staff/?salon_id=${s.id}`);
        setStaffList(stRes.data.results || stRes.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/staff/', {
        salon: salon.id,
        name,
        specialization: spec,
        experience_years: Number(exp),
        phone
      });
      setShowModal(false);
      setName('');
      setSpec('');
      fetchData();
    } catch (err) {
      alert('Failed to add staff');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete staff member?')) return;
    try {
      await api.delete(`/staff/${id}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete staff');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Stylists & Staff</h1>
          <p className="text-gray-500 text-sm">Add team members and assign specializations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {staffList.map((st) => (
          <div key={st.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-lg">
                {st.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{st.name}</h3>
                <p className="text-xs text-pink-600 font-semibold">{st.specialization}</p>
                <p className="text-xs text-gray-500">{st.experience_years} yrs experience</p>
              </div>
            </div>
            <button onClick={() => handleDelete(st.id)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Add Staff Member</h3>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Vikram Sen" className="w-full px-3 py-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Specialization</label>
                <input required type="text" value={spec} onChange={(e) => setSpec(e.target.value)} placeholder="Senior Colorist & Hair Spa" className="w-full px-3 py-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Years of Experience</label>
                <input required type="number" value={exp} onChange={(e) => setExp(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="w-full px-3 py-2 border rounded-xl text-sm" />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600">Cancel</button>
                <button type="submit" className="bg-pink-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-pink-700">Add Stylist</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
