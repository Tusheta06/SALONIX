import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { RatingStars } from '../../components/ui/RatingStars';
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle, ShieldAlert, ArrowLeft, Check, X } from 'lucide-react';

export const AdminSalonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSalon = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/salons/${id}/`);
      setSalon(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalon();
  }, [id]);

  const handleApprove = async () => {
    if (!window.confirm(`Approve "${salon.name}" for public customer booking?`)) return;
    setActionLoading(true);
    try {
      await api.post(`/salons/${id}/approve/`);
      fetchSalon();
    } catch (err) {
      alert('Failed approving salon');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Enter reason for rejection:', 'Information or images need updating.');
    if (reason === null) return;

    setActionLoading(true);
    try {
      await api.post(`/salons/${id}/reject/`, { reason });
      fetchSalon();
    } catch (err) {
      alert('Failed rejecting salon');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse text-gray-500">Loading salon inspection view...</div>;
  }

  if (!salon) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Salon record not found</h2>
        <Link to="/admin/salons" className="text-pink-600 font-semibold mt-4 inline-block">Back to Salons List</Link>
      </div>
    );
  }

  const isApproved = salon.approval_status === 'APPROVED' || salon.is_approved;
  const isPending = salon.approval_status === 'PENDING' || (!isApproved && salon.approval_status !== 'REJECTED');
  const isRejected = salon.approval_status === 'REJECTED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
        <Link to="/admin/salons" className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center space-x-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Salons</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
            isApproved ? 'bg-green-100 text-green-700' :
            isRejected ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
          }`}>
            Status: {salon.approval_status || (isApproved ? 'APPROVED' : 'PENDING')}
          </span>

          {!isApproved && (
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-5 py-2 rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Approve Salon</span>
            </button>
          )}

          {!isRejected && (
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2 rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Reject Salon</span>
            </button>
          )}
        </div>
      </div>

      {isRejected && (
        <div className="bg-red-50 border border-red-200 text-red-900 p-4 rounded-2xl text-xs space-y-1">
          <p className="font-bold">Rejection Reason recorded:</p>
          <p>{salon.rejection_reason || 'No reason specified.'}</p>
        </div>
      )}

      {/* Basic Info & Location Card */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{salon.name}</h1>
            <p className="text-sm text-gray-500 flex items-center space-x-1 mt-1">
              <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <span>{salon.address}, {salon.city}, {salon.state} {salon.postal_code}</span>
            </p>
          </div>
          <RatingStars rating={salon.rating} showNumber={true} />
        </div>

        <p className="text-gray-700 text-sm leading-relaxed">{salon.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 text-xs font-semibold text-gray-600">
          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl border">
            <Phone className="w-4 h-4 text-pink-600" />
            <span>Phone: {salon.phone}</span>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl border">
            <Mail className="w-4 h-4 text-pink-600" />
            <span>Email: {salon.email}</span>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl border">
            <span className="font-bold text-gray-900">Owner Email:</span>
            <span>{salon.owner?.email || salon.email}</span>
          </div>
        </div>
      </div>

      {/* Photos Gallery */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Salon Photos ({salon.images?.length || 0})</h2>
        
        {salon.images?.length === 0 ? (
          <p className="text-xs text-gray-400">No photos uploaded for this salon.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {salon.images.map((img) => (
              <div key={img.id} className="h-36 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={img.image} alt={img.alt_text || salon.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services List */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Services & Pricing ({salon.services?.length || 0})</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {salon.services?.map((srv) => (
            <div key={srv.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex justify-between items-center text-sm">
              <div>
                <div className="font-bold text-gray-900">{srv.name} <span className="text-xs text-pink-600 font-semibold">({srv.category_name || 'General'})</span></div>
                <div className="text-xs text-gray-500">{srv.duration_minutes} mins duration</div>
              </div>
              <div className="font-extrabold text-pink-600 text-base">₹{srv.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Staff Members ({salon.staff?.length || 0})</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {salon.staff?.map((st) => (
            <div key={st.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center space-x-3 text-sm">
              <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                {st.name[0]}
              </div>
              <div>
                <div className="font-bold text-gray-900">{st.name}</div>
                <div className="text-xs text-pink-600 font-semibold">{st.specialization}</div>
                <div className="text-xs text-gray-400">{st.experience_years} yrs exp</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 max-w-lg">
        <h2 className="text-xl font-bold text-gray-900">Weekly Operating Hours</h2>
        
        <div className="divide-y divide-gray-100 text-sm">
          {salon.working_hours?.map((wh) => (
            <div key={wh.id} className="py-2.5 flex justify-between items-center">
              <span className="font-bold text-gray-700">{wh.day_name}</span>
              {wh.is_open ? (
                <span className="font-mono text-gray-900">{wh.opening_time} - {wh.closing_time}</span>
              ) : (
                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs font-bold">CLOSED</span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
