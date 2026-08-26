import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Clock, Check } from 'lucide-react';

export const SalonHours = () => {
  const [salon, setSalon] = useState(null);
  const [hours, setHours] = useState([]);
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get('/salons/my_salon/');
      const s = res.data.data;
      setSalon(s);
      if (s?.id) {
        const hRes = await api.get(`/working-hours/?salon_id=${s.id}`);
        setHours(hRes.data.results || hRes.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleOpen = async (wh) => {
    try {
      await api.patch(`/working-hours/${wh.id}/`, {
        is_open: !wh.is_open
      });
      fetchData();
    } catch (err) {
      alert('Failed updating working hours');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Working Hours</h1>
        <p className="text-gray-500 text-sm">Configure opening times and closed days for {salon?.name}</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        {hours.map((wh) => (
          <div key={wh.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0 text-sm">
            <span className="font-bold text-gray-900 w-32">{wh.day_name}</span>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-mono">{wh.opening_time} - {wh.closing_time}</span>
              <button
                onClick={() => handleToggleOpen(wh)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  wh.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {wh.is_open ? 'OPEN' : 'CLOSED'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
