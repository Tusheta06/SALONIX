import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar as CalendarIcon, Clock, Scissors, CheckCircle } from 'lucide-react';

export const StaffSchedule = () => {
  const [staff, setStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheduleData = async () => {
      setLoading(true);
      try {
        const staffRes = await api.get('/staff/me/');
        const st = staffRes.data.data;
        setStaff(st);

        if (st?.salon) {
          const whRes = await api.get(`/working-hours/?salon_id=${st.salon}`);
          setWorkingHours(whRes.data.results || whRes.data.data || []);
        }

        const aptRes = await api.get(`/appointments/?date=${selectedDate}`);
        setAppointments(aptRes.data.results || aptRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScheduleData();
  }, [selectedDate]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Stylist Schedule</h1>
          <p className="text-gray-500 text-sm">Working schedule & assigned appointment timeline for {staff?.name}</p>
        </div>

        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm">
          <CalendarIcon className="w-4 h-4 text-pink-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-0 focus:ring-0 text-sm font-bold text-gray-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Appointments Timeline */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Booked Slots ({selectedDate})</h2>

          {loading ? (
            <div className="p-8 text-center text-gray-400 animate-pulse">Loading schedule...</div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center text-gray-400 space-y-2">
              <Clock className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="font-semibold text-gray-600">No appointments scheduled for this date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-pink-600 text-base">{apt.start_time} - {apt.end_time}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">{apt.service?.name}</h3>
                    <p className="text-xs text-gray-500">Customer: {apt.customer?.full_name || apt.customer?.email} ({apt.customer?.phone || 'No phone'})</p>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-gray-900 text-lg">₹{apt.price}</div>
                    <div className="text-xs text-gray-400">{apt.service?.duration_minutes} mins duration</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Salon Working Hours Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <h2 className="text-lg font-bold text-gray-900">Salon Weekly Schedule</h2>
          <div className="divide-y divide-gray-100 text-xs">
            {workingHours.map((wh) => (
              <div key={wh.id} className="py-2.5 flex justify-between items-center">
                <span className="font-bold text-gray-700">{wh.day_name}</span>
                {wh.is_open ? (
                  <span className="font-mono text-gray-900">{wh.opening_time} - {wh.closing_time}</span>
                ) : (
                  <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold">CLOSED</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
