import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Scissors, MapPin, Image as ImageIcon, Plus, Trash2, Edit3,
  Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck, Upload
} from 'lucide-react';

export const CreateSalon = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  // Step 2: Location
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Step 3: Images
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Step 4: Categories & Services
  const [categories, setCategories] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [srvName, setSrvName] = useState('');
  const [srvCatId, setSrvCatId] = useState('');
  const [srvDesc, setSrvDesc] = useState('');
  const [srvPrice, setSrvPrice] = useState('');
  const [srvDuration, setSrvDuration] = useState('30');

  // Step 5: Staff
  const [staffList, setStaffList] = useState([]);
  const [stName, setStName] = useState('');
  const [stSpec, setStSpec] = useState('');
  const [stExp, setStExp] = useState('3');
  const [stPhone, setStPhone] = useState('');
  const [stEmail, setStEmail] = useState('');

  // Step 6: Working Hours
  const defaultHours = [
    { day_of_week: 0, day_name: 'Monday', is_open: true, opening_time: '09:00', closing_time: '18:00' },
    { day_of_week: 1, day_name: 'Tuesday', is_open: true, opening_time: '09:00', closing_time: '18:00' },
    { day_of_week: 2, day_name: 'Wednesday', is_open: true, opening_time: '09:00', closing_time: '18:00' },
    { day_of_week: 3, day_name: 'Thursday', is_open: true, opening_time: '09:00', closing_time: '18:00' },
    { day_of_week: 4, day_name: 'Friday', is_open: true, opening_time: '09:00', closing_time: '18:00' },
    { day_of_week: 5, day_name: 'Saturday', is_open: true, opening_time: '09:00', closing_time: '19:00' },
    { day_of_week: 6, day_name: 'Sunday', is_open: false, opening_time: '10:00', closing_time: '17:00' },
  ];
  const [workingHours, setWorkingHours] = useState(defaultHours);

  // Initial check: if owner already has a salon, redirect to dashboard
  useEffect(() => {
    const checkExistingSalon = async () => {
      try {
        const res = await api.get('/salons/my_salon/');
        if (res.data.success && res.data.data) {
          navigate('/salon/dashboard');
          return;
        }
      } catch (err) {
        // No salon exists, proceed
      } finally {
        setLoading(false);
      }

      // Fetch Categories
      try {
        const catRes = await api.get('/categories/');
        const cats = catRes.data.results || catRes.data.data || [];
        setCategories(cats);
        if (cats.length > 0) setSrvCatId(cats[0].id.toString());
      } catch (err) {
        console.error(err);
      }
    };
    checkExistingSalon();
  }, [navigate]);

  // Image Selection Handler
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) {
      alert('Some images exceeded max size limit (5MB) and were skipped.');
    }

    const newFiles = [...imageFiles, ...validFiles];
    setImageFiles(newFiles);

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  // Add Service Handler
  const handleAddService = (e) => {
    e.preventDefault();
    if (!srvName || !srvPrice || !srvDuration) return;
    if (Number(srvPrice) < 0 || Number(srvDuration) <= 0) {
      alert('Price must be >= 0 and duration > 0');
      return;
    }
    const catObj = categories.find(c => c.id.toString() === srvCatId.toString());
    setServicesList(prev => [
      ...prev,
      {
        id: Date.now(),
        name: srvName,
        category: srvCatId,
        category_name: catObj?.name || 'General',
        description: srvDesc,
        price: srvPrice,
        duration_minutes: Number(srvDuration),
        is_active: true
      }
    ]);
    setSrvName('');
    setSrvDesc('');
    setSrvPrice('');
  };

  const handleRemoveService = (index) => {
    setServicesList(prev => prev.filter((_, i) => i !== index));
  };

  // Add Staff Handler
  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!stName) return;
    if (Number(stExp) < 0) {
      alert('Experience must be >= 0');
      return;
    }
    setStaffList(prev => [
      ...prev,
      {
        id: Date.now(),
        name: stName,
        specialization: stSpec,
        experience_years: Number(stExp),
        phone: stPhone,
        email: stEmail,
        is_active: true
      }
    ]);
    setStName('');
    setStSpec('');
    setStPhone('');
    setStEmail('');
  };

  const handleRemoveStaff = (index) => {
    setStaffList(prev => prev.filter((_, i) => i !== index));
  };

  // Step 6 Working Hour Toggle
  const handleToggleDay = (index) => {
    setWorkingHours(prev => prev.map((wh, i) => i === index ? { ...wh, is_open: !wh.is_open } : wh));
  };

  const handleTimeChange = (index, field, value) => {
    setWorkingHours(prev => prev.map((wh, i) => i === index ? { ...wh, [field]: value } : wh));
  };

  // Final Submission
  const handleSubmitSalon = async () => {
    setSubmitting(true);
    setError('');

    try {
      // 1. Create Salon
      const salonRes = await api.post('/salons/', {
        name,
        description,
        address,
        city,
        state,
        postal_code: postalCode,
        phone,
        email,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null
      });

      const newSalon = salonRes.data.data || salonRes.data;
      const salonId = newSalon.id;

      // 2. Upload Images
      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('alt_text', name);
        try {
          await api.post(`/salons/${salonId}/upload_image/`, formData);
        } catch (imgErr) {
          console.error('Failed to upload image', imgErr);
        }
      }

      // 3. Add Services
      for (const srv of servicesList) {
        try {
          await api.post('/services/', {
            salon: salonId,
            category: srv.category,
            name: srv.name,
            description: srv.description,
            price: srv.price,
            duration_minutes: srv.duration_minutes,
            is_active: srv.is_active
          });
        } catch (srvErr) {
          console.error('Failed to add service', srvErr);
        }
      }

      // 4. Add Staff
      for (const st of staffList) {
        try {
          await api.post('/staff/', {
            salon: salonId,
            name: st.name,
            specialization: st.specialization,
            experience_years: st.experience_years,
            phone: st.phone,
            email: st.email,
            is_active: st.is_active
          });
        } catch (stErr) {
          console.error('Failed to add staff', stErr);
        }
      }

      // 5. Add Working Hours
      for (const wh of workingHours) {
        try {
          await api.post('/working-hours/', {
            salon: salonId,
            day_of_week: wh.day_of_week,
            is_open: wh.is_open,
            opening_time: wh.opening_time.length === 5 ? `${wh.opening_time}:00` : wh.opening_time,
            closing_time: wh.closing_time.length === 5 ? `${wh.closing_time}:00` : wh.closing_time
          });
        } catch (whErr) {
          console.error('Failed setting working hour', whErr);
        }
      }

      // Redirect to Salon Dashboard with pending banner
      navigate('/salon/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.detail || 'Failed to submit salon setup. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-pulse text-gray-500">Checking salon registration status...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">Create & Register Your Salon</h1>
        <p className="text-sm text-gray-500">Complete your salon setup for admin review & approval</p>
      </div>

      {/* Multi-step Progress Indicator */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center overflow-x-auto text-xs font-bold text-gray-500">
        <span className={step >= 1 ? 'text-pink-600 font-extrabold' : ''}>1. Basic Info</span>
        <span>→</span>
        <span className={step >= 2 ? 'text-pink-600 font-extrabold' : ''}>2. Location</span>
        <span>→</span>
        <span className={step >= 3 ? 'text-pink-600 font-extrabold' : ''}>3. Images</span>
        <span>→</span>
        <span className={step >= 4 ? 'text-pink-600 font-extrabold' : ''}>4. Services</span>
        <span>→</span>
        <span className={step >= 5 ? 'text-pink-600 font-extrabold' : ''}>5. Staff</span>
        <span>→</span>
        <span className={step >= 6 ? 'text-pink-600 font-extrabold' : ''}>6. Hours</span>
        <span>→</span>
        <span className={step >= 7 ? 'text-pink-600 font-extrabold' : ''}>7. Review</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Basic Information */}
      {step === 1 && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Step 1 — Basic Salon Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Salon Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elegance Beauty & Hair Lounge"
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Salon Description *</label>
              <textarea
                required
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your salon services, ambiance, and specialty treatments..."
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@salon.com"
                  className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                if (!name || !description || !email || !phone) {
                  setError('Please fill in all required basic info fields.');
                  return;
                }
                setError('');
                setStep(2);
              }}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
            >
              <span>Next: Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Location */}
      {step === 2 && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Step 2 — Salon Location</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop No. 12, Hill Road, Bandra West"
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="400050"
                  className="w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Latitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="19.0600"
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Longitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="72.8300"
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!address || !city || !state || !postalCode) {
                  setError('Please fill in all required location fields.');
                  return;
                }
                setError('');
                setStep(3);
              }}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
            >
              <span>Next: Images</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Salon Images */}
      {step === 3 && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Step 3 — Salon Photos & Images</h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 p-8 rounded-2xl text-center space-y-3 bg-gray-50/50 hover:border-pink-400 transition">
              <Upload className="w-10 h-10 text-pink-500 mx-auto" />
              <div>
                <p className="font-bold text-gray-800 text-sm">Upload Salon Photos</p>
                <p className="text-xs text-gray-500">JPG, PNG, WebP format (Max 5MB per file)</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded-xl text-xs inline-block cursor-pointer shadow"
              >
                Choose Image Files
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 h-28 bg-gray-100">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs shadow opacity-90 hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
            >
              <span>Next: Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Services */}
      {step === 4 && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Step 4 — Add Salon Services</h2>

          {/* Form to add service */}
          <form onSubmit={handleAddService} className="bg-pink-50/50 p-5 rounded-2xl border border-pink-100 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Add a Service</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={srvName}
                  onChange={(e) => setSrvName(e.target.value)}
                  placeholder="e.g. Executive Haircut & Blowout"
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={srvCatId}
                  onChange={(e) => setSrvCatId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={srvPrice}
                  onChange={(e) => setSrvPrice(e.target.value)}
                  placeholder="500"
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Duration (Mins) *</label>
                <input
                  type="number"
                  required
                  min="5"
                  value={srvDuration}
                  onChange={(e) => setSrvDuration(e.target.value)}
                  placeholder="45"
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={srvDesc}
                onChange={(e) => setSrvDesc(e.target.value)}
                placeholder="Professional haircut with hair wash and scalp massage"
                className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
              />
            </div>

            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service to List</span>
            </button>
          </form>

          {/* List of added services */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-gray-900 text-sm">Services Added ({servicesList.length})</h3>
            {servicesList.length === 0 ? (
              <p className="text-xs text-gray-400">No services added yet. Please add at least 1 service.</p>
            ) : (
              servicesList.map((srv, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-white flex justify-between items-center text-sm shadow-sm">
                  <div>
                    <div className="font-bold text-gray-900">{srv.name} <span className="text-xs font-semibold text-pink-600">({srv.category_name})</span></div>
                    <div className="text-xs text-gray-500">{srv.duration_minutes} mins • ₹{srv.price}</div>
                  </div>
                  <button onClick={() => handleRemoveService(idx)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (servicesList.length === 0) {
                  setError('Please add at least 1 service.');
                  return;
                }
                setError('');
                setStep(5);
              }}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
            >
              <span>Next: Staff</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Staff */}
      {step === 5 && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Step 5 — Add Staff & Stylists</h2>

          {/* Form to add staff */}
          <form onSubmit={handleAddStaff} className="bg-pink-50/50 p-5 rounded-2xl border border-pink-100 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">Add Staff Member</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Staff Name *</label>
                <input
                  type="text"
                  required
                  value={stName}
                  onChange={(e) => setStName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={stSpec}
                  onChange={(e) => setStSpec(e.target.value)}
                  placeholder="Hair Stylist & Colorist"
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Experience (Yrs)</label>
                <input
                  type="number"
                  min="0"
                  value={stExp}
                  onChange={(e) => setStExp(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={stPhone}
                  onChange={(e) => setStPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={stEmail}
                  onChange={(e) => setStEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff to List</span>
            </button>
          </form>

          {/* List of added staff */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-gray-900 text-sm">Staff Members Added ({staffList.length})</h3>
            {staffList.length === 0 ? (
              <p className="text-xs text-gray-400">No staff members added yet. Please add at least 1 staff member.</p>
            ) : (
              staffList.map((st, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-white flex justify-between items-center text-sm shadow-sm">
                  <div>
                    <div className="font-bold text-gray-900">{st.name} <span className="text-xs text-pink-600">({st.specialization})</span></div>
                    <div className="text-xs text-gray-500">{st.experience_years} yrs exp • {st.phone || 'No phone'}</div>
                  </div>
                  <button onClick={() => handleRemoveStaff(idx)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(4)}
              className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (staffList.length === 0) {
                  setError('Please add at least 1 staff member.');
                  return;
                }
                setError('');
                setStep(6);
              }}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
            >
              <span>Next: Working Hours</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Working Hours */}
      {step === 6 && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Step 6 — Weekly Working Hours</h2>

          <div className="divide-y divide-gray-100 space-y-3">
            {workingHours.map((wh, idx) => (
              <div key={wh.day_of_week} className="pt-3 flex items-center justify-between text-sm">
                <span className="font-bold text-gray-900 w-28">{wh.day_name}</span>

                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => handleToggleDay(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      wh.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {wh.is_open ? 'OPEN' : 'CLOSED'}
                  </button>

                  {wh.is_open && (
                    <div className="flex items-center space-x-2 text-xs font-semibold">
                      <input
                        type="time"
                        value={wh.opening_time}
                        onChange={(e) => handleTimeChange(idx, 'opening_time', e.target.value)}
                        className="px-2 py-1 border rounded-lg"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={wh.closing_time}
                        onChange={(e) => handleTimeChange(idx, 'closing_time', e.target.value)}
                        className="px-2 py-1 border rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(5)}
              className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(7)}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm flex items-center space-x-2"
            >
              <span>Next: Review Summary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Review & Submit */}
      {step === 7 && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Step 7 — Review & Submit Salon</h2>

          <div className="space-y-4 text-sm">
            {/* Salon Info Summary */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-base">{name}</span>
                <button onClick={() => setStep(1)} className="text-xs text-pink-600 font-bold hover:underline">Edit Info</button>
              </div>
              <p className="text-xs text-gray-600">{description}</p>
              <div className="text-xs text-gray-500">Contact: {phone} • {email}</div>
            </div>

            {/* Location Summary */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Location</span>
                <button onClick={() => setStep(2)} className="text-xs text-pink-600 font-bold hover:underline">Edit Location</button>
              </div>
              <div className="text-xs text-gray-600">{address}, {city}, {state} {postalCode}</div>
            </div>

            {/* Services Summary */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Services ({servicesList.length})</span>
                <button onClick={() => setStep(4)} className="text-xs text-pink-600 font-bold hover:underline">Edit Services</button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {servicesList.map((s, i) => (
                  <div key={i} className="bg-white p-2 rounded-lg border">
                    <span className="font-bold">{s.name}</span> — ₹{s.price} ({s.duration_minutes}m)
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Summary */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Staff ({staffList.length})</span>
                <button onClick={() => setStep(5)} className="text-xs text-pink-600 font-bold hover:underline">Edit Staff</button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {staffList.map((st, i) => (
                  <div key={i} className="bg-white p-2 rounded-lg border">
                    <span className="font-bold">{st.name}</span> ({st.specialization})
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs space-y-1">
              <p className="font-bold">⚠️ Salon Approval Notice</p>
              <p>Upon submission, your salon status will be <strong>PENDING ADMIN APPROVAL</strong>. It will not be visible on the public customer website until reviewed and approved by an admin.</p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(6)}
              className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleSubmitSalon}
              disabled={submitting}
              className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-pink-200 transition text-base disabled:opacity-50"
            >
              {submitting ? 'Submitting Salon Setup...' : 'Submit Salon for Approval'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
