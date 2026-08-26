import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Edit3, Scissors } from 'lucide-react';

export const SalonServices = () => {
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [catId, setCatId] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('30');
  const [desc, setDesc] = useState('');

  const fetchData = async () => {
    try {
      const salonRes = await api.get('/salons/my_salon/');
      const s = salonRes.data.data;
      setSalon(s);
      if (s?.id) {
        const srvRes = await api.get(`/services/?salon_id=${s.id}`);
        setServices(srvRes.data.results || srvRes.data.data || []);
      }
      const catRes = await api.get('/categories/');
      setCategories(catRes.data.results || catRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services/', {
        salon: salon.id,
        category: catId || (categories[0]?.id),
        name,
        description: desc,
        price,
        duration_minutes: Number(duration)
      });
      setShowModal(false);
      setName('');
      setPrice('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add service');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate/delete this service?')) return;
    try {
      await api.delete(`/services/${id}/`);
      fetchData();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Services</h1>
          <p className="text-gray-500 text-sm">Add or edit treatment prices & durations for {salon?.name}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th className="p-4">Service Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((srv) => (
              <tr key={srv.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-bold text-gray-900">{srv.name}</td>
                <td className="p-4 text-gray-600">{srv.category_name || 'General'}</td>
                <td className="p-4 text-gray-600">{srv.duration_minutes} mins</td>
                <td className="p-4 font-bold text-pink-600">₹{srv.price}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(srv.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Add New Service</h3>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Service Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Keratin Hair Treatment" className="w-full px-3 py-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select value={catId} onChange={(e) => setCatId(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm bg-white">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹)</label>
                  <input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="800" className="w-full px-3 py-2 border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Mins)</label>
                  <input required type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="45" className="w-full px-3 py-2 border rounded-xl text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short service details" className="w-full px-3 py-2 border rounded-xl text-sm" />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600">Cancel</button>
                <button type="submit" className="bg-pink-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-pink-700">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
