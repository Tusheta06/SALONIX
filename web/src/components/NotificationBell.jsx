import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, Calendar, Store, Star, Info, ShieldCheck, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export const NotificationBell = () => {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }
    setIsOpen(false);

    // Smart navigation based on notification type and user role
    const type = notif.notification_type || '';
    if (
      type.includes('BOOKING') ||
      type.includes('APPOINTMENT')
    ) {
      if (user?.role === 'CUSTOMER') {
        navigate('/my-bookings');
      } else if (user?.role === 'SALON_OWNER' || user?.role === 'SALON_MANAGER') {
        navigate('/salon/dashboard');
      } else if (user?.role === 'STAFF') {
        navigate('/staff/appointments');
      } else if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      }
    } else if (type.includes('SALON') || type.includes('OWNER')) {
      if (user?.role === 'ADMIN') {
        navigate('/admin/salons');
      } else if (user?.role === 'SALON_OWNER' || user?.role === 'SALON_MANAGER') {
        navigate('/salon/dashboard');
      }
    } else if (type.includes('REVIEW')) {
      if (user?.role === 'CUSTOMER') {
        navigate('/my-bookings');
      } else {
        navigate('/salon/dashboard');
      }
    }
  };

  const getNotificationIcon = (type) => {
    if (type?.includes('BOOKING') || type?.includes('APPOINTMENT')) {
      return <Calendar className="w-4 h-4 text-pink-600" />;
    }
    if (type?.includes('SALON') || type?.includes('OWNER')) {
      return <Store className="w-4 h-4 text-purple-600" />;
    }
    if (type?.includes('REVIEW')) {
      return <Star className="w-4 h-4 text-amber-500" />;
    }
    return <Info className="w-4 h-4 text-blue-500" />;
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-xl text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-pink-600 rounded-full border-2 border-white shadow-sm animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-fadeIn">
          {/* Header */}
          <div className="px-4 pb-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 text-base">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-pink-100 text-pink-700 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-pink-600 hover:text-pink-700 font-medium hover:underline flex items-center space-x-1"
                  title="Mark all as read"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center text-gray-400 space-y-2">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-300">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-gray-600">No notifications yet</p>
                <p className="text-xs text-gray-400">We'll alert you here when updates happen.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`px-4 py-3 hover:bg-pink-50/40 cursor-pointer transition flex items-start space-x-3 group relative ${
                    !notif.is_read ? 'bg-pink-50/20' : ''
                  }`}
                >
                  {/* Unread indicator dot */}
                  {!notif.is_read && (
                    <span className="w-2 h-2 rounded-full bg-pink-600 absolute left-2 top-4 flex-shrink-0" />
                  )}

                  {/* Type icon */}
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notif.notification_type)}
                  </div>

                  {/* Text body */}
                  <div className="flex-1 min-w-0 pr-6">
                    <p
                      className={`text-xs font-bold leading-tight ${
                        !notif.is_read ? 'text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {notif.time_ago || 'Just now'}
                    </span>
                  </div>

                  {/* Delete button on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 p-1 rounded transition absolute right-3 top-3"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          {notifications.length > 0 && (
            <div className="px-4 pt-2 pb-1 border-t border-gray-100 text-center">
              <span className="text-[11px] text-gray-400">
                Click any notification to navigate
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
