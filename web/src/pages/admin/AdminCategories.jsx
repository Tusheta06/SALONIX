import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Tag } from 'lucide-react';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/');
      setCategories(res.data.results || res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories/', { name, description: desc });
      setShowModal(false);
      setName('');
      setDesc('');
      fetchCategories();
    } catch (err) {
      alert('Failed adding category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await api.delete(`/categories/${id}/`);
      fetchCategories();
    } catch (err) {
      alert('Failed deleting category');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Categories</h1>
          <p className="text-gray-500 text-sm">Platform service categories and taxonomy</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 text-base">{cat.name}</h3>
              <p className="text-xs text-gray-500">{cat.description || 'No description'}</p>
            </div>
            <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">Add Service Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Skin Care" className="w-full px-3 py-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Category details..." className="w-full px-3 py-2 border rounded-xl text-sm" />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600">Cancel</button>
                <button type="submit" className="bg-purple-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-purple-700">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
