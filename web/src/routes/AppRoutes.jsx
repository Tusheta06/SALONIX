import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

// Marketing Pages
import { Home } from '../pages/marketing/Home';
import { About } from '../pages/marketing/About';
import { HowItWorks } from '../pages/marketing/HowItWorks';
import { ForSalons } from '../pages/marketing/ForSalons';
import { Contact } from '../pages/marketing/Contact';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

// Customer Pages
import { SalonDiscovery } from '../pages/customer/SalonDiscovery';
import { SalonDetail } from '../pages/customer/SalonDetail';
import { BookingFlow } from '../pages/customer/BookingFlow';
import { MyBookings } from '../pages/customer/MyBookings';
import { CustomerProfile } from '../pages/customer/CustomerProfile';

// Salon Owner Pages
import { CreateSalon } from '../pages/salon/CreateSalon';
import { SalonDashboard } from '../pages/salon/SalonDashboard';
import { SalonProfile } from '../pages/salon/SalonProfile';
import { SalonServices } from '../pages/salon/SalonServices';
import { SalonStaff } from '../pages/salon/SalonStaff';
import { SalonHours } from '../pages/salon/SalonHours';
import { SalonLeaves } from '../pages/salon/SalonLeaves';
import { SalonAppointments } from '../pages/salon/SalonAppointments';

// Staff Stylist Pages
import { StaffDashboard } from '../pages/staff/StaffDashboard';
import { StaffAppointments } from '../pages/staff/StaffAppointments';
import { StaffSchedule } from '../pages/staff/StaffSchedule';
import { StaffLeave } from '../pages/staff/StaffLeave';
import { StaffProfile } from '../pages/staff/StaffProfile';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminSalons } from '../pages/admin/AdminSalons';
import { AdminSalonDetail } from '../pages/admin/AdminSalonDetail';
import { AdminCategories } from '../pages/admin/AdminCategories';
import { AdminCustomers } from '../pages/admin/AdminCustomers';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-12 text-center text-gray-500">Loading auth state...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'STAFF') return <Navigate to="/staff/dashboard" replace />;
    if (user.role === 'SALON_OWNER' || user.role === 'SALON_MANAGER') return <Navigate to="/salon/dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/salons" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public & Marketing */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/for-salons" element={<ForSalons />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Routes */}
          <Route path="/salons" element={<SalonDiscovery />} />
          <Route path="/salons/:id" element={<SalonDetail />} />
          <Route path="/booking" element={<BookingFlow />} />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                <CustomerProfile />
              </ProtectedRoute>
            }
          />

          {/* Salon Owner Routes */}
          <Route
            path="/owner/create-salon"
            element={
              <ProtectedRoute allowedRoles={['SALON_OWNER', 'SALON_MANAGER', 'ADMIN']}>
                <CreateSalon />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salon/dashboard"
            element={
              <ProtectedRoute allowedRoles={['SALON_OWNER', 'SALON_MANAGER', 'ADMIN']}>
                <SalonDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salon/profile"
            element={
              <ProtectedRoute allowedRoles={['SALON_OWNER', 'SALON_MANAGER', 'ADMIN']}>
                <SalonProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salon/services"
            element={
              <ProtectedRoute allowedRoles={['SALON_OWNER', 'SALON_MANAGER', 'ADMIN']}>
                <SalonServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salon/staff"
            element={
              <ProtectedRoute allowedRoles={['SALON_OWNER', 'SALON_MANAGER', 'ADMIN']}>
                <SalonStaff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salon/hours"
            element={
              <ProtectedRoute allowedRoles={['SALON_OWNER', 'SALON_MANAGER', 'ADMIN']}>
                <SalonHours />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salon/leaves"
            element={
              <ProtectedRoute allowedRoles={['SALON_OWNER', 'SALON_MANAGER', 'ADMIN']}>
                <SalonLeaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salon/appointments"
            element={
              <ProtectedRoute allowedRoles={['SALON_OWNER', 'SALON_MANAGER', 'ADMIN']}>
                <SalonAppointments />
              </ProtectedRoute>
            }
          />

          {/* Dedicated Staff Routes */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/appointments"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <StaffAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/schedule"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <StaffSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/leave"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <StaffLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/profile"
            element={
              <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
                <StaffProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Panel Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/salons"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminSalons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/salons/:id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminSalonDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminCategories />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
